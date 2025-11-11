import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/messageController.js";
import protect from "../middlewares/protect.js";
import { arcjetProtection } from "../middlewares/arcjetMiddleWare.js";
const router = express.Router();

router.use( protect as any); // this first run

router.get("/contacts", getAllContacts as any);
router.get("/chats", getChatPartners as any);
router.get("/:id", getMessagesByUserId as any);
router.post("/send/:id", sendMessage as any);
export default router;
