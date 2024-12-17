require("dotenv").config();
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes"
import { errorHandler } from "./middlewares/errorHandler";
import Nylas from "nylas";

export const app = express();
export const nylas = new Nylas({
    apiKey: process.env.NYLAS_API_KEY!,
    apiUri: process.env.NYLAS_API_URI
  })
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRoutes);

// testing route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Server is working!",
    });
});

app.use(errorHandler)