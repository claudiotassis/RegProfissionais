// src/backend/index.js
import express from 'express';
import cors from 'cors';
import professionalController from './interfaces/web/controllers/professional.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas para profissionais
app.get('/professionals', professionalController);
app.post('/professionals', professionalController);
app.patch('/professionals/:id', professionalController);
app.delete('/professionals/:id', professionalController);

// Iniciar o servidor na porta 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
