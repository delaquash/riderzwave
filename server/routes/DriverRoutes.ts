import express from "express";
import { sendingOtpToDriversPhone,sendingOtpToEmail,verifyOtp,verifyPhoneOtpForLogin,verifyPhoneOtpForRegistration, verifyEmailOTP, getLoggedInDriverrData } from "../controllers/DriverController";
import { isAuthenticated, isDriverAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/send-otp-to-driver", sendingOtpToDriversPhone);
// router.post("/verify-driver-otp", verifyOtp)
router.post("/login", verifyPhoneOtpForLogin);
router.post("/registration", verifyPhoneOtpForRegistration);
// router.post("/send-otp-email", sendingOtpToEmail)
router.post("/verify-email-otp",  verifyEmailOTP);

router.get("/me", isDriverAuthenticated, getLoggedInDriverrData);

export default router;