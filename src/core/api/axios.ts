import axios from "axios";

export const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (opcional - solo para logging en desarrollo)
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
