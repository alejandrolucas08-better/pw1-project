import { MarketAsset } from '../types/MarketAsset';
import { fetchCryptoAsset } from './cryptoService';
import { fetchFiiAsset } from './fiiService';
import { fetchStockAsset } from './stockService';

// Função unificada para buscar um ativo de mercado (Ação, FII ou Criptomoeda) com base no ticker.
export const fetchMarketAsset = async (ticker: string): Promise<MarketAsset | null> => {
  const symbol = ticker.toUpperCase().trim();

  // Regra para identificar Criptomoedas
  const cryptoList = ["BTC", "ETH", "ADA", "BNB", "USDT", "XRP", "DOGE", "SOL", "USDC", "DOT", "UNI", "BCH", "LTC", "LINK", "MATIC", "AVAX" ];
  const isCrypto = cryptoList.includes(symbol) || 
                   ((symbol.endsWith('USD') || symbol.endsWith('BRL')) && !symbol.match(/\d/));

  if (isCrypto) {
    return fetchCryptoAsset(symbol);
  }

  // Regra para identificar Fundos Imobiliários (FIIs terminam com 11 e não são ETFs como BOVA11)
  const isFii = symbol.endsWith('11') && !symbol.startsWith('BOVA') && !symbol.startsWith('IVVB') && !symbol.startsWith('SMAL') && !symbol.startsWith('SPXI') && !symbol.startsWith('DIVO');
  if (isFii) {
    return fetchFiiAsset(symbol);
  }

  // Padrão: Trata o ativo como uma Ação da B3
  return fetchStockAsset(symbol);
};