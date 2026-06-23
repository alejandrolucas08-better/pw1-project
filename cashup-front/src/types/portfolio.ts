export interface Asset {
  ticker: string;
  name: string;
  logo_url?: string;
  quantity: number;
  current_price: number;
  total_value: number;
  change: number;
  change_percent: number;
  day_high: number;
  day_low: number;
  volume: number;
  updated_at: string;
  
  // Campos opcionais específicos por tipo de ativo
  average_price?: number; // Pode não vir da API
  profitability?: number; // Pode não vir da API
  
  // FIIs
  p_vp?: number | null;
  dividend_yield_12m?: number | null;
  net_worth?: number | null;
  vacancy_rate?: number | null;
  
  // Ações
  price_earnings?: number | null;
  earnings_per_share?: number | null;
  
  // Cripto
  market_cap?: number | null;
  circulating_supply?: number | null;
  max_supply?: number | null;
}

export interface PortfolioResponse {
  total_wallet_value: number;
  assets: Asset[];
}

export interface PortfolioContextData {
  portfolio: PortfolioResponse | null;
  loading: boolean;
  error: string | null;
  selectedAsset: string | null;
  refreshPortfolio: () => Promise<void>;
  selectAsset: (ticker: string | null) => void;
}