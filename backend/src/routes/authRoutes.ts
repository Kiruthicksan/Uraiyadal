import express, { type Response } from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/authController.js";
import protect, { type AuthenticatedRequest } from "../middlewares/protect.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protect as any, updateProfile as any);
router.get("/check", protect as any, (req, res) => {
  const user = (req as AuthenticatedRequest).user;
  res.status(200).json({ user });
});

export default router;
