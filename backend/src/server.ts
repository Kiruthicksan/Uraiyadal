import express from "express";
import dotevn from "dotenv";
import connectDb from "./config/db.js";
dotevn.config();
import authRoutes from "./routes/authRoutes.js"

const app = express();

// ---------- middlewars --------------
app.use(express.json());

const port = process.env.PORT; 


// routes

app.use("/auth", authRoutes)

// ----- db connection--------------

const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, () =>
      console.log(`Server Running on http://localhost:${port}`)
    );
  } catch (error) {
    console.log("Error starting server", error);
  }
};

startServer()
