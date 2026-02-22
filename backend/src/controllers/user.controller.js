import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// update verifaction statuts by admin
export const updateVerificationStatus = async (req, res) => {
  const {userId} = req.params;
  const { status } = req.body; // "approved" or "rejected"

  try {
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'approved' or 'rejected'.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // update fields
    user.verificationStatus = status === "approved";
    user.kycStatus = status;

    await user.save();

    res.status(200).json({
      message: `User verification ${status} successfully.`,
      user: {
        _id: user._id,
        verificationStatus: user.verificationStatus,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error("Error updating verification:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// create transaction passphrase (only once)
export const createTransactionPassphrase = async (req, res) => {
  const userId = req.user._id;
  const { passphrase } = req.body;
  try {
    // 1. Validate input
    if (!passphrase || typeof passphrase !== "string") {
      return res.status(400).json({ error: "Passphrase is required" });
    }

    // 2. Minimum length check (you said yes to restrictions)
    if (passphrase.length < 4) {
      return res
        .status(400)
        .json({ error: "Passphrase must be at least 4 characters long" });
    }

    // 3. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 4. Block if already set
    if (user.hasTransactionPassphrase) {
      return res.status(403).json({
        error: "Passphrase already set. Cannot create again.",
      });
    }

    // 5. Hash passphrase
    const hashed = await bcrypt.hash(passphrase, 10);

    // 6. Save to user
    user.transactionPassphraseHash = hashed;
    user.hasTransactionPassphrase = true;

    await user.save();

    return res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
