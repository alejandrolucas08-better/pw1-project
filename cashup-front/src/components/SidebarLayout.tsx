import React, { type PropsWithChildren } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Wallet } from "lucide-react";

export const SidebarLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, signOut } = useAuth();
  
  // Obtém a rota atual internamente
  const { pathname } = useLocation();

  const assetShortcuts = ["PETR4", "MXRF11", "BTC"];

  return (
    <Container fluid className="p-0 text-white vh-100 overflow-hidden" style={{ backgroundColor: "#121212" }}>
      <Row className="g-0 h-100">
        
        {/* Sidebar */}
        <Col 
          xs={3} 
          md={2} 
          className="d-flex flex-column h-100 p-3 justify-content-between"
          style={{ 
            minWidth: "260px", 
            backgroundColor: "#161616", // Alterado de bg-black para um cinza escuro estrutural
            borderColor: "rgba(255, 255, 255, 0.06)",
            borderRight: "1px solid" 
          }}
        >
          {/* Bloco Superior: Informações do Usuário e Perfil */}
          <div>
            <Link 
              to="/dashboard"
              className="d-flex align-items-center gap-2 mb-4 text-decoration-none"
            >
              <Wallet className="text-white" size={20} strokeWidth={2.5} />
              <h6 className="fw-bold m-0 tracking-tight text-white" style={{ letterSpacing: "-0.5px" }}>CashUP</h6>
            </Link>

            {/* Info do Usuário Autenticado */}
            {user && (
              <div className="d-flex align-items-center gap-2 p-2 rounded mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-black fw-bold" 
                  style={{ width: "32px", height: "32px", backgroundColor: "#ffffff", fontSize: "13px" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden text-nowrap" style={{ textOverflow: "ellipsis" }}>
                  <div className="fw-medium text-white" style={{ fontSize: "13px" }}>{user.name}</div>
                  {/* Melhorado contraste de text-muted para text-white-50 */}
                  <div className="text-white-50" style={{ fontSize: "11px", opacity: 0.8 }}>{user.email}</div>
                </div>
              </div>
            )}

            <hr className="my-3" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

            {/* Título da Listagem de Ativos */}
            {/* Melhorado contraste trocando text-muted por text-white-50 */}
            <div className="text-white-50 small fw-semibold px-2 mb-2 text-uppercase" style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.6 }}>
              Ativos Recentes
            </div>

            {/* Listagem de Ativos */}
            <Nav className="flex-column gap-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: "55vh" }}>
              {assetShortcuts.map((ticker) => {
                const isActive = pathname === `/dashboard/asset/${ticker}`;
                return (
                  <Link
                    key={ticker}
                    to="/dashboard"
                    className={`text-decoration-none p-2 rounded d-flex align-items-center gap-2 transition-all hover-sidebar-item ${
                      isActive ? "bg-white bg-opacity-5 text-white fw-medium" : "text-white-50"
                    }`}
                    style={{ fontSize: "13px" }}
                  >
                    <span className="font-monospace text-white-50" style={{ opacity: 0.3 }}>/</span>
                    {ticker}
                  </Link>
                );
              })}
            </Nav>
          </div>

          {/* Bloco Inferior: Botão de Sair (Logout) */}
          <div className="pt-2 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Button 
              variant="outline-light" 
              className="w-100 d-flex align-items-center justify-content-center gap-2 fw-medium border-0 text-white-50 btn-logout-minimal"
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
          {/* Renderiza 'children' se passado diretamente, ou <Outlet /> para rotas aninhadas */}
          {children || <Outlet />}
        </Col>

      </Row>
    </Container>
  );
};