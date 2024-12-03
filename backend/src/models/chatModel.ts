import mongoose, { Schema, Document, Model } from "mongoose";
import { IMessage } from "./messageModel"; // Import IMessage interface
import { IUser } from "./userModel"; // Import IUser interface

export interface IChat extends Document {
  name: string;
  participants: mongoose.Types.ObjectId[] | IUser[];
  messages: mongoose.Types.ObjectId[] | IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, maxlength: 100 },
    participants: [{ type: String, required: true, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

const ChatModel: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema);
export default ChatModel;
