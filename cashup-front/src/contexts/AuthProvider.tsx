// src/contexts/AuthProvider.tsx

import React, { useState, useEffect } from "react";
import { request } from "../services/httpClient";
import { type User, type LoginResponse, type MeResponse } from "../types/user";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Recupera sessão existente ao montar a aplicação
    useEffect(() => {
        const loadStorageData = async () => {
            const token = localStorage.getItem("@AppInvest:token");

            if (token) {
                try {
                    const data = await request<MeResponse>("/auth/me", "GET");
                    setUser(data.user);
                } catch (error) {
                    // Token inválido/expirado: limpa e segue como não autenticado
                    localStorage.removeItem("@AppInvest:token");
                    setUser(null);
                    
                }
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    // Autentica, persiste token e carrega perfil do usuário
    const signIn = async (credentials: object) => {
        // 1. Realiza login e obtém token
        const loginData = await request<LoginResponse>('/auth/login', 'POST', credentials);
        localStorage.setItem('@AppInvest:token', loginData.token);

        try {
            // 2. Busca dados do usuário autenticado
            const profile = await request<MeResponse>("/auth/me", "GET");
            setUser(profile.user);
        } catch (error) {
            // Rollback: se /auth/me falhar, remove token para evitar estado inconsistente
            localStorage.removeItem('@AppInvest:token');
            throw error;
        }
    };

    // Encerra sessão limpando token e estado
    const signOut = () => {
        localStorage.removeItem('@AppInvest:token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};