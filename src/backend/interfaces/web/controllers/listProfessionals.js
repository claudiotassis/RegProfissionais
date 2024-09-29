// src/backend/interfaces/web/controllers/listProfessionals.js

import prisma from '../../../infrastructure/db/prisma/prismaClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const professionals = await prisma.professional.findMany();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro ao listar profissionais:', error);
      return res.status(500).json({ error: 'Erro ao listar profissionais' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}