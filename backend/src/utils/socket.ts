import express from "express";
import http from "http";
import { Server, type DefaultEventsMap } from "socket.io";
import {
  socketAuthMiddlwarre,
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "../middlewares/socketMiddleware.js";

const app = express();
const server = http.createServer(app);

interface SocketData {
  user?: {
    _id: string;
    userName: string;
    email: string;
  };
  userId?: string;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>(server, {
  cors: {
    origin: [process.env.CLIENT_URL as string],
    credentials: true,
  },
});

// apply authentication middleware to all endpoints

io.use(socketAuthMiddlwarre);

export function getReceiverSocketId(userId: any) {
  return userSocketMap[userId];
}

// for storing online users --
const userSocketMap: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.data.user?.userName);

  const userId = socket.data.userId;
  userSocketMap[userId!] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.data.user?.userName);

    delete userSocketMap[userId!];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
