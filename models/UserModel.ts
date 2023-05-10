import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
});

//verify if the table already exists; if not, create it
//UserModel is like the table in relational databases
export const UserModel =
  mongoose.models.users || mongoose.model<IUser>("users", UserSchema);

