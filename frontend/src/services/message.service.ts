import { TMessage } from "@/types/chat.types";

export const addMessage = async (
  userId: string,
  chatId: string,
  sender: string,
  text: string,
  isMine: boolean
): Promise<TMessage> => {
  const response = await fetch(`/api/chats/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, chatId, sender, text, isMine }),
  });

  if (!response.ok) {
    throw new Error("Failed to add message");
  }
  return response.json();
};
