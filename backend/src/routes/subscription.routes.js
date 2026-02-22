import { Router } from "express";
import {
  addBot,
  addCopyTrader,
  addTradingPackage,
  getBots,
  getCopyTraders,
  getTradingPackages,
} from "../controllers/subscription.controller.js";  

const SubscriptionRouter = Router();

// get the bot subscription
SubscriptionRouter.get("/bot", getBots);

// get the copy traders subscription
SubscriptionRouter.get("/copy-traders", getCopyTraders);

// get the trading packges subscription
SubscriptionRouter.get("/trading-packages", getTradingPackages);


export default SubscriptionRouter;
