import mongoose, { Schema, Document, Model } from "mongoose";
import { IMessage } from "./messageModel"; // Import IMessage interface
import { IUser } from "./userModel"; // Import IUser interface

export interface IChat extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  user: IUser;
  messages: mongoose.Types.ObjectId[] | IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const chatSchema: Schema<IChat> = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

const ChatModel: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);
export default ChatModel;
