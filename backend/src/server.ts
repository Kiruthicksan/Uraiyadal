import express from "express";
import dotevn from "dotenv";
import connectDb from "./config/db.js";
dotevn.config();
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import { app, server } from "./utils/socket.js";

// ---------- middlewars --------------

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieparser());

const port = process.env.PORT;

// routes

app.use("/auth", authRoutes);
app.use("/", messageRoutes);

// ----- db connection--------------

const startServer = async () => {
  try {
    await connectDb();

    server.listen(port, () =>
      console.log(`Server Running on http://localhost:${port}`)
    );
  } catch (error) {
    console.log("Error starting server", error);
  }
};

startServer();
