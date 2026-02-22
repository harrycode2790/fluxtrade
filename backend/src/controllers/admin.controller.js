import mongoose from "mongoose";
import Portfolio from "../models/portfolio.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import Order from "../models/order.model.js";

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      verificationStatus,
      kycStatus,
      accountStatus,
      includeDeleted,
      sort = "desc",
    } = req.query;

    const query = {};

    // // soft delete handling (best practice)
    // if (includeDeleted !== "true") {
    //    query.isDeleted = false;
    //  }

    // filters
    if (verificationStatus !== undefined) {
      query.verificationStatus = verificationStatus === "true";
    }

    if (kycStatus) {
      query.kycStatus = kycStatus;
    }

    if (accountStatus) {
      query.accountStatus = accountStatus;
    }

    const users = await User.find(query)
      .select(
        "firstName lastName email country verificationStatus accountStatus"
      )
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      meta: {
        total: totalUsers,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// get Active Users
export const getAllActiveUsers = async (req, res) => {
  try {
    // find all distinct user IDs from orders
    const activeUserIds = await Order.distinct("user");

    // fetch users info
    const users = await User.find({ _id: { $in: activeUserIds } })
      .select("firstName lastName email country verificationStatus accountStatus");

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin get active users error:", error);
    res.status(500).json({ message: "Failed to fetch active users" });
  }
};

// get user/:id
export const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select(
      "-password -transactionPassphraseHash -resetPasswordCode -resetPasswordExpires -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Admin get single user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// soft delete by the admin
export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update soft delete fields
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id; // admin ID

    await user.save();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Admin soft delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// return user portifilio
export const getUserPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;

    // validate user
    const user = await User.findById(userId).select("balance isDeleted");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // block soft-deleted users
    if (user.isDeleted) {
      return res
        .status(403)
        .json({ message: "Cannot view portfolio of a deleted user" });
    }

    // get portfolio (1 per user)
    const portfolio = await Portfolio.findOne({ user: userId }).populate({
      path: "subscriptions.subscriptionId",
      select: "name type -_id",
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "User portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      balance: user.balance,
      subscriptions: portfolio.subscriptions,
      portfolioId: portfolio._id,
      createdAt: portfolio.createdAt,
    });
  } catch (error) {
    console.error("Admin get user portfolio error:", error);
    res.status(500).json({
      message: "Failed to fetch user portfolio",
    });
  }
};

// =========================
// GET TOTAL ORDERS BY TYPE (stock / crypto)
// =========================
export const getTotalOrdersByType = async (req, res) => {
  try {
    // count stock orders
    const totalStockOrders = await Order.countDocuments({ type: "stock" });

    // count crypto orders (spot)
    const totalCryptoOrders = await Order.countDocuments({ type: "spot" });

    res.status(200).json({
      success: true,
      totalStockOrders,
      totalCryptoOrders,
    });
  } catch (error) {
    console.error("Admin get total orders error:", error);
    res.status(500).json({ message: "Failed to fetch total orders" });
  }
};

// get All transactions by fitering ( user , type, status)
export const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      user,
      type,
      status,
      sort = "desc",
    } = req.query;

    const query = {};

    // Filters
    if (user && mongoose.Types.ObjectId.isValid(user)) {
      query.user = user;
    }

    if (type) {
      query.type = type; // deposit | withdrawal
    }

    if (status) {
      query.status = status; // pending | approved | rejected
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: "user",
        select: "firstName lastName email country",
      })
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Transaction.countDocuments(query);

    // Clean admin-friendly format
    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id,
      reference: tx.reference,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      user: tx.user
        ? {
            name: `${tx.user.firstName} ${tx.user.lastName}`,
            email: tx.user.email,
            country: tx.user.country,
          }
        : null,
      method: tx.methodSnapshot,
      withdrawalAddress: tx.withdrawalAddress,
      createdAt: tx.createdAt,
    }));

    res.status(200).json({
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error("Admin get transactions error:", error);
    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};

// get All subscriptions 
export const getAllSubscriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      sort = "desc",
    } = req.query;

    const query = {};

    // Optional filter by type (bot | copy-trader | package)
    if (type) {
      query.type = type;
    }

    const subscriptions = await Subscription.find(query)
      .select(
        "type name price createdAt updatedAt"
      ) //  summary ONLY
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Subscription.countDocuments(query);

    res.status(200).json({
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      subscriptions,
    });
  } catch (error) {
    console.error("Admin get subscriptions error:", error);
    res.status(500).json({
      message: "Failed to fetch subscriptions",
    });
  }
};

