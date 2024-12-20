import mongoose, { Schema, Document, Model } from "mongoose";
import { IChat } from "./chatModel"; // Import IChat interface

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  chats: mongoose.Types.ObjectId[] | IChat[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, maxlength: 100, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 100 },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default UserModel;
