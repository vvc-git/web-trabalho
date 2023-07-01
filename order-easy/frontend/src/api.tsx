import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://webtrabalho.victor.valle.vms.ufsc.br/:4000",
} as AxiosRequestConfig);

export default api;
