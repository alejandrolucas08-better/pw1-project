import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Cria o hook personalizado useAuth para acessar o contexto de autenticação de forma mais fácil em outros componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}