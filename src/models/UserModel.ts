import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  FollowersCount: { type: Number, default: 0 },
  FollowingCount: { type: Number, default: 0 },
  PostsCount: { type: Number, default: 0 },
});

//verify if the table already exists; if not, create it
//UserModel is like the table in relational databases
export const UserModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
