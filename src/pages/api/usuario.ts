import type { NextApiResponse, NextApiRequest } from "next";
import type { GeneralRes } from "@/types/GeneralRes";
import jwtMiddleware from "@/middlewares/jwMiddleware";

const userHandler = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ message: "Hello from user handler" });
};

export default jwtMiddleware(userHandler);
