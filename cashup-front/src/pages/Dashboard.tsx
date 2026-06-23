import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";
import { request } from "../services/httpClient";
import { Plus, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { type PortfolioResponse } from "../types/portfolio";
import { AssetModal } from "../components/AssetModal"; 

export const Dashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); 

  // 1. Função de Atualização Manual (Refresh/Mutação)
  const handleRefresh = useCallback(async () => {
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

  // 2. Efeito de Sincronização Inicial com o Backend
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading && !portfolio) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="light" size="sm" className="me-2" />
        <span className="text-white-50 small">Carregando patrimônio...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h4 className="fw-bold text-white m-0 tracking-tight">Visão Geral</h4>
          <p className="text-white-50 small m-0">Acompanhamento de ativos em tempo real</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="dark" 
            className="bg-transparent border-secondary border-opacity-25 text-white-50 hover-white p-2 rounded-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </Button>
          <Button 
            variant="white" 
            className="bg-white text-black fw-semibold d-flex align-items-center gap-2 px-3 py-2 rounded-2 border-0 hover-opacity"
            style={{ fontSize: "13px" }}
            onClick={() => setShowModal(true)} 
          >
            <Plus size={16} strokeWidth={2.5} />
            Adicionar Ativo
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="dark" className="border-danger text-danger bg-transparent small mb-4">
          {error}
        </Alert>
      )}

      {portfolio && (
        <>
          <Row className="mb-5">
            <Col xs={12}>
              <div className="p-4 border rounded-3 bg-black bg-opacity-40" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <span className="text-white-50 small text-uppercase tracking-wider" style={{ fontSize: "11px" }}>
                  Patrimônio Total Alocado
                </span>
                <h1 className="fw-bold tracking-tighter text-white mt-1 mb-0" style={{ fontSize: "3rem" }}>
                  {formatCurrency(portfolio.total_wallet_value)}
                </h1>
              </div>
            </Col>
          </Row>

          <div className="border rounded-3 overflow-hidden bg-black bg-opacity-20" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
            <Table responsive borderless className="table-dark m-0 align-middle text-white table-hover-custom">
              <thead>
                <tr className="border-bottom text-white-50 small" style={{ fontSize: "12px", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <th className="py-3 px-4">Ativo</th>
                  <th className="py-3">Qtd</th>
                  <th className="py-3">Preço Médio</th>
                  <th className="py-3">Preço Atual</th>
                  <th className="py-3">Total Atual</th>
                  <th className="py-3 text-end px-4">Retorno</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-white-50 small">
                      Nenhum ativo cadastrado na sua carteira ainda.
                    </td>
                  </tr>
                ) : (
                  portfolio.assets.map((asset) => {
                    const isPositive = asset.profitability >= 0;
                    return (
                      <tr key={asset.id} className="border-bottom" style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}>
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center gap-3">
                            {asset.logo_url ? (
                              <img 
                                src={asset.logo_url} 
                                alt={asset.ticker} 
                                className="rounded-circle bg-white"
                                style={{ width: "28px", height: "28px", objectFit: "cover" }}
                              />
                            ) : (
                              <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-white-50 font-monospace fw-bold" style={{ width: "28px", height: "28px", fontSize: "11px" }}>
                                {asset.ticker.substring(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="fw-bold text-white font-monospace">{asset.ticker}</span>
                              <div className="text-white-50 d-none d-sm-block" style={{ fontSize: "11px" }}>{asset.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-white-50 font-monospace">{asset.quantity}</td>
                        <td className="text-white-50 font-monospace">{formatCurrency(asset.average_price)}</td>
                        <td className="text-white font-monospace">{formatCurrency(asset.current_price)}</td>
                        <td className="fw-medium font-monospace">{formatCurrency(asset.current_total_value)}</td>
                        <td className={`text-end px-4 font-monospace ${isPositive ? "text-success" : "text-danger"}`}>
                          <span className="d-inline-flex align-items-center gap-1 small fw-semibold">
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {asset.profitability.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}

      <AssetModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        onSuccess={handleRefresh} // Executa o recarregamento via handler seguro pós-mutação
      />
    </div>
  );
};