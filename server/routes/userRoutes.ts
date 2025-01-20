import express from "express";
import { registerUser,verifyOtp,getLoggedInUserData,  signUpNewUser, sendOtpToMail, verifyEmailOTP } from "../controllers/UserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyOtp", verifyOtp);
router.put("/signup", signUpNewUser)
router.post("/email-otp-request", sendOtpToMail)
router.put("/email-otp-verify", verifyEmailOTP)
router.get("/getUsersLoggedIn", isAuthenticated, getLoggedInUserData);

export default router;