import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import {
    deleteSubscription,
  getAllActiveUsers,
  getAllSubscriptions,
  getAllTransactions,
  getAllUsers,
  getSingleSubscription,
  getSingleUser,
  getTotalOrdersByType,
  getTransactionChart,
  getTransactionsBarChart,
  getUserPortfolio,
  softDeleteUser,
  updateBotSubscription,
  updateCopyTraderSubscription,
  updateTradingPackage,
} from "../controllers/admin.controller.js";
import { updateVerificationStatus } from "../controllers/user.controller.js";
import { updateTransactionStatus } from "../controllers/transaction.controller.js";
import { addBot, addCopyTrader, addTradingPackage } from "../controllers/subscription.controller.js";

const adminRouter = Router();

// all admin routes are protected
adminRouter.use(authorize, adminOnly);

/* =========================
   USERS
========================= */

// get all users
adminRouter.get("/users", getAllUsers);

// get active user 
adminRouter.get("/active-users", getAllActiveUsers)

// get single user
adminRouter.get("/users/:userId", getSingleUser);

// soft delete user
adminRouter.delete("/users/:userId", softDeleteUser);

// approve / reject user verification
adminRouter.put("/users/:userId/verification", updateVerificationStatus);

// view user portfolio (subscriptions + balance)
adminRouter.get("/users/:userId/portfolio", getUserPortfolio);

// /* =========================
//    TRANSACTIONS
// ========================= */

//  get all transactions (filterable by user, type, status)
adminRouter.get("/transactions", getAllTransactions);

// approve / reject deposit or withdrawal
adminRouter.put("/transactions/:transactionId/status", updateTransactionStatus);

//get transaction chart
adminRouter.get("/transactions/chart", getTransactionChart);

// get barchat tranasction
adminRouter.get("/transactions-bar", getTransactionsBarChart);


// get total orders meta
adminRouter.get("/orders-meta", getTotalOrdersByType);

// /* =========================
//    SUBSCRIPTIONS ( FULL CRUD)
// ========================= */
//get all subscriptions
adminRouter.get("/subscriptions", getAllSubscriptions);

//get indiviual SUbscriptions
adminRouter.get("/subscriptions/:id", getSingleSubscription)

// delete Any Suscription
adminRouter.delete("/subscriptions/:id", deleteSubscription)

// bots
adminRouter.post("/subscriptions/bots", addBot);
adminRouter.put("/subscriptions/bots/:id", updateBotSubscription);

// copy traders
adminRouter.post("/subscriptions/copy-traders", addCopyTrader);
adminRouter.put("/subscriptions/copy-traders/:id", updateCopyTraderSubscription);

// trading packages
adminRouter.post("/subscriptions/trading-packages", addTradingPackage);
adminRouter.put("/subscriptions/trading-packages/:id",updateTradingPackage);

export default adminRouter;
