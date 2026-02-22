import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  createDeposit,
  createWithdrawal,
  getPaymentMethodAddress,
  getPaymentMethods,
  getUserTransactions,
  updateTransactionStatus,
  validatePassphrase,
} from "../controllers/transaction.controller.js";

const transactionRouter = Router();
// --- Deposit (creates pending transaction) ---
transactionRouter.post("/deposit", authorize, createDeposit);

//   --- Withdraw (user requests withdrawal) ---
transactionRouter.post("/withdraw", authorize, createWithdrawal);

// --- Get all payment methods (Bitcoin, Tether, etc.) ---
transactionRouter.get("/methods",  getPaymentMethods);

// --- Get user transaction history (deposit + withdraw) ---
transactionRouter.get("/", authorize, getUserTransactions);

// --- Unlock passphrase: verify user passphrase ---
transactionRouter.post("/validate-passphrase", authorize, validatePassphrase);

// --- Get unlocked address for a specific method ---
transactionRouter.get(
  "/methods/:id/address",
  authorize,
  getPaymentMethodAddress
);


export default transactionRouter;
