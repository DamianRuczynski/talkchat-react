import crypto from "crypto";

const ENCRYPTION_KEY = process.env.CHAT_HASH_SECRET || "your_secret_key";

export function generateChatId(userId1: string, userId2: string): string {
  const [id1, id2] = [userId1, userId2].sort();
  const chatId = crypto
    .createHmac("sha256", ENCRYPTION_KEY)
    .update(`${id1}:${id2}`)
    .digest("hex");

  return chatId;
}
