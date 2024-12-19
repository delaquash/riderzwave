require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../error/errorMessage";
import prisma from "../utils/prisma";
import { nylas } from "../app";
import { sendToken } from "../utils/sendToken";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, {
  lazyLoading: true,
});

// register new user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      throw new BadRequestError();
    }

    // Call Twilio API
    await client.verify.v2
      ?.services(process.env.TWILIO_SERVICE_SID!)
      .verifications.create({
        to: phone_number,
        channel: "sms",
      });

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Verification code sent to your phone number",
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      // Handle known errors
      return next(error);
    }

    // Handle unexpected errors
    console.error("Error in Twilio API or server:", error);
    return next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number, otp } = req.body;
    if (!phone_number || !otp) {
      throw new BadRequestError();
    }

    // Call Twilio API
    const verification = await client.verify.v2
      ?.services(process.env.TWILIO_SERVICE_SID!)
      .verificationChecks.create({
        to: phone_number,
        code: otp,
      });

    if (!verification.valid) {
      throw new BadRequestError();
    }
    // const user = await prisma.user.create({
    //     phone_number: phone_number
    // })

    // check if user exist
    const isUserExist = await prisma.user.findUnique({
      where: {
        phone_number: phone_number,
      },
    });

    if (isUserExist) {
        // Send success response if user already exist
      await sendToken(res, isUserExist)
    } else {
      // create new user
      const newlyCreatedUser = await prisma.user.create({
        data: {
          phone_number: phone_number,
        },
      });
      // Send success response
      res.status(200).json({
        success: true,
        user: newlyCreatedUser,
        message: "OTP verified successfully.",
      });
    }
  } catch (error) {
    next(error);
  }
};


export const signUpNewUser= async(req: Request, res: Response, next: NextFunction) => {
   try {
    const { userId, email, name } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    });
    if(user?.email === null) {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        }, 
        data: {
          name: name,
          email: email
        }
      })

    res.status(201).json({
      success: true,
      user: updatedUser
    })    
  } else {
    res.status(400).json({
      success: false,
      message: "User already exist!!!"
    })
  }
   } catch (error) {
    next(error)
   }
}

export const sendOtpToMail= async (req: Request, res: Response, next: NextFunction) => {
   
    try {
      const {email, name, userId } = req.body;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const users = {
        userId,
        name,
        email
      }

      const token = jwt.sign(
        { users, otp },
        process.env.EMAIL_ACTIVATION_SECRET!,
        {
          expiresIn: "50m",
        }
      );
      try {
        await nylas.messages.send({
          identifier: process.env.NYLAS_TEST_GRANT_KEY!,
          requestBody:{
            to: [{
              name: name,
              email: email
            }], 
            subject: "Verify your email address!",
            body: `
                 <p>Hi ${name},</p>
                 <p>Your Ridewave verification code is ${otp}. If you didn't request for this OTP, please ignore this email!</p>
                 <p>Thanks,<br>Ridewave Team</p>
              
              `,
            },
          });
          res.status(201).json({
            success: true,
            message: "OTP sent to your email address",
            token
          })
        } catch (error) {
         console.log(error)
      }

     
    } catch (error) {
      console.log(error)
      next(error)
    }
}

export const verifyEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, otp } = req.body;
    const newUser: any = jwt.verify(
      token, process.env.EMAIL_ACTIVATION_SECRET!
    )
    if(newUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      })
    }

    const { name, email, userId } = newUser.users;
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user?.email === null) {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name,
          email: email,
        },
      });
      await sendToken(updatedUser, res);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Your otp is expired!",
    });
  }
}

export const getLoggedInUserData = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    res.status(201).json({
      
      success: true,
      user
    })
  } catch (error) {
    next(error)
    console.log(error)
  }
}