import React, { useState } from "react";
import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import { usePortfolio } from "../hooks/usePortfolio";
import { TrendingUp, TrendingDown, Edit2, BarChart3 } from "lucide-react";
import { AssetModal } from "../components/AssetModal";
import { type Asset } from "../types/portfolio";

export const Dashboard: React.FC = () => {
  const { portfolio, loading, error, selectedAsset, refreshPortfolio } = usePortfolio();
  const [showEditModal, setShowEditModal] = useState(false);

  const currentAsset: Asset | undefined = portfolio?.assets.find((asset: Asset) => asset.ticker === selectedAsset);

  const formatCurrency = (value: number | undefined | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  const formatPercent = (value: number | undefined | null) => {
    return (value || 0).toFixed(2);
  };

  const formatNumber = (value: number | undefined | null) => {
    return (value || 0).toLocaleString("pt-BR");
  };

  if (loading && !portfolio) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: "60vh" }}>
        <span style={{ color: "rgba(255, 255, 255, 0.6)" }} className="small">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {error && (
        <Alert variant="dark" className="border-danger text-danger small mb-4" style={{ backgroundColor: "rgba(220, 53, 69, 0.1)", borderColor: "rgba(220, 53, 69, 0.3)" }}>
          {error}
        </Alert>
      )}

      {/* Card Superior: Gerenciar Ativo */}
      <Card className="border-0 mb-4" style={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-white m-0">Gerenciar Ativo</h5>
            {currentAsset && (
              <Button
                variant="outline-light"
                size="sm"
                className="d-flex align-items-center gap-1"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)", color: "rgba(255, 255, 255, 0.9)" }}
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 size={14} />
                Editar
              </Button>
            )}
          </div>

          {!currentAsset ? (
            <div className="text-center py-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              <p className="mb-0">Selecione um ativo na sidebar para gerenciar</p>
            </div>
          ) : (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Ticker</small>
                  <div className="fw-bold text-white fs-4 font-monospace">{currentAsset.ticker}</div>
                </div>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Nome</small>
                  <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>{currentAsset.name || "N/A"}</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Quantidade</small>
                  <div className="fw-bold text-white fs-5">{currentAsset.quantity}</div>
                </div>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Preço Médio</small>
                  <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    {currentAsset.average_price !== undefined 
                      ? formatCurrency(currentAsset.average_price)
                      : "N/A"}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Card Inferior: Dados de Mercado */}
      <Card className="border-0" style={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-white" />
            <h5 className="fw-bold text-white m-0">Dados de Mercado</h5>
          </div>

          {!currentAsset ? (
            <div className="text-center py-4" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              <p className="mb-0">Selecione um ativo na sidebar para ver dados de mercado</p>
            </div>
          ) : (
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Preço Atual</small>
                  <div className="fw-bold text-white fs-4">{formatCurrency(currentAsset.current_price)}</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Variação</small>
                  <div className={`fw-bold fs-5 ${(currentAsset.change_percent || 0) >= 0 ? "text-success" : "text-danger"}`}>
                    {(currentAsset.change_percent || 0) >= 0 ? <TrendingUp size={16} className="me-1" /> : <TrendingDown size={16} className="me-1" />}
                    {formatPercent(currentAsset.change_percent)}%
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Valor Total</small>
                  <div className="fw-bold text-white fs-4">{formatCurrency(currentAsset.total_value)}</div>
                </div>
              </Col>
              <Col md={12}>
                <hr style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "1rem 0" }} />
                <Row>
                  <Col md={3}>
                    <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Máxima do Dia</small>
                    <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>{formatCurrency(currentAsset.day_high)}</div>
                  </Col>
                  <Col md={3}>
                    <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Mínima do Dia</small>
                    <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>{formatCurrency(currentAsset.day_low)}</div>
                  </Col>
                  <Col md={3}>
                    <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Volume</small>
                    <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>{formatNumber(currentAsset.volume)}</div>
                  </Col>
                  <Col md={3}>
                    <small style={{ color: "rgba(255, 255, 255, 0.5)" }}>Rentabilidade</small>
                    <div className={`fw-semibold ${(currentAsset.profitability || 0) >= 0 ? "text-success" : "text-danger"}`}>
                      {currentAsset.profitability !== undefined 
                        ? `${formatPercent(currentAsset.profitability)}%`
                        : "N/A"}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Edição */}
      {showEditModal && currentAsset && (
        <AssetModal
          key={currentAsset.ticker}
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          onSuccess={refreshPortfolio}
          editMode={{
            ticker: currentAsset.ticker,
            quantity: currentAsset.quantity.toString(),
            price: currentAsset.average_price?.toString() || "0",
          }}
        />
      )}
    </div>
  );
};