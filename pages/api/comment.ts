import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { GeneralRes } from "../../types/GeneralRes";
import jwtMiddleware from "../../middlewares/jwtMiddleware";
import mongoMiddleware from "../../middlewares/mongoMiddleware";
import { UserModel } from "../../models/UserModel";
import { PostModel } from "../../models/PostModel";
import corsPolicy from "../../middlewares/corsPolicy";

const commentHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GeneralRes>
) => {
  try {
    if (req.method === "PUT") {
      const { userId, postId } = req?.query;
      const { comment } = req?.body;
      const activeUser = await UserModel.findById(userId);
      if (!activeUser) {
        return res.status(400).json({ error: "Usuário logado não encontrado" });
      }
      if (!comment || comment.length < 1) {
        return res.status(400).json({ error: "Comentário não pode ser vazio" });
      }
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(400).json({ error: "Post não encontrado" });
      }
      const commentObj = {
        userId: activeUser._id,
        avatar: activeUser.avatar,
        name: activeUser.name,
        comment,
      };

      post.comments.push(commentObj);
      await PostModel.findByIdAndUpdate({ _id: postId }, post);

      return res.status(200).json({ message: "Comentário feito com sucesso" });
    }
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao fazer comentário" });
  }
};

export default corsPolicy(jwtMiddleware(mongoMiddleware(commentHandler)));
