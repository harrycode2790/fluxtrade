import express from "express";

import {
  placeCryptoOrder,
  placeStockOrder,
  closeOrder,
  checkOrderStatus,
  getUserCryptoOrders,
  getUserStockOrders,
  deleteClosedOrder,
} from "../controllers/orders.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";


const ordersRouter = express.Router();

ordersRouter.use(authorize);

// === CRYPTO ===
ordersRouter.post("/crypto/place", placeCryptoOrder);

// === STOCKS ===
ordersRouter.post("/stocks/place", placeStockOrder);

// get all user crypto orders 

ordersRouter.get("/crypto/", getUserCryptoOrders);

// get all user stocks orders 

ordersRouter.get("/stocks/", getUserStockOrders);

// === MANUAL CLOSE ===
ordersRouter.post("/:orderId/close", closeOrder);

// === CHECK LIVE STATUS OF AN ORDER (used for open trades UI) ===
ordersRouter.get("/:orderId/status", checkOrderStatus);

// delete closed order
ordersRouter.delete("/:orderId/delete", deleteClosedOrder)

export default ordersRouter;
