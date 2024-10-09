import prisma from '../../../infrastructure/db/prisma/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    console.log('Requisição de login recebida');
    console.log('Método:', req.method);
    console.log('Corpo:', req.body);

    if (req.method === 'POST') {
        const { email, password } = req.body;

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

            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET não está definido');
                return res.status(500).json({ message: 'Erro de configuração do servidor' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log('Login bem-sucedido para o usuário:', email);
            return res.status(200).json({ message: 'Login bem-sucedido', token });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
}