import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import type { GeneralRes } from "@/types/GeneralRes";

const mongoMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<GeneralRes>) => {
    //verify if mongoose is connected => send to next middleware or endpoint
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }
    //if not connected => connect and send to next middleware or endpoint
    const { DB_CONEXAO_STRING } = process.env;
    //verify if DB_CONEXAO_STRING is defined
    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ error: "Não foi possível conectar ao banco de dados" });
    }
    //if everything is ok => try to connect to database
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error: ", err);
    });
    await mongoose.connect(DB_CONEXAO_STRING);
    //send to next middleware or endpoint
    return handler(req, res);
  };
export default mongoMiddleware;
