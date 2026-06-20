import {type AxiosRequestConfig, AxiosError} from 'axios';
import {api} from './api';

interface ApiErrorResponse {
    error: string; 
}

// Função genérica para fazer requisições à API
export async function request<T>(
    url: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
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
        
        // Se o servidor respondeu com um erro conhecido
        if (axiosError.response?.data?.error) {
            throw new Error(axiosError.response.data.error, { cause: error });
        }
        
        // Se foi um erro de rede ou inesperado
        throw new Error("Ocorreu um erro inesperado na comunicação com o servidor.", { cause: error });
    }
}