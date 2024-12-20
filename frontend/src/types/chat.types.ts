import { User } from "./auth.types";

export type TChat = {
  _id: string;
  name: string;
  participants: User[];
  messages: TMessage[];
  createdAt: string;
  updatedAt: string;
};

export type TMessage = {
  _id: string;
  chatId: string;
  sender?: string;
  text: string;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
};
