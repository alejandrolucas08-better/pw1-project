import { Router } from 'express';
import { addAsset, getPortfolio } from '../controllers/assetController';

const router = Router();

// Endpoint (POST) para cadastrar/comprar mais ações ou FIIs
router.post('/assets', addAsset);

// Endpoint (GET) que lê o banco, consulta a Brapi e traz a carteira calculada
router.get('/portfolio', getPortfolio);

export default router;