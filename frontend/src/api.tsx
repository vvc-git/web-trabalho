import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Cria uma instância do Axios com a configuração base da API
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL_BACKEND, // Define a URL base da API a partir de uma variável de ambiente
} as AxiosRequestConfig);

export default api; // Exporta a instância do Axios configurada como um módulo
