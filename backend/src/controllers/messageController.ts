import type { Request, Response } from "express";
import User from "../model/userModel.js";
import type { AuthenticatedRequest } from "../middlewares/protect.js";
import Message from "../model/messageModel.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

// ---------------- endpoint for getting all contacts
export const getAllContacts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const loggedInUserId = req.user._id;
    const contacts = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res
      .status(200)
      .json({ message: "Contacts fetched Successfully", contacts });
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong",
      error: (error as Error).message,
    });
  }
};

//  ---------- endpoint to show the loggedin user who they message with (recent chats)---------------
export const getChatPartners = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const loggedInUserId = req.user._id;

    //  ------ find the all the message where the loggin in user is either send or reciever

    const message = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    //  extract all the partner's id from message

    const partnerIds = message.map((msg) =>
      msg.senderId.toString() === loggedInUserId.toString()
        ? msg.receiverId
        : msg.senderId
    );

    // ------- remove duplicates------

    const uniquePartners = [...new Set(partnerIds.map((id) => id.toString()))];

    // --------get user info---------------------

    const chatPartners = await User.find({
      _id: { $in: uniquePartners },
    }).select("-password");

    res.status(200).json({ chatPartners });
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong",
      error: (error as Error).message,
    });
  }
};

// endpoint for users to get message for specific user
export const getMessagesByUserId = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: id },
        { senderId: id, receiverId: userId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong",
      error: (error as Error).message,
    });
  }
};

// ---------- endpoint for sending message ---------------

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }

    const receiverExist = await User.exists({ _id: receiverId });
    if (!receiverExist) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: "Something Went wrong",
      error: (error as Error).message,
    });
  }
};
