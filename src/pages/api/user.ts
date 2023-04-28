import type { NextApiResponse, NextApiRequest } from "next";
import type { GeneralRes } from "@/types/GeneralRes";
import jwtMiddleware from "@/middlewares/jwtMiddleware";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import { UserModel } from "@/models/UserModel";
import nc from "next-connect";
import { uploadToCosmic, upload } from "@/services/uploadToCosmic";

const userHandler = nc()
  .use(upload.single("file"))
  .get(async (req: any, res: NextApiResponse<GeneralRes>) => {
    try {
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      user.password = undefined;
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Erro ao autenticar usuário" });
    }
  })
  .put(async (req: any, res: NextApiResponse<GeneralRes | any>) => {
    try {
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      const { name } = req.body;
      if (name && name.length > 2) {
        user.name = name;
      }
      const { file } = req; //entender pq o file está na req e não no body
      if (file && file.originalname) {
        const image = await uploadToCosmic(req);
        if (image && image.media && image.media.url) {
          user.avatar = image.media.url;
        }
      }
      await UserModel.findByIdAndUpdate({ _id: user._id }, user);
      return res
        .status(200)
        .json({ message: "Usuário alterado com sucesso", user });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Erro ao autenticar usuário" });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default jwtMiddleware(mongoMiddleware(userHandler));
