// src/backend/interfaces/web/controllers/user.js
import prisma from '../../../infrastructure/db/prisma/prismaClient.js';
import jwt from 'jsonwebtoken'; // Usado para decodificar o JWT

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]; // Assume que o token JWT está no cabeçalho "Authorization"
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o JWT
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }, // Recupera o usuário pelo ID no JWT
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
