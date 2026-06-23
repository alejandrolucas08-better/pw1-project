import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePortfolio } from "../hooks/usePortfolio";
import { LogOut, Wallet, Plus, Trash2 } from "lucide-react";
import { AssetModal } from "./AssetModal";
import { request } from "../services/httpClient";
import { type Asset } from "../types/portfolio";

export const SidebarLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { portfolio, loading, refreshPortfolio, selectAsset, selectedAsset } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const handleDelete = async (ticker: string) => {
    if (!window.confirm(`Remover ${ticker} da carteira?`)) return;

    try {
      await request(`/assets/${ticker}`, "DELETE");
      await refreshPortfolio();
      if (selectedAsset === ticker) selectAsset(null);
    } catch (err) {
      console.error("Erro ao deletar ativo:", err);
    }
  };

  const handleSelectAsset = (ticker: string) => {
    selectAsset(ticker);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Container fluid className="p-0 text-white vh-100 overflow-hidden" style={{ backgroundColor: "#0f0f0f" }}>
      <Row className="g-0 h-100">
        
        {/* Sidebar */}
        <Col 
          xs={3} 
          md={2} 
          className="d-flex flex-column border-end h-100 p-3 justify-content-between"
          style={{ minWidth: "260px", backgroundColor: "#161616", borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <div>
            {/* Logo */}
            <Link to="/dashboard" className="d-flex align-items-center gap-2 mb-4 text-decoration-none">
              <Wallet className="text-white" size={20} strokeWidth={2.5} />
              <h6 className="fw-bold m-0 tracking-tight text-white" style={{ letterSpacing: "-0.5px" }}>CashUP</h6>
            </Link>

            {/* Info do Usuário */}
            {user && (
              <div className="d-flex align-items-center gap-2 p-2 rounded mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-black fw-bold" 
                  style={{ width: "32px", height: "32px", backgroundColor: "#ffffff", fontSize: "13px" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden text-nowrap" style={{ textOverflow: "ellipsis" }}>
                  <div className="fw-medium" style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.9)" }}>{user.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)" }}>{user.email}</div>
                </div>
              </div>
            )}

            {/* Capital Total */}
            <div className="p-3 rounded mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.5)" }} className="text-uppercase tracking-wider">
                Capital Total
              </div>
              {loading ? (
                <Spinner animation="border" size="sm" variant="light" className="mt-1" />
              ) : (
                <div className="fw-bold fs-5 mt-1 text-white">
                  {portfolio ? formatCurrency(portfolio.total_wallet_value) : "R$ 0,00"}
                </div>
              )}
            </div>

            <hr className="my-3" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            {/* Título da Lista de Ativos */}
            <div className="d-flex justify-content-between align-items-center mb-2 px-2">
              <div style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.5)" }} className="fw-semibold text-uppercase">
                Meus Ativos
              </div>
              <Button
                variant="link"
                size="sm"
                className="p-0 d-flex align-items-center justify-content-center"
                style={{ color: "rgba(255, 255, 255, 0.7)", width: "24px", height: "24px" }}
                onClick={() => setShowModal(true)}
                title="Adicionar ativo"
              >
                <Plus size={16} strokeWidth={2.5} />
              </Button>
            </div>

            {/* Lista de Ativos */}
            <div className="flex-column gap-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: "50vh" }}>
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" variant="light" />
                </div>
              ) : !portfolio || portfolio.assets.length === 0 ? (
                <div className="text-center py-3 small" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  Nenhum ativo cadastrado
                </div>
              ) : (
                portfolio.assets.map((asset: Asset) => (
                  <div
                    key={asset.ticker}
                    className={`d-flex align-items-center justify-content-between p-2 rounded transition-all ${
                      selectedAsset === asset.ticker ? "" : ""
                    }`}
                    style={{ 
                      cursor: "pointer", 
                      fontSize: "13px",
                      backgroundColor: selectedAsset === asset.ticker ? "rgba(255, 255, 255, 0.08)" : "transparent",
                      border: selectedAsset === asset.ticker ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      setHoveredAsset(asset.ticker);
                      if (selectedAsset !== asset.ticker) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      setHoveredAsset(null);
                      if (selectedAsset !== asset.ticker) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onClick={() => handleSelectAsset(asset.ticker)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {asset.logo_url ? (
                        <img 
                          src={asset.logo_url} 
                          alt={asset.ticker} 
                          className="rounded-circle"
                          style={{ width: "24px", height: "24px", objectFit: "cover", backgroundColor: "#ffffff" }}
                        />
                      ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "24px", height: "24px", fontSize: "10px", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "rgba(255, 255, 255, 0.7)" }}>
                          {asset.ticker.substring(0, 2)}
                        </div>
                      )}
                      <span className="font-monospace fw-medium text-white">{asset.ticker}</span>
                    </div>
                    
                    {hoveredAsset === asset.ticker && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 d-flex align-items-center justify-content-center"
                        style={{ color: "#ff6b6b", width: "24px", height: "24px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(asset.ticker);
                        }}
                        title="Remover ativo"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Botão de Sair */}
          <div className="pt-2 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <Button 
              variant="outline-light" 
              className="w-100 d-flex align-items-center justify-content-center gap-2 fw-medium border-0 rounded-2"
              style={{ fontSize: "13px", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "rgba(255, 255, 255, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              onClick={signOut}
            >
              <LogOut size={14} />
              Sair da conta
            </Button>
          </div>
        </Col>

        {/* Painel Principal */}
        <Col className="h-100 overflow-y-auto p-4" style={{ backgroundColor: "#0f0f0f" }}>
          <Outlet />
        </Col>

      </Row>

      {/* Modal de Adição de Ativo */}
      <AssetModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSuccess={refreshPortfolio}
      />
    </Container>
  );
};