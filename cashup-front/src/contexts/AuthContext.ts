import { createContext } from "react";
import { type AuthContextData } from "../types/user";

// Cria o contexto tipado
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);