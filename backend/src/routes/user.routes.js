import { Router } from "express";
import { createTransactionPassphrase, updateVerificationStatus } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router()

//todo ->  user upload document for verification 


// Create passphrase (only once)
userRouter.post("/passphrase", authorize, createTransactionPassphrase);


export default userRouter