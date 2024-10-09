import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import loginHandler from './interfaces/web/controllers/login.js';
import professionalHandler from './interfaces/web/controllers/professional.js';
import userHandler from './interfaces/web/controllers/user.js';
import listProfessionalsHandler from './interfaces/web/controllers/listProfessionals.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://upbeat-sun-71821.pktriot.net'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', req.body);
  next();
});

app.get('/test', (req, res) => {
  res.json({ message: 'Conexão com o backend bem-sucedida' });
});

app.post('/login', loginHandler);
app.get('/user', userHandler);
app.get('/professionals', listProfessionalsHandler);
app.post('/professionals', professionalHandler);
app.patch('/professionals/:id', professionalHandler);
app.delete('/professionals/:id', professionalHandler);

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});