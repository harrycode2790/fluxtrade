import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Bitcoin, Tether(TRC20), etc
  },

  icon: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  address: {
    type: String,
    required: true, // the actual deposit address stored here
  },

  network: {
    type: String,
    default: null, // e.g. TRC20, ERC20, etc (optional)
  },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;