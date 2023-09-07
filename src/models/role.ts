import mongoose from "mongoose";
import { Model } from "mongoose";

type RoleType = RoleModel & mongoose.Document;
export interface RoleModel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
    },
  },
  { timestamps: true }
);

const Role: Model<RoleType> = mongoose.model<RoleType>("Role", roleSchema);
export default Role;
