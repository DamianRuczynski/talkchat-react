import { Request, Response } from "express";
import ChatModel from "../models/chatModel";
import MessageModel from "../models/messageModel";
import { generateChatId } from "../helpers/generateChatId";

/* TODO it is better imo, to create symmetric hash and have a code/uuid which can be coded by userId and targetId and generate unique chatId,
 or decoded bu chatId, and then after decoding we get userId and targetId
 only issue is that we will not be able to load user chats since we do not have any db relations between chats and user
 so we have to iterate over all chats to looking id in the code, so to say decode thousands of id's and saving user data, inefficient
 also cannot create chat groups 
but it will be safer and fitting more into requirements of the project, since we practically use aes and hashing */
export const getOrCreateChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { loggedUserId, targetUserId } = req.body;

  if (!loggedUserId || !targetUserId) {
    res
      .status(400)
      .json({ error: "Both loggedUserId and targetUserId are required" });
  }

  try {
    const chatId = generateChatId(loggedUserId, targetUserId);

    let chat = await ChatModel.findOne({ _id: chatId })
      .populate("participants")
      .populate("messages");

    if (!chat) {
      chat = new ChatModel({
        _id: chatId,
        participants: [loggedUserId, targetUserId],
        // TO DO name chat by target
        name: `New Chat`,
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error getting or creating chat:", error);
    res.status(500).json({ error: "Failed to get or create chat" });
  }
};

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const chats = await ChatModel.find({ participants: userId })
      .populate("participants")
      .populate("messages");

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
      .populate("participants");

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
