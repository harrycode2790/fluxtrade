import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/utils.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      cryptoWalletName,
      tradedBefore,
      highestInvestment,
    } = req.body;

    // ---- REQUIRED FIELDS CHECK ----
    const requiredFields = [
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
    ];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ message: "All fields are required." });
    }
    

    // ---- UNIQUE EMAIL CHECK ----
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // ---- HASH PASSWORD ----
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ---- CREATE USER ----
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      country,
      cryptoWalletName,
      tradedBefore,
      highestInvestment,
    });

    // ---- RETURN ONLY A REDIRECT INSTRUCTION ----
    return res.status(201).json({
      message: "Account created successfully.",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if the ther is eamil or password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // find the user

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid Credentails." });

    // prevent login if user is soft deleted
    if (user.isDeleted) {
      return res
        .status(403)
        .json({ message: "Account has been deleted. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentails." });

    // generate token

    generateToken(user._id, res);

    // ---------- RESPONSE ----------
    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        profilePic: user.profilePic,
        accountStatus: user.accountStatus,
        verificationStatus: user.verificationStatus,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email." });
    }

    // 3. Check for existing, unexpired reset code
    if (
      user.resetPasswordCode &&
      user.resetPasswordExpires &&
      user.resetPasswordExpires > Date.now()
    ) {
      const remainingMs = user.resetPasswordExpires - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

      return res.status(429).json({
        message: `A reset code was already sent. Please try again in ${remainingMinutes} minute(s).`,
        remainingMinutes,
      });
    }

    // 4. Generate new 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Save new code + expiration (15 minutes)
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // TODO: send resetCode to user's email

    return res.status(200).json({
      message: "Password reset code sent. Please check your email.",
      // DEV ONLY — remove in production
      devResetCode: resetCode,
      devResetPasswordExpires: user.resetPasswordExpires,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword, confirmPassword } = req.body;

    // ----- BASIC VALIDATION -----
    if (!email || !resetCode || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Email, reset code, and passwords are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // ----- FIND USER WITH VALID RESET CODE -----
    const user = await User.findOne({
      email,
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() }, // code is still valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset code." });
    }

    // ----- HASH NEW PASSWORD -----
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ----- CLEAR RESET FIELDS -----
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error." });
  }
};
