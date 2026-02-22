import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The user-owned subscriptions
    subscriptions: [
      {
        subscriptionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subscription", // Bots, copy traders, packages
          required: true,
        },
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;