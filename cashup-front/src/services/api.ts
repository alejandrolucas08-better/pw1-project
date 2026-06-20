import axios from 'axios';

// Define a URL base da API, que pode ser configurada via variável de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Cria uma instância do Axios com a URL base da API
export const api =  axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepta as requisições para adicionar o token de autenticação
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('@AppInvest:token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);