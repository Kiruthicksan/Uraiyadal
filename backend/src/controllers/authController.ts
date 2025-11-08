import type { Request, Response } from "express";
import User, { type IUser } from "../model/userModel.js";
import bcrypt from "bcrypt";
import genreateToken from "../utils/genrateToken.js";
import { setAuthCookie } from "../utils/setAuthCookies.js";
import { resend, sender } from "../config/resend.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    // -------------------- validation--------------------------

    if (!userName || typeof userName !== "string") {
      return res.status(400).json({ message: "Username is Required" });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is Required" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is Required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // ----------- checking email is already there

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already Registered" });
    }

    //  ----------------- hashing password  --------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  ---------------------  creating a new user -----------------------

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    const token = genreateToken(newUser.id);
    setAuthCookie(token, res);

    res.status(201).json({
      message: "Account Created Successfully ",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });

    try {
      await sendWelcomeEmail(newUser.email, newUser.userName);
    } catch (error) {
      console.log("Failed to send welcome email");
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
};
