import { TChat } from "@/types/chat.types";
import apiClient from "@/utils/api.client";

export const getChats = async (userId: string): Promise<TChat[]> => {
  const response = await apiClient.get(`/chat/${userId}`);
  return response.data;
};

export const getOrCreateChat = async (
  loggedUserId: string,
  targetUserId: string
): Promise<TChat> => {
  const response = await apiClient.post(`/chat`, {
    loggedUserId,
    targetUserId,
  });
  return response.data;
};

export const getChatById = async (
  userId: string,
  chatId: string
): Promise<TChat | null> => {
  const response = await apiClient.get(`/chat/${userId}/${chatId}`);
  return response.data;
};

export const addMessage = async ({
  userId,
  chatId,
  sender,
  text,
  isMine,
}: {
  userId: string;
  chatId: string;
  sender: string;
  text: string;
  isMine: boolean;
}): Promise<any> => {
  const response = await apiClient.post(`/message`, {
    userId,
    chatId,
    sender,
    text,
    isMine,
  });
  return response.data;
};
