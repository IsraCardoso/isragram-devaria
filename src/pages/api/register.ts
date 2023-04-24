import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RegisteringReq } from "@/types/RegisteringReq";
import type { GeneralRes } from "@/types/GeneralRes";
import { UserModel } from "@/models/UserModel";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import mongoose from "mongoose";
import md5 from "md5";
import { uploadToCosmic, upload } from "@/services/uploadToCosmic";
import nc from "next-connect";

const registerHandler = nc()
  // middleware to check HTTP method and send 405 for all methods except POST
  // .use((req: NextApiRequest, res: NextApiResponse, next) => {
  //   if (req.method !== "POST") {
  //     return res.status(405).end("Método inválido");
  //   } else {
  //     next();
  //   }
  // })
  .use(upload.single("file"))
  .post(async (req: NextApiRequest, res: NextApiResponse<GeneralRes>) => {
    try {
      if (req.method === "POST") {
        let user = req.body as RegisteringReq;
        if (!user.name || user.name.length < 3) {
          return res.status(400).json({ error: "Nome inválido" });
        }
        if (
          !user.email ||
          user.email.length < 5 ||
          !user.email.includes("@") ||
          !user.email.includes(".")
        ) {
          return res.status(400).json({ error: "Email inválido" });
        }
        if (!user.password || user.password.length < 4) {
          return res.status(400).json({ error: "Senha inválida" });
        }
        //validate if the user is unique by comparing email
        const sameEmailUsers = await UserModel.find({ email: user.email });
        if (sameEmailUsers.length > 0) {
          return res.status(400).json({ error: "Email já cadastrado" });
        }

        //send image to cosmic
        const image = await uploadToCosmic(req);

        //save to database
        const newUser = {
          name: user.name,
          email: user.email,
          password: md5(user.password),
          avatar: image?.media?.url,
        };
        await UserModel.create(newUser);
        return res
          .status(200)
          .json({ message: "Usuário cadastrado com sucesso" });
      }
    } catch (e: any) {
      console.log(e);
      return res.status(400).json({ error: e.toString() });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default mongoMiddleware(registerHandler);
