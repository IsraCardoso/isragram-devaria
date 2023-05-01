import mongoose, { Schema } from "mongoose";

const FollowerSchema = new Schema({
  userId: { type: String, required: true },
  followedUserId: { type: String, required: true },
});

export const FollowerModel =
  mongoose.models.followers || mongoose.model("followers", FollowerSchema);
