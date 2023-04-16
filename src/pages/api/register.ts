import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RegisteringReq } from "@/types/RegisteringReq";
import type { AnswerMessage } from "@/types/AnswerMessage";

const registerHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<AnswerMessage>
) => {
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
    return res.status(200).json({ message: "Usuário cadastrado com sucesso" });
  }
  return res.status(405).json({ error: "Método informado não é válido" });
};
