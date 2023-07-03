import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL_BACKEND,
} as AxiosRequestConfig);

export default api;
