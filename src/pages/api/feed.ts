import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import { FollowerModel, IFollower } from "@/models/FollowerModel";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const feedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req?.method === "GET") {
      //specifc user´s feed
      if (req?.query?.id) {
        const user = await UserModel.findById(req?.query?.id);
        if (!user) {
          return res.status(400).json({ erro: "Usuario nao encontrado" });
        }
        const feed = await PostModel.find({ userId: user._id }).sort({
          data: -1,
        });

        return res.status(200).json(feed);
      } else {
        //general feed (home)
        const { userId } = req?.query;
        const activeUser = await UserModel.findById(userId);
        if (!activeUser) {
          return res.status(400).json({ error: "Usuário não encontrado" });
        }
        const ActiveUserFollows: IFollower[] = await FollowerModel.find({
          userId: userId,
        });
        const ActiveUserFollowsIds = ActiveUserFollows.map((followedUsers) => {
          return followedUsers.followedUserId;
        });
        const posts = await PostModel.find({
          $or: [{ userId: userId }, { userId: ActiveUserFollowsIds }],
        }).sort({ data: -1 });
        const postsWithUser = [];
        for (const post of posts) {
          const postUser = await UserModel.findById(post.userId);
          if (postUser) {
            const finalPost = {
              ...post._doc,
              user: { username: postUser.username, avatar: postUser.avatar },
            };
            postsWithUser.push(finalPost);
          }
        }

        return res.status(200).json(postsWithUser);
      }
    }
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao carregar o feed" });
  }
};

export default jwtMiddleware(mongoMiddleware(feedHandler));
