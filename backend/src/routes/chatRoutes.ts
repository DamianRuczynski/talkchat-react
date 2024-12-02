import express from "express";
import {
  getChats,
  getChatById,
  createChat,
  addMessage,
} from "../controllers/chatController";

const router = express.Router();

router.get("/:userId", getChats);
router.get("/:userId/:id", getChatById);
router.post("/", createChat);
router.post("/message", addMessage);

export default router;
