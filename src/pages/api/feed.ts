import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const feedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
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
        const { userId } = req.query;
        console.log(userId);
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(400).json({ error: "Usuário não encontrado" });
        }
        const feed = await PostModel.find({ userId: userId }).sort({
          data: -1,
        });
        return res.status(200).json(feed);
      }
    }
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao carregar o feed" });
  }
};

export default jwtMiddleware(mongoMiddleware(feedHandler));
