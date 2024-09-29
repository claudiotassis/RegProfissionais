// src/backend/interfaces/web/controllers/updateProfessional.js
import prisma from '../../../infrastructure/db/prisma/prismaClient';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id, qualifications } = req.body;

    const updatedProfessional = await prisma.professional.update({
      where: { id },
      data: {
        qualifications: qualifications.split(',').map(q => q.trim()),
      },
    });

    return res.status(200).json(updatedProfessional);
  }

  res.setHeader('Allow', ['PATCH']);
  return res.status(405).end(`Método ${req.method} não permitido`);
}
