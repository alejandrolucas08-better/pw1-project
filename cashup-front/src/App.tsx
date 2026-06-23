import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthProvider";
import { PortfolioProvider } from "./contexts/PortfolioProvider";
import { useAuth } from "./hooks/useAuth";

// Componente interno que observa o usuário autenticado
function AppContent() {
  const { user } = useAuth();

  // A key força o PortfolioProvider a ser desmontado/remontado quando:
  // - O usuário faz logout (user vira null → key = "guest")
  // - O usuário troca de conta (user.id muda)
  return (
    <PortfolioProvider key={user?.id ?? "guest"}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}