import corsPolicy from "../../middlewares/corsPolicy";
import jwtMiddleware from "../../middlewares/jwtMiddleware";
import mongoMiddleware from "../../middlewares/mongoMiddleware";
import { UserModel } from "../../models/UserModel";
import { GeneralRes } from "../../types/GeneralRes";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const searchHandler = nc().get(
  async (req: NextApiRequest, res: NextApiResponse<GeneralRes | any[]>) => {
    try {
      if (req?.query?.id) {
        const foundUser = await UserModel.findById(req?.query?.id);
        if (!foundUser) {
          return res.status(400).json({ error: "Usuario nao encontrado" });
        }
        foundUser.password = undefined;
        return res.status(200).json(foundUser);
      } else {
        const { filter } = req?.query;
        if (!filter || filter.length < 2) {
          return res.status(400).json({ error: "Filtro inválido" });
        }
        const users = await UserModel.find({
          $or: [
            { name: { $regex: filter, $options: "i" } },
            { username: { $regex: filter, $options: "i" } },
          ],
        });
        return res.status(200).json(users);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
);

export default corsPolicy(jwtMiddleware(mongoMiddleware(searchHandler)));
