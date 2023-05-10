import mongoose, { Schema, Document } from "mongoose";

export interface IFollower extends Document {
  userId: string;
  followedUserId: string;
}

const FollowerSchema: Schema = new Schema({
  userId: { type: String, required: true },
  followedUserId: { type: String, required: true },
});

export const FollowerModel =
  mongoose.models.followers ||
  mongoose.model<IFollower>("followers", FollowerSchema);
