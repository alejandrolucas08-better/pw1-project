import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Validação da DATABASE_URL no inicialização
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada. Verifique o arquivo .env');
}

// Configuração do Pool de Conexões com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo máximo que uma conexão pode ficar ociosa
  connectionTimeoutMillis: 5000, // Tempo máximo para estabelecer uma nova conexão
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do Postgres:', err);
  process.exit(-1); // Encerra o processo em caso de erro crítico no pool
});

export default pool;