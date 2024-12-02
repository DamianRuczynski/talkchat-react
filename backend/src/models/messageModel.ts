import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId;
  sender?: string;
  text: string;
  isMine: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: String, maxlength: 100 },
    text: { type: String, required: true },
    isMine: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);
export default MessageModel;
