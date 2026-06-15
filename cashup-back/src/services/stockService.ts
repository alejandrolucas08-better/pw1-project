import axios from 'axios';
import { MarketAsset } from '../types/MarketAsset';

// Busca cotações e indicadores de Ações via Axios.
export const fetchStockAsset = async (symbol: string): Promise<MarketAsset | null> => {
  try {
    const token = process.env.BRAPI_TOKEN;
    // O parâmetro modules é enviado via URL conforme documentação da Brapi
    const url = `https://brapi.dev/api/quote/${symbol}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data?.results?.[0];
    if (!data) return null;

    const asset: MarketAsset = {
      ticker: data.symbol ?? symbol,
      name: data.longName ?? data.shortName ?? 'Ação Brasileira',
      current_price: data.regularMarketPrice ?? 0,
      updated_at: data.regularMarketTime ?? new Date().toISOString(),
      change: data.regularMarketChange ?? 0,
      change_percent: data.regularMarketChangePercent ?? 0,
      day_high: data.regularMarketDayHigh ?? 0,
      day_low: data.regularMarketDayLow ?? 0,
      volume: data.regularMarketVolume ?? 0,
      price_earnings: null,
      earnings_per_share: null,
    };

    if (data.logourl) {
      asset.logo_url = data.logourl;
    }

    return asset;
  } catch (error) {
    console.error(`❌ Erro ao buscar Ação ${symbol} via Axios:`, error);
    return null;
  }
};