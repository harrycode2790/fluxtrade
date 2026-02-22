import { Router } from "express";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "../controllers/paymentMethod.controller.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const paymentMethodRouter = Router();

paymentMethodRouter.use(authorize, adminOnly);

// ADMIN-ONLY ROUTES
paymentMethodRouter.get("/", getPaymentMethods); 
paymentMethodRouter.post("/create", createPaymentMethod); // Create new method
paymentMethodRouter.put("/update/:id", updatePaymentMethod); // Update method
paymentMethodRouter.delete("/delete/:id", deletePaymentMethod); // Delete method

export default paymentMethodRouter;
