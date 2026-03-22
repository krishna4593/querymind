import { Router } from "express";
import { registerController, verifyEmail, loginController, getMe, resendVerificationEmail } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import {authUser} from "../middlewares/auth.middleware.js"

const router = Router();
//Register Route .. "/api/auth/register"
router.post("/register", registerValidator, registerController);

//verifyEmail route "/api/auth/verify-email"
router.get("/verify-email", verifyEmail);


//login route "/api/auth/login"
router.post("/login", loginValidator, loginController);
export default router;


//get-me route "/api/auth/me"
router.get("/me", authUser, getMe);  

//resend verification email route "/api/auth/resend-email"
router.post("/resend-email", resendVerificationEmail)