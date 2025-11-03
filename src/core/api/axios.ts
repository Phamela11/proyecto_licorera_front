import axios from "axios";

export const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - agregar información del usuario logueado
api.interceptors.request.use((config) => {
  // Obtener el usuario logueado desde localStorage
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Enviar el id_usuario en los headers para que el backend lo pueda usar
      if (user.data?.id_usuario) {
        config.headers['X-User-Id'] = user.data.id_usuario;
      } else if (user.id_usuario) {
        config.headers['X-User-Id'] = user.id_usuario;
      } else if (user.user_metadata?.id_usuario) {
        config.headers['X-User-Id'] = user.user_metadata.id_usuario;
      }
    }
  } catch (error) {
    console.error('Error al obtener usuario para headers:', error);
  }
  
  if (import.meta.env.DEV) {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
