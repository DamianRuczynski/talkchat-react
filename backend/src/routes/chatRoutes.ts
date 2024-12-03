import express from "express";
import {
  getChats,
  addMessage,
  getOrCreateChat,
  getChatById,
} from "../controllers/chatController";

const router = express.Router();

router.get("/:userId", getChats);
router.post("", getOrCreateChat);
router.get("/:userId/:id", getChatById);
router.post("/message", addMessage);

export default router;
