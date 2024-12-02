import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, maxlength: 100, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 50 },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default UserModel;
