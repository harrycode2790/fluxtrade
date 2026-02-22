import cron from "node-cron";
import { adjustBalance, getLivePrice } from "../config/utils.js";
import Order from "../models/order.model.js";


// Auto close running orders
const closeOrderAutomatically = async (order, livePrice, reason) => {
  const pnl = order.side === "BUY"
    ? (livePrice - order.price)
    : -(livePrice - order.price);

  const winAmount = pnl * (order.amount / order.price);

  // Add money back to user
  await adjustBalance(order.user, order.amount + winAmount);

  order.status = winAmount >= 0 ? "profit" : "loss";
  order.winAmount = winAmount;
  order.closedAt = new Date();
  order.meta.closedBy = reason;

  await order.save();
};

// Main engine
export const startOrderEngine = () => {
  console.log(" Order engine started… checking trades every 5 seconds...");

  cron.schedule("*/5 * * * * *", async () => {
    try {
      const openOrders = await Order.find({ status: "running" });

      for (const order of openOrders) {
        const livePrice = await getLivePrice(order.asset);

        // TP Hit
        if (order.tp && livePrice >= order.tp) {
          await closeOrderAutomatically(order, livePrice, "tp");
          continue;
        }

        // SL Hit
        if (order.sl && livePrice <= order.sl) {
          await closeOrderAutomatically(order, livePrice, "sl");
          continue;
        }

        // If no TP/SL hit → keep running
      }
    } catch (err) {
      console.log("Order engine error:", err.message);
    }
  });
};
