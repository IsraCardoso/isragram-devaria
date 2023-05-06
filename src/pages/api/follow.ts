import type { NextApiRequest, NextApiResponse } from "next";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import { GeneralRes } from "@/types/GeneralRes";
import { FollowerModel } from "@/models/FollowerModel";

const followHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GeneralRes>
) => {
  try {
    //check method
    if (req.method === "PUT") {
      const { userId, id } = req?.query;
      const activeUser = await UserModel.findById(userId);
      // check if user exists
      if (!activeUser) {
        return res.status(400).json({ error: "Usuário logado não encontrado" });
      }
      if (userId === id) {
        return res.status(400).json({ error: "Não pode seguir a si mesmo" });
      }
      // check if user to be followed exists
      const userToBeFollowed = await UserModel.findById(id);
      if (!userToBeFollowed) {
        return res
          .status(400)
          .json({ error: "Usuário a ser seguido não encontrado" });
      }
      // check if user is already following
      const isFollowing = await FollowerModel.find({
        userId: userId,
        followedUserId: id,
      });

      // if is following, unfollow
      if (isFollowing.length > 0) {
        await FollowerModel.deleteMany({
          userId: userId,
          followedUserId: id,
        });
        activeUser.followingCount--;
        await UserModel.findByIdAndUpdate({ _id: userId }, activeUser);
        userToBeFollowed.followersCount--;
        await UserModel.findByIdAndUpdate({ _id: id }, userToBeFollowed);
        return res.status(200).json({ message: "Deixou de seguir" });
      }
      // if is not following, follow
      else {
        await FollowerModel.create({
          userId: userId,
          followedUserId: id,
        });
        activeUser.followingCount++;
        await UserModel.findByIdAndUpdate({ _id: userId }, activeUser);
        userToBeFollowed.followersCount++;
        await UserModel.findByIdAndUpdate({ _id: id }, userToBeFollowed);
        return res.status(200).json({ message: "Seguindo" });
      }
    }
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao carregar o feed" });
  }
};

export default jwtMiddleware(mongoMiddleware(followHandler));
