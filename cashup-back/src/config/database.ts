import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Evento disparado quando o pool consegue se conectar ao banco
pool.on('connect', () => {
  console.log('🐘 Conexão com o PostgreSQL estabelecida com sucesso!');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do Postgres:', err);
});

export default pool;