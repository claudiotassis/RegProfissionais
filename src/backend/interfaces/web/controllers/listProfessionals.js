// src/backend/interfaces/web/controllers/listProfessionals.js
import prisma from '../../../infrastructure/db/prisma/prismaClient.js'; // Certifique-se de usar a extensão .js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const professionals = await prisma.professional.findMany();
      return res.status(200).json(professionals);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar profissionais' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
