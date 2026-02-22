import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bot", "copy-trader", "package"],
      required: true,
    },

    // Shared fields
    name: { type: String, required: true },
    handle: { type: String }, // only for copy traders
    description: { type: String },

    // ---- Copy Traders / Bots Stats ----
    stats: {
      followers: Number,
      roi: Number,
      winRate: Number,
      equity: Number,
    },

    price: Number,
    features: [String],

    // Just in case we need more flexible fields later
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription
