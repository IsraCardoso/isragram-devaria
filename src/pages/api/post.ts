import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RegisteringReq } from "@/types/RegisteringReq";
import type { GeneralRes } from "@/types/GeneralRes";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import mongoose from "mongoose";
import md5 from "md5";
import { uploadToCosmic, upload } from "@/services/uploadToCosmic";
import nc from "next-connect";
import jwtMiddleware from "@/middlewares/jwtMiddleware";
import { PostModel } from "@/models/PostModel";
import { UserModel } from "@/models/UserModel";

const postHandler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<GeneralRes>) => {
    // entender pq a req é diferente de NextApiRequest?

    try {
      const { userId } = req.query;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(400).json({ error: "Usuario nao encontrado" });
      }

      if (!req || !req.body) {
        return res.status(400).json({ error: "Dados inválidos" });
      }
      const { description } = req?.body;
      if (!description || description.length < 2) {
        return res.status(400).json({ error: "Descrição inválida" });
      }
      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "A imagem é obrigatória" });
      }
      // send image to cosmic and store the Cosmic object
      const image = await uploadToCosmic(req); 

      const post = {
        userId: user._id,
        description,
        photo: image.media.url,
        data: new Date(),
      };

      user.postsCount++;
      console.log(user)
      await UserModel.findByIdAndUpdate({_id : user._id}, user);
      await PostModel.create(post);


      return res.status(200).json({ message: "Post criado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Erro ao criar post" });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default jwtMiddleware(mongoMiddleware(postHandler));
