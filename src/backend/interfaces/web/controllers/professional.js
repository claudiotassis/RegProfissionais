// src/backend/interfaces/web/controllers/professional.js

import prisma from '../../../infrastructure/db/prisma/prismaClient.js';

export default async function handler(req, res) {
  // Listar todos os profissionais
  if (req.method === 'GET') {
    try {
      const professionals = await prisma.professional.findMany();
      return res.status(200).json(professionals);
    } catch (error) {
      console.error('Erro ao listar profissionais:', error);
      return res.status(500).json({ error: 'Erro ao listar profissionais' });
    }
  }

  // Criar um novo profissional
  if (req.method === 'POST') {
    const { name, email, qualifications } = req.body;

    try {
      const existingProfessional = await prisma.professional.findUnique({
        where: { email },
      });

      if (existingProfessional) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      const professional = await prisma.professional.create({
        data: {
          name,
          email,
          qualifications,
        },
      });

      return res.status(201).json(professional);
    } catch (error) {
      console.error('Erro ao registrar profissional:', error);
      return res.status(500).json({ error: 'Erro ao registrar profissional' });
    }
  }

  // Editar um profissional 
if (req.method === 'PATCH') {
  const { id } = req.params; // Mudei de req.query para req.params
  const { name, email, qualifications } = req.body;

  console.log('Recebendo PATCH - ID:', id, 'Dados:', { name, email, qualifications });

  try {
    const updatedProfessional = await prisma.professional.update({
      where: { id },
      data: {
        name,
        email,
        qualifications,
      },
    });
    return res.status(200).json(updatedProfessional);
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return res.status(500).json({ error: 'Erro ao atualizar profissional' });
  }
}


  // Deletar um profissional
if (req.method === 'DELETE') {
  const { id } = req.params; // Mudei de req.query para req.params
  console.log('Recebendo DELETE - ID:', id);

  try {
    await prisma.professional.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Profissional deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar profissional:', error);
    return res.status(500).json({ error: 'Erro ao deletar profissional' });
  }
}


  // Resposta para métodos não permitidos
  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
