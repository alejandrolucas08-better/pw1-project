import React, { useState, useEffect} from "react";
import { request } from "../services/httpClient";
import { type User, type LoginResponse, type MeResponse} from "../types/User";
import { AuthContext } from "./AuthContext";

// O AuthProvider é o componente que vai envolver toda a aplicação e fornecer o contexto de autenticação para os outros componentes
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Ao montar o componente, verificamos se já existe um token no localStorage e tentamos carregar os dados do usuário
    useEffect(() => {
        async function loadStorageData() {
        const token = localStorage.getItem("@AppInvest:token");

        if (token) {
            try {
                const data = await request<MeResponse>("/auth/me", "GET");
                setUser(data.user);
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                localStorage.removeItem("@AppInvest:token");
                setUser(null);
            }
        }
        setLoading(false);   
    }
    loadStorageData();
    }, []);

    // Função para efetuar o login, que recebe as credenciais do formulário, faz a requisição para o backend e armazena o token e os dados do usuário
    const signIn = async (credentials: object) => {
        const data = await request<LoginResponse>('/auth/login', 'POST', credentials);

        localStorage.setItem('@AppInvest:token', data.token)

        const profile = await request<MeResponse>("/auth/me", "GET");
        setUser(profile.user);
    }

    // Função para efetuar o logout, que remove o token do localStorage e limpa os dados do usuário do estado
    const signOut = () => {
        localStorage.removeItem('@AppInvest:token');
        setUser(null);
    }

    return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
