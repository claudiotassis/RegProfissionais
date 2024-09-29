// src/backend/interfaces/web/controllers/user.js
import prisma from '../../../infrastructure/db/prisma/prismaClient.js';
import jwt from 'jsonwebtoken';

export default async function userHandler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({ name: user.email, role: user.role });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
