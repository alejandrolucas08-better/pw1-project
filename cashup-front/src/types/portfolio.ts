export interface AssetPortfolioItem {
  id: number;
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  average_price: number;
  current_price: number;
  total_investment: number;
  current_total_value: number;
  profitability: number;
  logo_url: string | null;
}

export interface PortfolioResponse {
  total_wallet_value: number;
  assets: AssetPortfolioItem[];
}