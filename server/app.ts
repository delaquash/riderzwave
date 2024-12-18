require("dotenv").config();
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes"
import { errorHandler } from "./middlewares/errorHandler";
import Nylas from "nylas";

export const app = express();
export const nylas = new Nylas({
    apiKey: "nyk_v0_RRqmxKmB1w8UcZ2sessKkzDH3okg2B7v5e6VQJgl2331BbHqa2GjmwwWvGtz5nj7",
    apiUri: "https://api.us.nylas.com"
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