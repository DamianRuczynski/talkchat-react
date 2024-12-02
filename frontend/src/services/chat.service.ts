import { TChat } from "@/types/chat.types";
import apiClient from "@/utils/api.client";

export const getChats = async (userId: string): Promise<TChat[]> => {
  const response = await apiClient.get(`/chat/${userId}`);
  return response.data;
};

// TODO load chats only from user id
export const getChatById = async (
  userId: string,
  chatId: string
): Promise<TChat | null> => {
  const response = await apiClient.get(`/chat/${userId}/${chatId}`);
  return response.data;
};

export const createChat = async (
  userId: string,
  name: string
): Promise<TChat> => {
  const response = await fetch(`/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat");
  }
  return response.json();
};
