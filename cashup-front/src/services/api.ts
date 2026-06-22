import axios from 'axios';

// Define a URL base da API, que pode ser configurada via variável de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria uma instância do Axios com a URL base da API
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Injeção de Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@AppInvest:token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Response: Tratamento de Sessão Expirada (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 1. Limpeza de credenciais locais
            localStorage.removeItem('@AppInvest:token');
            
            // 2. Redirecionamento para login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);