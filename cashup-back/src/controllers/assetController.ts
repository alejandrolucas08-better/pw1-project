import { Request, Response } from "express";
import pool from "../config/database";
import { fetchMarketAsset } from "../services/brapiService"; 

// Controlador para adicionar um ativo à carteira do usuário
export const addAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticker, quantity } = req.body;
    const userId = 1; // ID do usuário autenticado (temporário)

    if (!ticker || quantity == undefined) {
      res.status(400).json({
        error: "O código de identificação (ex.: PETR4, MXRF11) e quantidade são necessários",
      });
      return;
    }

    const queryText = `
         INSERT INTO user_assets (user_id, ticker, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, ticker) 
         DO UPDATE SET quantity = user_assets.quantity + EXCLUDED.quantity
         RETURNING *;`;

    const result = await pool.query(queryText, [
      userId,
      ticker.toUpperCase().trim(), // Limpa espaços extras
      quantity,
    ]);

    res.status(201).json({
      message: "Ativo adicionado com sucesso!",
      asset: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao adicionar ativo:", error);
    res.status(500).json({ error: "Erro interno ao adicionar ativo." });
  }
};

// Controlador para buscar e consolidar a carteira do usuário
export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = 1;
    const userAssetResult = await pool.query(
      "SELECT ticker, quantity FROM user_assets WHERE user_id = $1 AND quantity > 0",
      [userId],
    );

    const dbAssets = userAssetResult.rows;

    if (dbAssets.length === 0) {
      res.json({ total_wallet_value: 0, assets: [] });
      return;
    }

    // Cria a lista de promessas para buscar os dados de mercado em paralelo
    const portfolioPromises = dbAssets.map(async (asset) => {
      const maketData = await fetchMarketAsset(asset.ticker);

      if (!maketData) {
        return {
          ticker: asset.ticker,
          quantity: asset.quantity,
          name: "Ativo não encontrado",
          current_price: 0,
          total_value: 0,
        };
      }

      const totalValue = asset.quantity * maketData.current_price;

      return {
        ...maketData, // 2. Espalha dinamicamente os campos (traz P/L para ações, P/VP para FIIs e Market Cap para Cripto)
        ticker: asset.ticker,
        quantity: asset.quantity,
        total_value: Number(totalValue.toFixed(2)),
      };
    });

    // Aguarda todas as requisições do Axios terminarem
    const portfolioAssets = await Promise.all(portfolioPromises);

    // 3. Calcula o valor total da carteira de forma segura após a resolução das Promises
    const totalWalletValue = portfolioAssets.reduce((sum, asset) => sum + asset.total_value, 0);

    res.json({
      total_wallet_value: Number(totalWalletValue.toFixed(2)),
      assets: portfolioAssets,
    });
  } catch (error) {
    console.error("Erro ao buscar carteira do usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar carteira." });
  }
};