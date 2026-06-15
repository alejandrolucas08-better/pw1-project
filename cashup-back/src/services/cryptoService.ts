import axios from 'axios';
import { MarketAsset } from '../types/MarketAsset';

// Mapeamento simples de siglas para o ID que a CoinGecko entende
const cryptoIdMap: { [key: string]: string } = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
};

export const fetchCryptoAsset = async (symbol: string): Promise<MarketAsset | null> => {
  try {
    const coinId = cryptoIdMap[symbol.toUpperCase()] || symbol.toLowerCase();
    
    // API pública e gratuita da CoinGecko (Não precisa de token nas headers)
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=${coinId}`;
    const response = await axios.get(url);

    const cryptoData = response.data?.[0];
    if (!cryptoData) return null;

    const asset: MarketAsset = {
      ticker: symbol.toUpperCase(),
      name: cryptoData.name,
      current_price: cryptoData.current_price ?? 0,
      updated_at: cryptoData.last_updated ?? new Date().toISOString(),
      change: cryptoData.price_change_24h ?? 0,
      change_percent: cryptoData.price_change_percentage_24h ?? 0,
      day_high: cryptoData.high_24h ?? 0,
      day_low: cryptoData.low_24h ?? 0,
      volume: cryptoData.total_volume ?? 0,
      market_cap: cryptoData.market_cap ?? null,
      circulating_supply: cryptoData.circulating_supply ?? null,
      max_supply: cryptoData.max_supply ?? null,
      logo_url: cryptoData.image ?? null
    };

    return asset;
  } catch (error) {
    console.error(`❌ Erro ao buscar criptomoeda ${symbol} via CoinGecko:`, error);
    return null;
  }
};