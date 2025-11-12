import type { Request, Response } from "express";
import User, { type IUser } from "../model/userModel.js";
import bcrypt from "bcrypt";
import genreateToken from "../utils/genrateToken.js";
import { setAuthCookie } from "../utils/setAuthCookies.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import type { AuthenticatedRequest } from "../middlewares/protect.js";
import cloudinary from "../config/cloudinary.js";

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

    //  -------------  sending a welcome email ------------
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

//  --------------- endpoint for login -----

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is Required" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is Required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = genreateToken(existingUser.id);
    setAuthCookie(token, res);

    res.status(200).json({
      message: "Logged In Successflly",
      user: {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
};

//  --------- endpoint for logging out  ----------------

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ message: "Logged Out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
};

// ------------ endopoint for uploding image -------------------
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is needed" });
    }

    const id = req.user._id;

    if (!id) {
      return res.status(404).json({ message: "Id not found" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const profile = await User.findByIdAndUpdate(
      id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Uploaded Profile Image", profile });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
};



