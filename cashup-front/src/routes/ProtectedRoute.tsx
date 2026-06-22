// src/routes/ProtectedRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "react-bootstrap";

// Rota protegida que verifica autenticação antes de renderizar as rotas filhas
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Exibe loading apenas durante a hidratação inicial da sessão
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-black vh-100">
        <div className="text-center text-white">
          <Spinner animation="border" variant="light" size="sm" className="mb-2" />
          <p className="text-muted small">Validando credenciais...</p>
        </div>
      </div>
    );
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza as rotas filhas (SidebarLayout -> Dashboard)
  return <Outlet />;
};