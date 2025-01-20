import express from "express";
import {updateDriverStatus, sendingOtpToDriverPhone,sendingOtpToEmail,verifyPhoneOtpForLogin,verifyPhoneOtpForRegistration, verifyEmailOTP, getLoggedInDriverrData, getDriversById } from "../controllers/DriverController";
import { isAuthenticated, isDriverAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/send-otp-to-driver", sendingOtpToDriverPhone);
// router.post("/verify-driver-otp", verifyOtp)
router.post("/login", verifyPhoneOtpForLogin);
router.post("/verify-otp", verifyPhoneOtpForRegistration);
// router.post("/send-otp-email", sendingOtpToEmail)
router.post("/verify-email-otp",  verifyEmailOTP);
router.put("/update-status", isDriverAuthenticated, updateDriverStatus);
router.get("/getDriversLoggedIn", isDriverAuthenticated, getLoggedInDriverrData);
router.get("/getDriversById", isDriverAuthenticated, getDriversById);

export default router;