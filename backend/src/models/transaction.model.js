import mongoose from "mongoose";

const { Decimal128 } = mongoose.Schema.Types;

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },

  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
  },

  // Snapshot of method at time of transaction (prevents data mismatch if admin edits method later)
  methodSnapshot: {
    name: String,
    icon: String,
    address: String,
    network: String,
  },

  amount: {
    type: Decimal128,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  withdrawalMethod:{
    type: String,
    default: null, // Only for withdraw
  },

  withdrawalAddress: {
    type: String,
    default: null, // Only for withdraw
  },

  reference: {
    type: String,
    unique: true,
  },

  ipAddress: {
    type: String,
    required: true,
  },

}, { timestamps: true });

// Pre-generate reference before saving
transactionSchema.pre("validate", function(next) {
  if (!this.reference) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `TX-${Date.now()}-${random}`;
  }
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;