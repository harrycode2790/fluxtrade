import { Router } from "express";
import { forgetPassword, login, logout, register, resetPassword } from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/forget-password", forgetPassword)

authRouter.post("/reset-password", resetPassword)

authRouter.get("/check", authorize, (req, res) => res.status(200).json(req.user));


export default authRouter;
