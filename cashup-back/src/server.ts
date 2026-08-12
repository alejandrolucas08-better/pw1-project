import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import assetRoutes from './routes/assetRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS com origem dinâmica baseada em variável de ambiente
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', assetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'up', message: 'Backend rodando perfeitamente com TS!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});