import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { buySubscription, getGroupedSubscriptions } from "../controllers/portfolio.controller.js";

const portfolioRouter = Router();

portfolioRouter.use(authorize);

// Buy a subscription (user pays → add to portfolio)
portfolioRouter.post("/buy", buySubscription);

// Get all subscriptions owned by the user
portfolioRouter.get("/", getGroupedSubscriptions);

export default portfolioRouter;
