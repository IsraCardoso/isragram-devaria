import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";
import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import nc from "next-connect";
import { GeneralRes } from "@/types/GeneralRes";

const likeHandler = nc().
put(
  async (req: NextApiRequest, res: NextApiResponse<GeneralRes>) => {
    try {
      // if(){

      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao curtir post" });
    }
  }
)
