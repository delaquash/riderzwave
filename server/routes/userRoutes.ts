import express from "express";
import { registerUser,verifyOtp, signUpNewUser, sendOtpToMail, verifyEmailOTP } from "../controllers/UserController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyOtp", verifyOtp);
router.put("/signup", signUpNewUser)
router.post("/email-otp-request", sendOtpToMail)
router.put("/email-otp-verify", verifyEmailOTP)

export default router;