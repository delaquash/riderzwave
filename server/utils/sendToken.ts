import jwt from "jsonwebtoken";

// send token
export const sendToken = async (user: any, res: any) => {
  if (!user || !user.id) {
    return res.status(400).json({
      success: false,
      message: "User data is missing or invalid.",
    });
  }
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    }
  );
  res.status(201).json({
    success: true,
    accessToken,
    user,
  });
};