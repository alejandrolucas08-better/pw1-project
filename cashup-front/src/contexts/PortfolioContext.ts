import { createContext } from "react";
import { type PortfolioContextData } from "../types/portfolio";

// Cria o contexto tipado
export const PortfolioContext = createContext<PortfolioContextData>({} as PortfolioContextData);