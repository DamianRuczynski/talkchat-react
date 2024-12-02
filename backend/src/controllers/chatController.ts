import { Request, Response } from "express";
import ChatModel from "../models/chatModel";
import MessageModel from "../models/messageModel";

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const chats = await ChatModel.find({ userId })
      .populate("messages")
      .populate("userId");
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Server error fetching chats" });
  }
};

export const getChatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, id } = req.params;

    if (!userId || !id) {
      res.status(400).json({ error: "User ID and Chat ID are required" });
      return;
    }

    const chat = await ChatModel.findOne({ _id: id, userId })
      .populate("messages")
      .populate("userId");

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    res.status(500).json({ error: "Server error fetching chat by ID" });
  }
};

export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, name, messages } = req.body;

    if (!userId || !name) {
      res.status(400).json({ error: "User ID and chat name are required" });
      return;
    }

    const chat = new ChatModel({ userId, name, messages });
    const savedChat = await chat.save();

    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Server error creating chat" });
  }
};

export const addMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, chatId, sender, text, isMine } = req.body;

    if (!userId || !chatId || !text) {
      res
        .status(400)
        .json({ error: "User ID, Chat ID, and text are required" });
      return;
    }

    const chat = await ChatModel.findOne({ _id: chatId, userId });
    if (!chat) {
      res.status(404).json({ error: "Chat not found for this user" });
      return;
    }

    const message = new MessageModel({ chatId, sender, text, isMine });
    const savedMessage = await message.save();

    await ChatModel.findByIdAndUpdate(chatId, {
      $push: { messages: savedMessage._id },
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Server error adding message" });
  }
};
