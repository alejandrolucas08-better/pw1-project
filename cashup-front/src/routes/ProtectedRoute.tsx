import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "react-bootstrap";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto valida o token via cookie/localStorage, exibe um loading minimalista
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

  // Se não estiver logado, redireciona o usuário de volta para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};