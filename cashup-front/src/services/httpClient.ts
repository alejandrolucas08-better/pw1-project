import { type AxiosRequestConfig, AxiosError, type Method } from 'axios';
import { api } from './api';

// Interface flexível para acomodar diferentes padrões de resposta de erro
interface ApiErrorResponse {
    error?: string;
    message?: string;
    errors?: string[]; 
}

// Função genérica para fazer requisições à API
export async function request<T>(
    url: string, 
    method: Method, 
    data?: unknown, 
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await api.request<T>({
            url,
            method,
            data,
            ...config,
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorData = axiosError.response?.data;
        
        let errorMessage = "Ocorreu um erro inesperado na comunicação com o servidor.";

        // 1. Tenta extrair mensagens de erro conhecidas do backend
        if (errorData) {
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            } else if (errorData.message) {
                errorMessage = errorData.message;
            } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                errorMessage = errorData.errors.join(', ');
            }
        } 
        // 2. Trata erros de infraestrutura (rede, timeout) onde não há resposta do servidor
        else if (axiosError.code === 'ERR_NETWORK') {
            errorMessage = "Erro de conexão. Verifique sua internet ou se o servidor está online.";
        } 
        else if (axiosError.code === 'ECONNABORTED') {
            errorMessage = "A requisição excedeu o tempo limite (timeout).";
        }

        // 3. Log em ambiente de desenvolvimento para facilitar o debug sem poluir o console em produção
        if (import.meta.env.DEV) {
            console.error(`[HTTP Client Error] ${method} ${url}:`, axiosError);
        }

        throw new Error(errorMessage, { cause: error });
    }
}