export interface MarketAsset {
  // Campos básicos para Ações e FIIs
  ticker: string;       // Código do ativo (Chave primária no mercado)
  name: string;         // Nome da empresa
  current_price: number;// Preço atual de mercado
  logo_url?: string;    // Link para a imagem do logo da empresa
  updated_at: string;   // Horário da última atualização na bolsa
  change: number;       // Variação em reais (ex: -0.58)
  change_percent: number;         // Variação em % (ex: -1.39)
  day_high: number;               // Máxima do dia (ex: 41.53)
  day_low: number;                // Mínima do dia (ex: 40.82)
  volume: number;                 // Volume de negociação (ex: 34024700)
  
  // Para Ações:
  price_earnings?: number | null;  // P/L - Preço/Lucro (Pode ser null em FIIs)
  earnings_per_share?: number | null; // LPA - Lucro por Ação (Pode ser null em FIIs)

  // Para FIIs:
  dividend_yield_12m?: number | null;        // Dividend Yield (ex: 6.5) - Só para FIIs
  p_vp?: number | null;                      // Preço/Valor Patrimonial (ex: 0.95) - Só para FIIs
  net_worth?: number | null;                 // Valor Patrimonial por cota (ex: 100) - Só para FIIs
  vacancy_rate?: number | null;              // Taxa de Vacância (ex: 5.2) - Só para FIIs

  // Para Criptomoedas:
  circulating_supply?: number | null;        // Quantidade de moedas em circulação (ex: 19000000) - Só para Criptomoedas
  max_supply?: number | null;               // Limite máximo de moedas (ex: 21000000) - Só para Criptomoedas
  market_cap?: number | null;              // Valor de mercado (ex: 800000000000) - Só para Criptomoedas
}