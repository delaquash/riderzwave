import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      driver?: any
    }
  }
}
// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeaders = req.headers.authorization;
//   if (!authHeaders) {
//     return res.status(401).json({
//       success: false,
//       message: "Please log in to access this content",
//     });
//   }

//   const token = authHeaders.split(" ")[1];
//   if (token) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or missing token",
//     });
//   }

//   jwt.verify(
//     token,
//     process.env.ACCESS_TOKEN_SECRET!,
//     async (error: any, decoded: any) => {
//       if (error) {
//         return res.status(401).json({
//           success: false,
//           message: "Invalid or missing token",
//         });
//       }
//       const userData = await prisma.user.findUnique({
//         where: {
//           id: decoded.id,
//         },
//       });
//       req.user = userData;
//       next();
//     }
//   );
// };


// / Adjust the import path for your Prisma instance

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is missing or malformed",
    });
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };

    const userData = await prisma.user.findUnique({
      where: { 
            id: decoded.id 
        },
    });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = userData; // Ensure `req.user` is properly typed
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const isDriverAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is missing or malformed",
    });
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
    };

    const driverData = await prisma.driver.findUnique({
      where: { 
            id: decoded.id 
        },
    });

    if (!driverData) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.driver = driverData; // Ensure `req.user` is properly typed
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



