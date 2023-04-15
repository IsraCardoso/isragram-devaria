import type { NextApiRequest, NextApiResponse } from 'next'
import mongoMiddleware from '@/middlewares/mongoMiddleware'
import type { answerMessage } from '@/types/answerMessage'

const loginHandler =(
  req: NextApiRequest,
  res: NextApiResponse<answerMessage>
) =>{
  if(req.method === 'POST'){
    const { login , password } = req.body
    if(login === 'admin' && password === 'admin'){
      return res.status(200).json({message:'Login realizado com sucesso'})
    }
    return res.status(405).json({error:'Login ou senha inválidos'})
  }
  return res.status(405).json({error:'Método informado não é válido'})
}

export default mongoMiddleware(loginHandler)