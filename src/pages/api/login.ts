import type { NextApiRequest, NextApiResponse } from "next";
import mongoMiddleware from "@/middlewares/mongoMiddleware";
import type { GeneralRes } from "@/types/GeneralRes";
import { UserModel } from "@/models/UserModel";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { LoginRes } from "@/types/LoginRes";

const loginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GeneralRes | LoginRes>
) => {
  if (req.method === "POST") {
    const { login, password } = req.body;
    const foundUsers = await UserModel.find({
      email: login,
      password: md5(password),
    });
    if (foundUsers.length > 0) {
      const foundUser = foundUsers[0];
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return res.status(500).json({ error: "JWT não informado no .env" });
      }
      const userToken = jwt.sign(
        {
          _id: foundUser._id,
        },
        JWT_SECRET
      );
      return res
        .status(200)
        .json({
          name: foundUser.name,
          email: foundUser.email,
          token: userToken,
        });
    }
    return res.status(405).json({ error: "Login ou senha inválidos" });
  }
  return res.status(405).json({ error: "Método informado não é válido" });
};

export default mongoMiddleware(loginHandler);
