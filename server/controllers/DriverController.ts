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
export const sendingOtpToDriversPhone  = async (
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
  
        try {
            await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID!)
            .verificationChecks.create({
                to: phone_number,
                code: otp,
            });
          const driver = await prisma.driver.findUnique({
                where: {
                    phone_number
                }
            })
            sendToken(driver, res)
        } catch (error) {
                console.log(error);
                res.status(400).json({
                success: false,
                message: "Something went wrong!",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
            });
        }
  };
  
  export const verifyPhoneOtpForLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone_number, otp } = req.body;
  
      try {
        await client.verify.v2
          .services(process.env.TWILIO_SERVICE_SID!)
          .verificationChecks.create({
            to: phone_number,
            code: otp,
          });
  
        const driver = await prisma.driver.findUnique({
          where: {
            phone_number,
          },
        });
        sendToken(driver, res);
      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          message: "Something went wrong!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
      });
    }
  };
  
  // verifying phone otp for registration
  export const verifyPhoneOtpForRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone_number, otp } = req.body;
  
      try {
        await client.verify.v2
          .services(process.env.TWILIO_SERVICE_SID!)
          .verificationChecks.create({
            to: phone_number,
            code: otp,
          });
  
        await sendingOtpToEmail(req, res);
      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          message: "Something went wrong!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
      });
    }
  };
  
  export const sendingOtpToEmail = async (req: Request, res: Response) => {
    try {
        const {
            name,
            country,
            phone_number,
            email,
            vehicle_type,
            registration_number,
            registration_date,
            driving_license,
            vehicle_color,
            rate,
          } = req.body;

          const otp = Math.floor(100000 + Math.random() * 900000).toString();

          const driver = {
            name,
            country,
            phone_number,
            email,
            vehicle_type,
            registration_number,
            registration_date,
            driving_license,
            vehicle_color,
            rate,
          };  
          const token = jwt.sign(
            { driver, otp },
            process.env.EMAIL_ACTIVATION_SECRET!,
            {
              expiresIn: "50m"
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
    }
  }