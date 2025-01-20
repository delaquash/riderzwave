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
export const sendingOtpToDriverPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone_number } = req.body;
    console.log(phone_number);
    try {
      await client.verify.v2
        ?.services(process.env.TWILIO_SERVICE_SID!)
        .verifications.create({
          channel: "sms",
          to: phone_number,
        });

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
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
        await client.verify.v2?.services(process.env.TWILIO_SERVICE_SID!)
          .verifications.create({
            to: phone_number,
            channel: otp
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
  // export const verifyPhoneOtpForRegistration = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { phone_number, otp } = req.body;
  
  //     try {
  //       await client.verify.v2
  //         .services(process.env.TWILIO_SERVICE_SID!)
  //         .verificationChecks.create({
  //           to: phone_number,
  //           code: otp,
  //         });
  
  //       // await sendingOtpToEmail(req, res);
  //       res.status(201).json({
  //         success: true,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(400).json({
  //         success: false,
  //         message: "Something went wrong!",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json({
  //       success: false,
  //     });
  //   }
  // };
  

export const verifyPhoneOtpForRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { phone_number, otp } = req.body;

  // Ensure phone_number and otp are provided
  if (!phone_number || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP are required.",
    });
  }

  try {
    // Verify OTP using Twilio's API
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID!)
      .verificationChecks.create({
        to: phone_number,
        code: otp,
      });

    // Check the status of the verification
    if (verificationCheck.status === "approved") {
      // OTP is verified successfully
      return res.status(201).json({
        success: true,
        message: "OTP verified successfully.",
      });
    } else {
      // OTP verification failed
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Twilio OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later.",
    });
  }
};

  // sending otp to email
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
  
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
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
        {
          driver,
          otp,
        },
        process.env.EMAIL_ACTIVATION_SECRET!,
        {
          expiresIn: "50m",
        }
      );
      try {
        await nylas.messages.send({
          identifier: process.env.USER_GRANT_ID!,
          requestBody: {
            to: [{ name: name, email: email }],
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
          token,
        });
      } catch (error: any) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export const verifyEmailOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, token } = req.body;
      // Log the token for debugging
      console.log("Received token:", token);
      console.log("Received OTP:", otp);

      const newDriver: any = jwt.verify(
        token,
        process.env.EMAIL_ACTIVATION_SECRET!,
      )

      // Log the token for debugging
      console.log(" After Received token:", token);
      console.log(" After Received OTP:", otp);


      // if (!otp || !token) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "OTP or token is required"
      //   });
      // }

      
      if(newDriver.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "OTP not correct or expired"
        })
      }
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
        rate
      } = newDriver.driver

      const driver = await prisma.driver.create({
        data: {
          name, 
          country,
          phone_number,
          email,
          vehicle_type,
          registration_number,
          registration_date,
          driving_license,
          vehicle_color,
          rate
        }
      })

      sendToken(driver, res)
    } catch (error) {
      console.log(error)
      res.status(400).json({
        success: false,
        message: "Your otp is expired!",
      });
    }
  }

  export const getLoggedInDriverrData = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const driver = req.driver
      res.status(201).json({
        
        success: true,
        driver
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  }

  // export const verifyEmailOTP = async (req: Request, res: Response, next: NextFunction) => {

  //   try {
  //     const { otp, token } = req.body;
      
  //     // Early validation
  //     if (!otp || !token) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "OTP and token are required"
  //       });
  //     }
  
  //     // Verify the token
  //     const decodedToken: any = jwt.verify(
  //       token,
  //       process.env.EMAIL_ACTIVATION_SECRET!
  //     );
  
  //     // Check if OTP matches
  //     if (decodedToken.otp !== otp) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "OTP not correct or expired"
  //       });
  //     }
  
  //     // Create driver
  //     const driver = await prisma.driver.create({
  //       data: {
  //         ...decodedToken.driver
  //       }
  //     });
  
  //     // Generate access token and send response
  //     const accessToken = jwt.sign(
  //       { id: driver.id },
  //       process.env.ACCESS_TOKEN_SECRET!,
  //       {
  //         expiresIn: "30d",
  //       }
  //     );
  
  //     // Send response with access token
  //     return res.status(201).json({
  //       success: true,
  //       accessToken,
  //       driver,
  //     });
  
  //   } catch (error: any) {
  //     if (error.name === 'JsonWebTokenError') {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid token"
  //       });
  //     }
  
  //     if (error.name === 'TokenExpiredError') {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Token has expired"
  //       });
  //     }
  
  //     console.error(error);
  //     return res.status(400).json({
  //       success: false,
  //       message: "OTP verification failed"
  //     });
  //   }
  // };

  export const updateDriverStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const driver = await prisma.driver.update({
        where: {
          id: req.driver.id!
        },
        data: {
          status
        }
      })

      res.status(200).json({
        success: true,
        driver
        });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Something went wrong!"
      })
    }
  }

  export const getDriversById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.query as any;
      console.log(ids)
      if(!ids) {
        return res.status(400).json({
          success: false, 
          message: "Please provide driver ids"
        })
      }

      const driverIds =  ids.split(",");

      // fetch drivers from database
      const drivers = await prisma.driver.findMany({
        where: {
          id: {
            in: driverIds
          }
        }
      })
      res.status(200).json({
        success: true,
        drivers
      })
    } catch (error) {
      console.error("Error fetchong drivers by id", error)
      res.status(500).json({
        success: false,
        message: "Internal server error!"
      })
    }
  }