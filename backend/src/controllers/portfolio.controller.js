// controllers/portfolio.controller.js

import Portfolio from "../models/portfolio.model.js";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";

/**
 * POST /portfolio/buy
 * Body: { subscriptionId: String, price: Number }
 */
export const buySubscription = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { subscriptionId} = req.body;
    if (!subscriptionId)
      return res
        .status(400)
        .json({ message: "subscriptionId  are required" });

    // 1) Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2) Find subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    const price = subscription.price;
    
    // 4) Check balance
    if (Number(user.balance) < Number(price))
      return res.status(402).json({ message: "Insufficient funds" });

    // 5) Load or create portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, subscriptions: [] });
    }

    // 6) Prevent duplicate subscriptionId
    const alreadyOwns = portfolio.subscriptions.some((entry) =>
      entry.subscriptionId.equals(subscription._id)
    );
    if (alreadyOwns)
      return res
        .status(409)
        .json({ message: "User already owns this subscription" });

    // 7) Handle package replacement (upgrade)
    if (subscription.type === "package") {
      const ownedIds = portfolio.subscriptions.map((s) => s.subscriptionId);
      const existingPackage = await Subscription.findOne({
        _id: { $in: ownedIds },
        type: "package",
      }).lean();

      if (existingPackage) {
        portfolio.subscriptions = portfolio.subscriptions.filter(
          (entry) => !entry.subscriptionId.equals(existingPackage._id)
        );
      }
    }

    // 8) Add new subscription
    portfolio.subscriptions.push({
      subscriptionId: subscription._id,
      purchasedAt: new Date(),
    });

    // 9) Deduct balance
    user.balance = Number(user.balance) - Number(price);

    // 10) Save changes
    await user.save();
    await portfolio.save();

    // 11) Return populated subscription
    const updatedPortfolio = await Portfolio.findOne({ user: userId }).populate(
      "subscriptions.subscriptionId"
    );

    const addedEntry = updatedPortfolio.subscriptions.find((entry) =>
      entry.subscriptionId._id.equals(subscription._id)
    );

    return res.status(200).json({
      success: true,
      message: "Subscription purchased successfully",
    });
  } catch (err) {
    console.error("buySubscription error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /portfolio/
 * Returns user-owned subscriptions grouped by type
 */
export const getGroupedSubscriptions = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Find user's portfolio and populate subscription data
    const portfolio = await Portfolio.findOne({ user: userId }).populate(
      "subscriptions.subscriptionId"
    );

    if (!portfolio || portfolio.subscriptions.length === 0) {
      return res.status(200).json({
        bots: [],
        copyTraders: [],
        packages: [],
      });
    }

    // Group subscriptions by type
    const grouped = {
      bots: [],
      copyTraders: [],
      packages: [],
    };

    portfolio.subscriptions.forEach((entry) => {
      const sub = entry.subscriptionId;
      if (!sub) return; // skip if subscription data is missing

      const subscriptionData = {
        ...sub.toObject(), // all subscription fields
        purchasedAt: entry.purchasedAt, // include portfolio metadata
      };

      switch (sub.type) {
        case "bot":
          grouped.bots.push(subscriptionData);
          break;
        case "copy-trader":
          grouped.copyTraders.push(subscriptionData);
          break;
        case "package":
          grouped.packages.push(subscriptionData);
          break;
        default:
          break; // ignore unknown types
      }
    });

    return res.status(200).json(grouped);
  } catch (err) {
    console.error("getGroupedSubscriptions error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
