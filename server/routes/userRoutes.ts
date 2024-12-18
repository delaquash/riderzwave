import express from "express";
import { registerUser,verifyOtp, signUpNewUser } from "../controllers/UserController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyOtp", verifyOtp);
router.put("/signup", signUpNewUser)

export default router;