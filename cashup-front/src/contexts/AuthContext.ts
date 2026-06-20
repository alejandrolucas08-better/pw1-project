import { createContext } from "react";
import { type AuthContextData } from "../types/User";

// Cria o contexto tipado
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);