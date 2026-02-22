// models/order.model.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, default: () => `ORD-${nanoid(8)}` },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },

    asset: { type: String, ref: "MarketAsset", required: true, },

    // "spot" for crypto, "stock" for stocks
    type: { type: String, enum: ["spot", "stock"], required: true },

    side: { type: String, enum: ["BUY", "SELL"], required: true },

    // units/shares/coins
    amount: { type: Number, required: true, min: 0 },

    // entryPrice captured when placing order
    entryPrice: { type: Number, required: true, min: 0 },

    // latest observed price from updater
    lastPrice: { type: Number, default: null },

    // for crypto optional, for stocks can be omitted
    tp: { type: Number, default: null },
    sl: { type: Number, default: null },

    // simplified price field referencing entryPrice for legacy compatibility
    price: { type: Number, },

    placedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["open", "running", "closed", "profit", "loss", "pending"],
      default: "open",
    },

    isOpen: { type: Boolean, default: true },

    // realized amount after close (net of fee)
    winAmount: { type: Number, default: 0 },

    // unrealized pnl computed by updater
    unrealizedPnL: { type: Number, default: 0 },

    // store small price history for charting
    priceHistory: {
      type: [{ price: Number, ts: Date }],
      default: [],
    },

    feePercent: { type: Number, default: 0 }, // percent e.g. 0.1 => 0.1%

    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

orderSchema.index({ asset: 1 });
orderSchema.index({ user: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