// get Single Subscription 
export const getSingleSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Admin get single subscription error:", error);
    res.status(500).json({
      message: "Failed to fetch subscription",
    });
  }
};

// delete any subscription 
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete subscription error:", error);
    res.status(500).json({
      message: "Failed to delete subscription",
    });
  }
};

// update bots subscription 
export const updateBotSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // Ensure this is a BOT subscription
    if (subscription.type !== "bot") {
      return res.status(400).json({
        message: "Invalid subscription type. This route is for bots only.",
      });
    }

    const {
      name,
      description,
      price,
      features,
      stats,
    } = req.body;

    // Update allowed fields only
    if (name !== undefined) subscription.name = name;
    if (description !== undefined) subscription.description = description;
    if (price !== undefined) subscription.price = price;
    if (features !== undefined) subscription.features = features;

    if (stats) {
      subscription.stats = {
        ...subscription.stats,
        ...stats, // followers, roi, winRate, equity
      };
    }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Bot subscription updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Admin update bot subscription error:", error);
    res.status(500).json({
      message: "Failed to update bot subscription",
    });
  }
};

// update copy trader subscription 
export const updateCopyTraderSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // Ensure this is a COPY-TRADER subscription
    if (subscription.type !== "copy-trader") {
      return res.status(400).json({
        message: "Invalid subscription type. This route is for copy traders only.",
      });
    }

    const {
      name,
      handle,
      description,
      price,
      features,
      stats,
      meta,
    } = req.body;

    // Update allowed top-level fields
    if (name !== undefined) subscription.name = name;
    if (handle !== undefined) subscription.handle = handle;
    if (description !== undefined) subscription.description = description;
    if (price !== undefined) subscription.price = price;
    if (features !== undefined) subscription.features = features;

    // Update stats safely
    if (stats) {
      subscription.stats = {
        ...subscription.stats,
        ...stats, // followers, roi, winRate, equity
      };
    }

    // Update meta safely
    if (meta) {
      subscription.meta = {
        ...subscription.meta,
        ...meta, // platform, tradingStyle, riskLevel
      };
    }

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Copy trader subscription updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Admin update copy trader subscription error:", error);
    res.status(500).json({
      message: "Failed to update copy trader subscription",
    });
  }
};

// update trading package
export const updateTradingPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // Ensure this is a TRADING PACKAGE
    if (subscription.type !== "package") {
      return res.status(400).json({
        message: "Invalid subscription type. This route is for trading packages only.",
      });
    }

    const {
      name,
      price,
      features,
    } = req.body;

    // Update allowed fields only
    if (name !== undefined) subscription.name = name;
    if (price !== undefined) subscription.price = price;
    if (features !== undefined) subscription.features = features;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Trading package updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Admin update trading package error:", error);
    res.status(500).json({
      message: "Failed to update trading package",
    });
  }
};

// get transaction chart 
export const getTransactionChart = async (req, res) => {
  const { type = "deposit", days = 7 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Transaction.aggregate([
    {
      $match: {
        type,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        value: { $sum: "$amount" }, // OR { $sum: 1 } for count
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: data.map((d) => ({
      date: d._id,
      value: Number(d.value),
    })),
  });
};

// GET /admin/transactions-bar
export const getTransactionsBarChart = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1 = Sun ... 7 = Sat
          total: { $sum: 1 }, // count transactions
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const dayMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    };

    res.json({
      success: true,
      data: data.map((d) => ({
        name: dayMap[d._id],
        value: d.total,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load bar chart data" });
  }
};









