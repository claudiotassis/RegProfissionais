// src/backend/interfaces/web/controllers/professional.js

import prisma from '../../../infrastructure/db/prisma/prismaClient.js';

export default async function handler(req, res) {
  console.log('Requisição recebida em /professionals');
  console.log('Método:', req.method);
  console.log('Corpo:', req.body);
  console.log('Parâmetros:', req.params);

  try {
    switch (req.method) {
      case 'GET':
        const professionals = await prisma.professional.findMany();
        return res.status(200).json(professionals);

      case 'POST':
        const { name, email, qualifications } = req.body;
        const newProfessional = await prisma.professional.create({
          data: { name, email, qualifications },
        });
        return res.status(201).json(newProfessional);

      case 'PATCH':
        const { id } = req.params;
        const updatedData = req.body;
        const updatedProfessional = await prisma.professional.update({
          where: { id },
          data: updatedData,
        });
        return res.status(200).json(updatedProfessional);

      case 'DELETE':
        const professionalId = req.params.id;
        await prisma.professional.delete({
          where: { id: professionalId },
        });
        return res.status(204).end();

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro no controlador de profissionais:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
}