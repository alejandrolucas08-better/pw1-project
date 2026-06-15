import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import assetRoutes from './routes/assetRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', assetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'up', message: 'Backend rodando perfeitamente com TS!' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});