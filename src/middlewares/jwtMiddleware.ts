import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { GeneralRes } from "@/types/GeneralRes";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtMiddleware =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<GeneralRes>) => {
    try {
      //verify if token is valid => send to next middleware or endpoint
      //if not valid => send error message
      const JWT_SECRET = process.env.JWT_SECRET as string;
      if (!JWT_SECRET) {
        return res.status(500).json({ error: "JWT não informado no .env" });
      }
      if (!req.headers.authorization) {
        return res.status(401).json({ error: "Token não informado" });
      }
      // verify if options request => send to next middleware or endpoint
      if (req.method !== "OPTIONS") {
        const token = req.headers.authorization.split(" ")[1];
        // verify if token exists
        if (!token) {
          return res.status(401).json({ error: "Token não informado" });
        }
        // verify if token is valid
        const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (!decodedToken) {
          return res.status(401).json({ error: "Token inválido" });
        }
        //if the request doesn't have a query object, create it
        //=> and add the userId to the query object
        if (!req.query) {
          req.query = {};
        }
        req.query.userId = decodedToken._id;
      }
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Não foi possível validar token de acesso" });
    }

    //if everything is ok => send to next middleware or endpoint
    return handler(req, res);
  };

export default jwtMiddleware;
