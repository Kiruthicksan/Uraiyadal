import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../model/userModel.js";

 export interface JwtPayloadType extends JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user: any;
}

const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not Authorized - No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadType;

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Not Authorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(404).json({message : "User not found"})
    }

    (req as any).user = user;

    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Something went wrong",
        error: (error as Error).message,
      });
  }
};

export default protect;
