// src/backend/index.js

import express from 'express';
import cors from 'cors';
import loginHandler from './interfaces/web/controllers/login.js';
import professionalHandler from './interfaces/web/controllers/professional.js';

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Rota para login
app.post('/login', loginHandler);

// Rotas para profissionais
app.get('/professionals', professionalHandler);
app.post('/professionals', professionalHandler);
app.patch('/professionals/:id', professionalHandler);
app.delete('/professionals/:id', professionalHandler);

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Iniciar o servidor na porta 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});