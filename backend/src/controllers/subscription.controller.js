import { validateBot, validateCopyTrader, validatePackage } from "../config/utils.js";
import Subscription from "../models/subscription.model.js";


/*---------------------------------------------------------------------
  BOT CONTROLLERS
-----------------------------------------------------------------------*/

// GET all bots
export const getBots = async (req, res) => {
  try {
    const bots = await Subscription.find({ type: "bot" });
    res.status(200).json({ success: true, data: bots });
  } catch (err) {
    console.error("Error fetching bots:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addBot = async (req, res) => {
  try {
    // Validate fields first
    const validationError = validateBot(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { name } = req.body;

    // Check if the bot already exists (unique constraints)
    const existingBot = await Subscription.findOne({
      type: "bot",
      $or: [ { name }],
    });

    if (existingBot) {
      return res.status(409).json({
        success: false,
        message: "A bot with this  name already exist ",
      });
    }

    // Create bot
    const bot = await Subscription.create({
      type: "bot",
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      data: bot,
    });
  } catch (err) {
    console.error("Error adding bot:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*---------------------------------------------------------------------
  COPY-TRADER CONTROLLERS
-----------------------------------------------------------------------*/

// GET all copy traders
export const getCopyTraders = async (req, res) => {
  try {
    const traders = await Subscription.find({ type: "copy-trader" });
    res.status(200).json({ success: true, data: traders });
  } catch (err) {
    console.error("Error fetching copy traders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD copy trader
export const addCopyTrader = async (req, res) => {
  try {
    const validationError = validateCopyTrader(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {  handle } = req.body;

    const existingCopyTrader = await Subscription.findOne({
      type: "copy-trader",
      $or: [ { handle }],
    });

    if (existingCopyTrader) {
      return res.status(409).json({
        success: false,
        message: "A copy trader with this handle already exist",
      });
    }

    const trader = await Subscription.create({
      type: "copy-trader",
      ...req.body,
    });

    res.status(201).json({ success: true, data: trader });
  } catch (err) {
    console.error("Error adding copy trader:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/*---------------------------------------------------------------------
  TRADING PACKAGES CONTROLLERS
-----------------------------------------------------------------------*/

// GET all trading packages
export const getTradingPackages = async (req, res) => {
  try {
    const packs = await Subscription.find({ type: "package" });
    res.status(200).json({ success: true, data: packs });
  } catch (err) {
    console.error("Error fetching trading packages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD trading package
export const addTradingPackage = async (req, res) => {
  try {
    const validationError = validatePackage(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const {  name } = req.body;

    const existingPackage = await Subscription.findOne({
      type: "package",
      $or: [ { name }],
    });

    if (existingPackage) {
      return res.status(409).json({
        success: false,
        message: "A trading package with this  name already exist",
      });
    }

    const pack = await Subscription.create({
      type: "package",
      ...req.body,
    });

    res.status(201).json({ success: true, data: pack });
  } catch (err) {
    console.error("Error adding trading package:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
