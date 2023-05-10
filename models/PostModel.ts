import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  data: { type: String, required: true },
  comments: { type: Array, required: true, default: [] },
  likes: { type: Array, required: true, default: [] },
});

//verify if the table already exists; if not, create it
export const PostModel =
  mongoose.models.posts || mongoose.model("posts", PostSchema);
