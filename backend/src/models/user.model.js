import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Personal Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },

    // Password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Profile
    profilePic: {
      type: String,
      default: "",
    },

    // Step 2 fields
    cryptoWalletName: {
      type: String,
      default: "",
    },
    tradedBefore: {
      type: String,
      enum: ["yes", "no", null],
      default: null,
    },
    highestInvestment: {
      type: Number,
      default: 0,
    },

    // Backend fields
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0,
    },
    accountStatus: {
      type: String,
      enum: ["basic", "pro", "premium"],
      default: "basic",
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    transactionPassphraseHash: {
      type: String,
      required: false,
    },

    hasTransactionPassphrase: {
      type: Boolean,
      default: false,
    },
    passphraseAttempts: {
      type: Number,
      default: 0,
    },
    passphraseLockUntil: {
      type: Date,
      default: null,
    },
    passphraseVerifiedUntil: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference admin who deleted
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
