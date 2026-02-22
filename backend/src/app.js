// external imports 
import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";


// internal imports
import { ENV } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import assetsRouter from "./routes/assets.routes.js";
import SubscriptionRouter from "./routes/subscription.routes.js";
import portfolioRouter from "./routes/portfolio.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import paymentMethodRouter from "./routes/paymentMethod.routes.js";     
import ordersRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
const allowedOrigins = (ENV.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(cookieParser()); // middleware to parse cookies

//routes
app.use("/api/auth/", authRouter)
app.use("/api/users/", userRouter)
app.use("/api/assets/", assetsRouter)
app.use("/api/subscription/", SubscriptionRouter)
app.use("/api/portfolio/", portfolioRouter)
app.use("/api/transactions/", transactionRouter);
app.use("/api/payment-methods/", paymentMethodRouter);
app.use("/api/orders/", ordersRouter)
app.use("/api/admin/", adminRouter)

export default app;
