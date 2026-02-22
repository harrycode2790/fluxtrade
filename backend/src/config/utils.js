import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import User from "../models/user.model.js";
import axios from "axios";

export const generateToken = (userId, res) => {
    if (!ENV.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '3d',
    })

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // this will prevent the XSS (cross-site scripting) attacks     
        sameSite: "strict", // CSRF protection
        secure: ENV.NODE_ENV === 'development' ? false : true  // set to true in production
    })

    return token;
}


/*---------------------------------------------------------------------
  HELPERS — VALIDATION
-----------------------------------------------------------------------*/

// Validate Bot fields
export const validateBot = (body) => {
  const required = [ "name", "description","price",];
  const missing = required.filter((f) => !body[f]);

  if (missing.length) {
    return `Missing required bot fields: ${missing.join(", ")}`;
  }
  return null;
};

// Validate Copy Trader fields
export const validateCopyTrader = (body) => {
  const required = [ "name", "handle", "price",];
  const missing = required.filter((f) => !body[f]);

  if (missing.length) {
    return `Missing required copy-trader fields: ${missing.join(", ")}`;
  }
  return null;
};

// Validate Package fields
export const validatePackage = (body) => {
  const required = [ "name", "price", "features"];
  const missing = required.filter((f) => !body[f]);

  if (missing.length) {
    return `Missing required trading-package fields: ${missing.join(", ")}`;
  }

  if (!Array.isArray(body.features)) {
    return "Package features must be an array of strings";
  }

  return null;
};


// Orders helpers 

export const getLivePrice = async (assetId) => {
  const { data } = await axios.get(`${ENV.CLIENT_URL}/api/assets/${assetId}`);
 
  return data.data.current_price; // your getAssetById should return latest price
};

export const adjustBalance = async (userId, amount) => {
  return await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );
};