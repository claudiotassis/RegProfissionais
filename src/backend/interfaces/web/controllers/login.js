// src/backend/interfaces/web/controllers/login.js
import prisma from '../../../infrastructure/db/prisma/prismaClient.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        console.log('Dados recebidos:', { email, password });

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                console.log('Usuário não encontrado:', email);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Senha incorreta para o usuário:', email);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            console.log('Login bem-sucedido para o usuário:', email);
            return res.status(200).json({ message: 'Login bem-sucedido', userId: user.id });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
}