import Big from "big.js";
import { adjustBalance, getLivePrice } from "../config/utils.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const placeCryptoOrder = async (req, res) => {
  try {
    const { assetId, side, amount, tp, sl } = req.body;
    const userId = req.user._id;

    const userBalance = parseFloat(req.user.balance.toString());

    if (userBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 1. Get live market price
    const entryPrice = await getLivePrice(assetId);

    // 2. Compute cost for BUY (SELL doesn’t deduct)
    if (side === "BUY" || side === "SELL") {
      await adjustBalance(userId, -amount); // deduct
    }

    // 3. Create running order
    const order = await Order.create({
      user: userId,
      asset: assetId,
      type: "spot",
      side,
      amount,
      entryPrice,
      tp: tp || null,
      sl: sl || null,
      status: "running",
      meta: {
        openedAt: new Date(),
      },
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const placeStockOrder = async (req, res) => {
  try {
    const { assetId, side, amount } = req.body;
    const userId = req.user._id;

    const entryPrice = await getLivePrice(assetId);
    const userBalance = parseFloat(req.user.balance.toString());

    if (userBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    if (side === "BUY" || side === "SELL") {
      await adjustBalance(userId, -amount); // deduct
    }

    const order = await Order.create({
      user: userId,
      asset: assetId,
      type: "stock",
      side,
      amount,
      entryPrice,
      status: "running",
      placedAt: new Date(),
    });

    res.status(201).json({ message: "Stock order placed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const livePrice = await getLivePrice(order.asset);

    const difference = livePrice - order.entryPrice;
    const pnl = order.side === "BUY" ? difference : -difference;

    const floatingProfit = pnl * (order.amount / order.entryPrice);

    res.json({
      entryPrice: order.entryPrice,
      livePrice,
      floatingProfit,
      livePercent: ((floatingProfit / order.amount) * 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const closeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const order = await Order.findOne({ orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.isOpen)
      return res.status(404).json({ message: "Order has been closed" });

    const livePrice = await getLivePrice(order.asset);

    const difference = livePrice - order.entryPrice;
    const pnl = order.side === "BUY" ? difference : -difference;
    const winAmount = pnl * (order.amount / order.entryPrice);

    console.log(order.amount + winAmount);

    if (winAmount > 0) {
      const currentBalance = Big(user.balance.toString());
      const newBalance = currentBalance.plus(
        Big(order.amount).plus(Big(winAmount))
      );

      user.balance = mongoose.Types.Decimal128.fromString(
        newBalance.toString()
      );
      await user.save();
    }

    order.status = winAmount > 0 ? "profit" : "loss";
    order.winAmount = winAmount;
    order.isOpen = false;
    order.closedAt = new Date();
    await order.save();

    res.json({ message: "Trade closed", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserCryptoOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
      type: "spot",
    })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      id: order?.orderId,
      asset: order?.asset,
      side: order.side,
      amount: order.amount,
      tp: order.tp || 0,
      sl: order.sl || 0,
      price: order.entryPrice,
      status: order.status,
      winAmount: order.winAmount || 0,
      meta: {
        source: "Spot",
        ticket: order.meta?.orderId,
      },
      createdAt: order.createdAt,
      isOpen: order.isOpen,
    }));

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserStockOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
      type: "stock",
    })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map((order) => ({
      id: order.orderId, // stock uses direct orderId
      asset: order.asset,
      side: order.side,
      amount: order.amount,
      tp: 0, // stocks don't use TP/SL
      sl: 0,
      price: order.entryPrice,
      status: order.status,
      winAmount: order.winAmount || 0,
      meta: {
        source: "Stock",
        ticket: order.orderId,
      },
      isOpen: order.isOpen,
      createdAt: order.createdAt,
    }));

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteClosedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isOpen) {
      return res
        .status(400)
        .json({ message: "Cannot delete an open order" });
    }

    await order.deleteOne();

    res.json({
      success: true,
      orderId,
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


