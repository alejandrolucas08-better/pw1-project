import { useContext } from "react";
import { PortfolioContext } from "../contexts/PortfolioContext";

// Hook personalizado para acessar o contexto de portfolio
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio deve ser usado dentro de um PortfolioProvider");
  }
  return context;
}