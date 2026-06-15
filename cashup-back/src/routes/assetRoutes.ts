import { Router } from 'express';
import { addAsset, getPortfolio, updateAsset, deleteAsset } from '../controllers/assetController';
import {authMiddleware} from '../middlewares/authMiddleware'

const router = Router();

// Aplica o middleware de autenticação a todas as rotas definidas abaixo
router.use(authMiddleware)

// Endpoint (POST) para cadastrar/comprar mais ações ou FIIs
router.post('/assets', addAsset);

// Endpoint (GET) que lê o banco, consulta a Brapi e traz a carteira calculada
router.get('/portfolio', getPortfolio);

// Endpoint (PUT) para atualizar a quantidade de um ativo na carteira do usuário
router.put('/assets/:ticker', updateAsset);

// Endpoint (DELETE) para deletar um ativo da carteira do usuário
router.delete('/assets/:ticker', deleteAsset);


export default router;