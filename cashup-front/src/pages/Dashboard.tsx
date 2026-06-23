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

  // Formata valores em BRL com fallback para 0
  const formatCurrency = (value: number | undefined | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  // Formata percentual com fallback para 0
  const formatPercent = (value: number | undefined | null) => {
    return (value || 0).toFixed(2);
  };

  // Formata número com fallback para 0
  const formatNumber = (value: number | undefined | null) => {
    return (value || 0).toLocaleString("pt-BR");
  };

  if (loading && !portfolio) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: "60vh" }}>
        <span className="text-white-50 small">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {error && (
        <Alert variant="dark" className="border-danger text-danger bg-transparent small mb-4">
          {error}
        </Alert>
      )}

      {/* Card Superior: Editar Ativo */}
      <Card className="bg-black bg-opacity-40 border-0 mb-4" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-white m-0">Gerenciar Ativo</h5>
            {currentAsset && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 size={14} className="me-1" />
                Editar
              </Button>
            )}
          </div>

          {!currentAsset ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-0">Selecione um ativo na sidebar para gerenciar</p>
            </div>
          ) : (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <small className="text-muted">Ticker</small>
                  <div className="fw-bold text-white fs-4 font-monospace">{currentAsset.ticker}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Nome</small>
                  <div className="text-white-50">{currentAsset.name || "N/A"}</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <small className="text-muted">Quantidade</small>
                  <div className="fw-bold text-white fs-5">{currentAsset.quantity}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Preço Médio</small>
                  <div className="text-white-50">
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
      <Card className="bg-black bg-opacity-40 border-0" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
        <Card.Body>
          <div className="d-flex align-items-center gap-2 mb-3">
            <BarChart3 size={20} className="text-white" />
            <h5 className="fw-bold text-white m-0">Dados de Mercado</h5>
          </div>

          {!currentAsset ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-0">Selecione um ativo na sidebar para ver dados de mercado</p>
            </div>
          ) : (
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <small className="text-muted">Preço Atual</small>
                  <div className="fw-bold text-white fs-4">{formatCurrency(currentAsset.current_price)}</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <small className="text-muted">Variação</small>
                  <div className={`fw-bold fs-5 ${(currentAsset.change_percent || 0) >= 0 ? "text-success" : "text-danger"}`}>
                    {(currentAsset.change_percent || 0) >= 0 ? <TrendingUp size={16} className="me-1" /> : <TrendingDown size={16} className="me-1" />}
                    {formatPercent(currentAsset.change_percent)}%
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <small className="text-muted">Valor Total</small>
                  <div className="fw-bold text-white fs-4">{formatCurrency(currentAsset.total_value)}</div>
                </div>
              </Col>
              <Col md={12}>
                <hr style={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
                <Row>
                  <Col md={3}>
                    <small className="text-muted">Máxima do Dia</small>
                    <div className="text-white-50">{formatCurrency(currentAsset.day_high)}</div>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">Mínima do Dia</small>
                    <div className="text-white-50">{formatCurrency(currentAsset.day_low)}</div>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">Volume</small>
                    <div className="text-white-50">{formatNumber(currentAsset.volume)}</div>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">Rentabilidade</small>
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