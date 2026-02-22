import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import PaymentMethod from "../models/paymentMethod.model.js";
import Transaction from "../models/transaction.model.js";
import Big from "big.js";
import mongoose from "mongoose";

// POST /transactions/validate-passphrase
export const validatePassphrase = async (req, res) => {
  const userId = req.user.id;
  const { passphrase } = req.body;
  try {
    if (!passphrase) {
      return res.status(400).json({ message: "Passphrase is required" });
    }

    const user = await User.findById(userId).select(
      "transactionPassphraseHash passphraseAttempts passphraseLockUntil hasTransactionPassphrase"
    );

    if (!user || !user.hasTransactionPassphrase) {
      return res.status(400).json({ message: "Passphrase not set" });
    }

    // --- Check lockout ---
    if (user.passphraseLockUntil && user.passphraseLockUntil > Date.now()) {
      const remaining = Math.ceil(
        (user.passphraseLockUntil - Date.now()) / 1000 / 60
      );

      return res.status(423).json({
        message: `Address locked. Try again in ${remaining} minutes`,
      });
    }

    // --- Compare hash ---
    const isMatch = await bcrypt.compare(
      passphrase,
      user.transactionPassphraseHash
    );

    if (!isMatch) {
      // Increase failed attempts
      user.passphraseAttempts = (user.passphraseAttempts || 0) + 1;

      // If attempts reach 3 → lock account for 15 minutes
      if (user.passphraseAttempts >= 3) {
        user.passphraseLockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.passphraseAttempts = 0; // reset after lock
      }

      await user.save();

      return res.status(401).json({ message: "Invalid passphrase" });
    }

    // --- Success ---
    user.passphraseAttempts = 0;
    user.passphraseLockUntil = null;
    // NEW: allow access for 5 minutes
    user.passphraseVerifiedUntil = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      validate: true,
    });
  } catch (err) {
    console.error("validatePassphrase error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /methods
export const getPaymentMethods = async (req, res) => {
  try {
    // 1. Fetch only active methods
    const methods = await PaymentMethod.find(
      { isActive: true },
      "name icon network desc" // 2. Trim fields
    ).lean();

    // 3. Add locked flag for frontend
    const formatted = methods.map((m) => ({
      ...m,
      addressLocked: true, // Do NOT return address yet
    }));

    return res.status(200).json({
      success: true,
      methods: formatted,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment methods",
    });
  }
};

// GET /methods/:id/address
export const getPaymentMethodAddress = async (req, res) => {
  const userId = req.user.id;
  const methodId = req.params.id;
  try {
    // 1. Get user
    const user = await User.findById(userId).select("passphraseVerifiedUntil");

    if (
      !user.passphraseVerifiedUntil ||
      user.passphraseVerifiedUntil < Date.now()
    ) {
      return res.status(403).json({
        message: "Passphrase verification expired or missing ..Enter again",
      });
    }

    // 2. Get the payment method
    const method = await PaymentMethod.findById(methodId);

    if (!method) {
      return res.status(404).json({ message: "Method not found" });
    }

    return res.status(200).json({
      method: {
        name: method.name,
        address: method.address,
        network: method.network,
      },
    });
  } catch (err) {
    console.error("getPaymentMethodAddress error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- DEPOSIT CONTROLLER ---
export const createDeposit = async (req, res) => {
  const userId = req.user.id;
  const { amount, methodId } = req.body;

  try {
    // 1. Validate inputs
    if (!amount || !methodId) {
      return res
        .status(400)
        .json({ message: "Amount and methodId are required" });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 2. Get payment method
    const method = await PaymentMethod.findById(methodId);
    if (!method || !method.isActive) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    // 3. Prepare snapshot (not returned to client)
    const methodSnapshot = {
      name: method.name,
      icon: method.icon,
      address: method.address,
      network: method.network,
    };

    // 4. Generate transaction ID
    const transactionId =
      "DEP-" + Date.now() + "-" + Math.floor(Math.random() * 99999);

    // 5. Create deposit transaction (pending)
    const deposit = await Transaction.create({
      user: userId,
      type: "deposit",
      amount: Number(amount),
      method: methodId,
      methodSnapshot,
      transactionId,
      status: "pending",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "unknown",
      createdAt: new Date(),
    });

    // 6. Return a clean response (history-like)
    return res.status(201).json({
      id: deposit._id,
      ref: transactionId,
      method: methodSnapshot.name,
      amount: amount,
      status: "Pending",
      date: deposit.createdAt.toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("createDeposit error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /admin/transactions/:id/status
export const updateTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body; // "approved" or "rejected"

  try {
    // 1. Validate input
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 2. Fetch transaction
    const tx = await Transaction.findById(transactionId);
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (tx.type !== "deposit") {
      return res
        .status(400)
        .json({ message: "Only deposit transactions can be approved" });
    }

    // 3. If already in the same status → ignore
    if (tx.status === status) {
      return res.status(200).json({ success: true });
    }

    // 4. On approve → update user balance
    if (status === "approved") {
      const user = await User.findById(tx.user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add deposit amount to balance
      const newBalance = Big(user.balance.toString()).plus(
        Big(tx.amount.toString())
      );
      user.balance = mongoose.Types.Decimal128.fromString(
        newBalance.toString()
      );
      await user.save();
    }

    // 5. Update transaction status
    tx.status = status;
    await tx.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("updateTransactionStatus error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Get user transaction history (deposit + withdraw) ---
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // coming from authorize middleware

    // Get deposits
    const deposits = await Transaction.find({
      user: userId,
      type: "deposit",
    }).sort({ createdAt: -1 });

    // Get withdrawals
    const withdrawals = await Transaction.find({
      user: userId,
      type: "withdraw",
    }).sort({ createdAt: -1 });

    // --- Format deposits ---
    const formattedDeposits = await Promise.all(
      deposits.map((deposit) => {
        return {
          id: deposit._id,
          ref: deposit.transactionId, // your TX reference
          method: deposit.methodSnapshot?.name || "Unknown",
          amount: deposit.amount,
          status: deposit.status, // usually Pending
          date: deposit.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
        };
      })
    );

    // --- Format withdrawals ---
    const formattedWithdrawals = withdrawals.map((withdraw) => ({
      id: withdraw._id,
      ref: withdraw.transactionId,
      method: withdraw.withdrawalMethod, // withdraw already stores text
      amount: withdraw.amount,
      status: withdraw.status,
      date: withdraw.createdAt.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      deposits: formattedDeposits,
      withdrawals: formattedWithdrawals,
    });
  } catch (error) {
    console.error("Error getting user transactions:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving transactions",
    });
  }
};

// --- POST /withdraw ---
// User requests a withdrawal
export const createWithdrawal = async (req, res) => {
  const userId = req.user.id;
  const { amount, method, address } = req.body;

  try {
    // 1. Validate fields
    if (!amount || !method || !address) {
      return res.status(400).json({
        message: "Amount, method, and address are required",
      });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Check balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 4. Generate reference ID
    const transactionId = `TX-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // 5. Create transaction
    const withdrawTx = await Transaction.create({
      user: userId,
      type: "withdraw",
      amount,
      withdrawalMethod: method, // string
      withdrawalAddress: address, // string
      status: "pending",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "unknown",
      createdAt: new Date(),
      transactionId,
    });

    // 6. Return response
    return res.status(201).json({
      success: true,
      message: "Withdrawal request submitted",
      transaction: {
        id: withdrawTx._id,
        ref: withdrawTx.transactionId,
        method: withdrawTx.withdrawalMethod,
        address: withdrawTx.withdrawalAddress,
        amount: withdrawTx.amount,
        status: withdrawTx.status,
        date: withdrawTx.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (err) {
    console.error("createWithdrawal error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};
