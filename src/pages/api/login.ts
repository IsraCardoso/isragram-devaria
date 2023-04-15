import type { NextApiRequest, NextApiResponse } from 'next'


const loginHandler =(
  req: NextApiRequest,
  res: NextApiResponse
) =>{
  if(req.method === 'POST'){
    const { login , password } = req.body
    if(login === 'admin' && password === 'admin'){
      res.status(200).json({message:'Login realizado com sucesso'})
    }
    return res.status(405).json({error:'Login ou senha inválidos'})
  }
  return res.status(405).json({error:'Método informado não é válido'})
}

export default loginHandler