// src/contexts/PortfolioProvider.tsx

import React, { useState, useEffect, useCallback } from "react";
import { request } from "../services/httpClient";
import { type PortfolioResponse} from "../types/portfolio";
import { PortfolioContext } from "./PortfolioContext";

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Função para refresh manual (com feedback de loading)
  const refreshPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<PortfolioResponse>("/portfolio", "GET");
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Não foi possível carregar os dados da carteira.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial com requisição inline (evita setState síncrono no effect)
  useEffect(() => {
    const controller = new AbortController();

    request<PortfolioResponse>("/portfolio", "GET", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setPortfolio(data);
          setError(null);
        }
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError((err as Error).message || "Não foi possível carregar os dados da carteira.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Seleciona ativo para visualização
  const selectAsset = (ticker: string | null) => {
    setSelectedAsset(ticker);
  };

  return (
    <PortfolioContext.Provider value={{
      portfolio,
      loading,
      error,
      selectedAsset,
      refreshPortfolio,
      selectAsset,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};