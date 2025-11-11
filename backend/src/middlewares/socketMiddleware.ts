import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { JwtPayloadType } from "./protect.js";
import User from "../model/userModel.js";

export interface ClientToServerEvents {
  sendMessage: (data: { text: string }) => void;
}

export interface ServerToClientEvents {
  newMessage: (data: { text: string }) => void;
  getOnlineUsers: (onlineUsers: string[]) => void;
}

export const socketAuthMiddlwarre = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socked Connection rejected : No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadType;

    if (!decoded) {
      console.log("Socked Connection rejected : Invalid Token ");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.data.user = user;
    socket.data.userId = user._id;
    console.log(
      `Socket Authenticated for user : ${user.userName} (${user._id})`
    );
    next();
  } catch (error: any) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
