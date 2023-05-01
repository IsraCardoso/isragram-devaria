import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import nc from "next-connect";
import { GeneralRes } from "@/types/GeneralRes";

const likeHandler = nc().put(
  async (req: NextApiRequest, res: NextApiResponse<GeneralRes>) => {
    try {
      //get post ID
      const { postId } = req?.query;
      console.log(postId);
      //get post
      const post = await PostModel.findById(postId);
      console.log(post);
      if (!post) {
        return res.status(400).json({ error: "Post não encontrado" });
      }
      //get user Id
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      //check if user already liked the post
      const likeIndex = post.likes.findIndex((like: any) => {
        return like.toString() === userId.toString();
      });
      console.log(likeIndex);
      //make change to the post and then persist it
      if (likeIndex > -1) {
        //already liked before
        post.likes.splice(likeIndex, 1);
        await PostModel.findByIdAndUpdate({ _id: postId }, post);
        return res.status(200).json({ message: "Post descurtido" });
      } else {
        //not liked before
        post.likes.push(user._id);
        await PostModel.findByIdAndUpdate({ _id: postId }, post);
        return res.status(200).json({ message: "Post curtido" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao curtir post" });
    }
  }
);

export default jwtMiddleware(mongoMiddleware(likeHandler));
