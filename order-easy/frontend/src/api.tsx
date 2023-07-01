import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://order-easy.netlify.app/:4000",
} as AxiosRequestConfig);

export default api;
