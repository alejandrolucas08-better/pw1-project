import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarLayout } from "../components/SidebarLayout";

// Importações das páginas
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";

// Componente envelopador para páginas internas do painel
function PrivateRouteWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <ProtectedRoute>
      <SidebarLayout currentPage={location.pathname}>
        {children}
      </SidebarLayout>
    </ProtectedRoute>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. ROTAS DE AUTENTICAÇÃO (PÚBLICAS) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. ROTAS PRIVADAS (ENVOLVIDAS PELO LAYOUT DE IA) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRouteWrapper>
            <Dashboard />
          </PrivateRouteWrapper>
        }
      />

      {/* 3. ROTA DE FALLBACK / REDIRECIONAMENTO PADRÃO */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}