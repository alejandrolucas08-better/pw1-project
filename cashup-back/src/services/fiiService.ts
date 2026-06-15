import axios from 'axios';
import { MarketAsset } from '../types/MarketAsset';

// Busca cotações e indicadores de Fundos Imobiliários via Axios.
export const fetchFiiAsset = async (symbol: string): Promise<MarketAsset | null> => {
  try {
    const token = process.env.BRAPI_TOKEN;
    const headers = { Authorization: `Bearer ${token}` };

    // Busca a cotação básica do FII
    const quoteUrl = `https://brapi.dev/api/quote/${symbol}`;
    const quoteResponse = await axios.get(quoteUrl, { headers });
    const quoteData = quoteResponse.data?.results?.[0];

    if (!quoteData) return null;

    // Busca os indicadores avançados do FII (Tratado com try/catch isolado devido ao plano da API)
    let fiiIndicators: any = null;
    try {
      const indicatorsUrl = `https://brapi.dev/api/v2/fii/indicators?symbols=${symbol}`;
      const indicatorsResponse = await axios.get(indicatorsUrl, { headers });
      fiiIndicators = indicatorsResponse.data?.results?.[0];
    } catch (e) {
      console.warn(`⚠️ Indicadores patrimoniais indisponíveis para o FII ${symbol} no plano atual.`);
    }

    const asset: MarketAsset = {
      ticker: quoteData.symbol ?? symbol,
      name: quoteData.longName ?? quoteData.shortName ?? 'Fundo Imobiliário',
      current_price: quoteData.regularMarketPrice ?? 0,
      updated_at: quoteData.regularMarketTime ?? new Date().toISOString(),
      change: quoteData.regularMarketChange ?? 0,
      change_percent: quoteData.regularMarketChangePercent ?? 0,
      day_high: quoteData.regularMarketDayHigh ?? 0,
      day_low: quoteData.regularMarketDayLow ?? 0,
      volume: quoteData.regularMarketVolume ?? 0,
      p_vp: fiiIndicators?.pvp ?? null,
      dividend_yield_12m: fiiIndicators?.dividendYield12m ?? null,
      net_worth: fiiIndicators?.netWorth ?? null,
      vacancy_rate: fiiIndicators?.vacancyRate ?? null,
    };

    if (quoteData.logourl) {
      asset.logo_url = quoteData.logourl;
    }

    return asset;
  } catch (error) {
    console.error(`❌ Erro ao buscar FII ${symbol} via Axios:`, error);
    return null;
  }
};