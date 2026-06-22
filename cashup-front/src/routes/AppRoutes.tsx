import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarLayout } from "../components/SidebarLayout";
import { useAuth } from "../hooks/useAuth";

// Páginas
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";

export default function AppRoutes() {
  // Obtém estado de autenticação para redirecionamento inteligente no fallback
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas de autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas privadas aninhadas: ProtectedRoute valida sessão, SidebarLayout renderiza o layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Novas rotas privadas são adicionadas aqui sem repetir wrappers */}
        </Route>
      </Route>

      {/* Fallback 404: redireciona baseado no estado de autenticação */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}