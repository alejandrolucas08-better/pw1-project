import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePortfolio } from "../hooks/usePortfolio";
import { LogOut, Wallet, Plus, Trash2 } from "lucide-react";
import { AssetModal } from "./AssetModal";
import { request } from "../services/httpClient";
import { type Asset } from "../types/portfolio"; // Importar tipo Asset

export const SidebarLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { portfolio, loading, refreshPortfolio, selectAsset, selectedAsset } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  // Deleta ativo
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

  // Seleciona ativo para visualização
  const handleSelectAsset = (ticker: string) => {
    selectAsset(ticker);
  };

  // Formata valores em BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Container fluid className="p-0 bg-dark text-white vh-100 overflow-hidden" style={{ backgroundColor: "#0b0b0b" }}>
      <Row className="g-0 h-100">
        
        {/* Sidebar */}
        <Col 
          xs={3} 
          md={2} 
          className="d-flex flex-column bg-black border-end h-100 p-3 justify-content-between"
          style={{ minWidth: "260px", borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <div>
            {/* Logo */}
            <Link to="/dashboard" className="d-flex align-items-center gap-2 mb-4 text-decoration-none">
              <Wallet className="text-white" size={20} strokeWidth={2.5} />
              <h6 className="fw-bold m-0 tracking-tight text-white" style={{ letterSpacing: "-0.5px" }}>CashUP</h6>
            </Link>

            {/* Info do Usuário */}
            {user && (
              <div className="d-flex align-items-center gap-2 p-2 rounded mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-black fw-bold" 
                  style={{ width: "32px", height: "32px", backgroundColor: "#ffffff", fontSize: "13px" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden text-nowrap" style={{ textOverflow: "ellipsis" }}>
                  <div className="fw-medium text-white-50" style={{ fontSize: "13px" }}>{user.name}</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>{user.email}</div>
                </div>
              </div>
            )}

            {/* Capital Total */}
            <div className="p-3 rounded mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
              <div className="text-muted small text-uppercase tracking-wider" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                Capital Total
              </div>
              {loading ? (
                <Spinner animation="border" size="sm" variant="light" className="mt-1" />
              ) : (
                <div className="fw-bold text-white fs-5 mt-1">
                  {portfolio ? formatCurrency(portfolio.total_wallet_value) : "R$ 0,00"}
                </div>
              )}
            </div>

            <hr className="my-3" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

            {/* Título da Lista de Ativos */}
            <div className="d-flex justify-content-between align-items-center mb-2 px-2">
              <div className="text-muted small fw-semibold text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.6 }}>
                Meus Ativos
              </div>
              <Button
                variant="link"
                size="sm"
                className="p-0 text-white-50 hover-white"
                onClick={() => setShowModal(true)}
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
                <div className="text-center py-3 text-muted small">
                  Nenhum ativo cadastrado
                </div>
              ) : (
                portfolio.assets.map((asset: Asset) => ( // Tipagem explícita
                  <div
                    key={asset.ticker}
                    className={`d-flex align-items-center justify-content-between p-2 rounded transition-all ${
                      selectedAsset === asset.ticker ? "bg-white bg-opacity-10" : "hover-sidebar-item"
                    }`}
                    style={{ cursor: "pointer", fontSize: "13px" }}
                    onMouseEnter={() => setHoveredAsset(asset.ticker)}
                    onMouseLeave={() => setHoveredAsset(null)}
                    onClick={() => handleSelectAsset(asset.ticker)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {asset.logo_url ? (
                        <img 
                          src={asset.logo_url} 
                          alt={asset.ticker} 
                          className="rounded-circle bg-white"
                          style={{ width: "24px", height: "24px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-muted font-monospace fw-bold" style={{ width: "24px", height: "24px", fontSize: "10px" }}>
                          {asset.ticker.substring(0, 2)}
                        </div>
                      )}
                      <span className="text-white font-monospace fw-medium">{asset.ticker}</span>
                    </div>
                    
                    {hoveredAsset === asset.ticker && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-danger hover-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(asset.ticker);
                        }}
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
          <div className="pt-2 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Button 
              variant="outline-light" 
              className="w-100 d-flex align-items-center justify-content-center gap-2 fw-medium border-0 text-muted btn-logout-minimal"
              style={{ fontSize: "13px" }}
              onClick={signOut}
            >
              <LogOut size={14} />
              Sair da conta
            </Button>
          </div>
        </Col>

        {/* Painel Principal */}
        <Col className="h-100 overflow-y-auto p-4" style={{ backgroundColor: "#121212" }}>
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