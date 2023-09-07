import mongoose from "mongoose";
import { Model } from "mongoose";

type UserType = UserModel & mongoose.Document;
export interface UserModel {
  id: string;
  name: string;
  displayName: string;
  password: string;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
    },
    displayName: {
      type: String,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User: Model<UserType> = mongoose.model<UserType>("User", userSchema);
export default User;
