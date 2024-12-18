import express from "express";
import { registerUser,verifyOtp, signUpNewUser, sendOtpToMail } from "../controllers/UserController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyOtp", verifyOtp);
router.put("/signup", signUpNewUser)
router.post("/email-otp-request", sendOtpToMail)

export default router;