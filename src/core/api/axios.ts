import axios from "axios";
import { toast } from "sonner";

// Detectar si estamos en ngrok y construir la URL del backend
const getApiUrl = () => {
  // Detectar si estamos accediendo desde ngrok (HTTPS)
  const isNgrok = typeof window !== 'undefined' && (
    window.location.hostname.includes('ngrok-free.app') || 
    window.location.hostname.includes('ngrok.io') || 
    window.location.hostname.includes('ngrok-app.com') ||
    window.location.protocol === 'https:'
  );
  
  // Si hay una variable de entorno configurada
  if (import.meta.env.VITE_API_URL) {
    const envUrl = import.meta.env.VITE_API_URL;
    
    // Si estamos en ngrok pero la URL del .env es HTTP, mostrar advertencia
    if (isNgrok && envUrl.startsWith('http://')) {
      console.error('❌ ERROR: Estás accediendo desde ngrok (HTTPS) pero VITE_API_URL está configurada con HTTP.');
      console.error('❌ Los navegadores bloquean peticiones HTTP desde sitios HTTPS por seguridad.');
      console.error('❌ SOLUCIÓN:');
      console.error('   1. Abre una nueva terminal y ejecuta: ngrok http 3000');
      console.error('   2. Copia la URL HTTPS que ngrok te da (ejemplo: https://abc123.ngrok-free.app)');
      console.error('   3. Edita el archivo licorera/.env y cambia:');
      console.error('      VITE_API_URL=https://TU-BACKEND-NGROK-URL.ngrok-free.app/api');
      console.error('   4. Reinicia el servidor del frontend (npm run dev)');
      console.error('');
      console.error('⚠️ La petición será bloqueada por el navegador (mixed content)');
    }
    
    return envUrl;
  }
  
  // Si estamos en ngrok pero no hay VITE_API_URL configurada
  if (isNgrok) {
    console.error('❌ ERROR: Estás accediendo desde ngrok (HTTPS) pero VITE_API_URL no está configurada.');
    console.error('❌ Los navegadores bloquean peticiones HTTP desde sitios HTTPS por seguridad.');
    console.error('❌ SOLUCIÓN:');
    console.error('   1. Abre una nueva terminal y ejecuta: ngrok http 3000');
    console.error('   2. Copia la URL HTTPS que ngrok te da (ejemplo: https://abc123.ngrok-free.app)');
    console.error('   3. Edita el archivo licorera/.env y cambia:');
    console.error('      VITE_API_URL=https://TU-BACKEND-NGROK-URL.ngrok-free.app/api');
    console.error('   4. Reinicia el servidor del frontend (npm run dev)');
    console.error('');
    console.error('⚠️ Intentando usar localhost (será bloqueado por el navegador)');
    return 'http://localhost:3000/api';
  }
  
  // Por defecto, usar localhost
  return 'http://localhost:3000/api';
};

export const URL = getApiUrl();

// Log en desarrollo para verificar la URL del API
if (import.meta.env.DEV) {
  console.log('🔗 API URL configurada:', URL);
  console.log('🔗 Hostname actual:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
  console.log('🔗 Protocolo actual:', typeof window !== 'undefined' ? window.location.protocol : 'N/A');
}

export const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
});

// Agregar header de ngrok si es necesario (para evitar el banner de advertencia)
if (typeof window !== 'undefined' && URL.includes('ngrok')) {
  api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
}

// Interceptor para requests - agregar información del usuario logueado
api.interceptors.request.use((config) => {
  // Agregar header de ngrok si la URL base contiene ngrok
  if (config.baseURL && config.baseURL.includes('ngrok')) {
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  
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
  
  // Agregar metadata para controlar si mostrar toast
  config.metadata = {
    showToast: true, // Por defecto mostrar toast
    ...config.metadata
  };
  
  if (import.meta.env.DEV) {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔗 Base URL: ${config.baseURL}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para responses - mostrar toasts automáticamente
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    const showToast = response.config.metadata?.showToast !== false;
    
    // Solo mostrar toasts de éxito para métodos que modifican datos (POST, PUT, DELETE, PATCH)
    // No mostrar para GET (consultas)
    if (showToast && method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const message = response.data?.message || getSuccessMessage(method, response.config.url || '');
      if (message) {
        toast.success(message);
      }
    }
    
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase();
    const showToast = error.config?.metadata?.showToast !== false;
    
    // Log detallado del error en desarrollo
    if (import.meta.env.DEV) {
      console.error('❌ Error en petición:', {
        url: error.config?.url,
        method: method,
        baseURL: error.config?.baseURL,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      
      // Si es un error de CORS o red
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('❌ Error de red - Verifica que:');
        console.error('   1. El backend esté corriendo');
        console.error('   2. La URL del API sea correcta:', error.config?.baseURL);
        console.error('   3. Si usas ngrok, el túnel del backend esté activo');
      }
      
      // Si es un error de CORS
      if (error.response?.status === 0 || error.message.includes('CORS')) {
        console.error('❌ Error de CORS - Verifica la configuración del backend');
      }
    }
    
    // Mostrar toasts de error para todas las peticiones (GET, POST, PUT, DELETE, etc.)
    if (showToast) {
      let errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        getErrorMessage(method || 'GET', error.response?.status);
      
      // Mensajes más específicos para errores comunes
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Error de conexión. Verifica que el backend esté corriendo y accesible.';
      } else if (error.response?.status === 0) {
        errorMessage = 'Error de CORS o conexión bloqueada. Verifica la configuración del servidor.';
      }
      
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Función para obtener mensajes de éxito según el método HTTP
function getSuccessMessage(method: string, url: string): string {
  const urlLower = url?.toLowerCase() || '';
  
  if (method === 'POST') {
    if (urlLower.includes('login') || urlLower.includes('auth')) return 'Operación completada exitosamente';
    if (urlLower.includes('producto')) return 'Producto creado exitosamente';
    if (urlLower.includes('cliente')) return 'Cliente creado exitosamente';
    if (urlLower.includes('proveedor')) return 'Proveedor creado exitosamente';
    if (urlLower.includes('usuario')) return 'Usuario creado exitosamente';
    if (urlLower.includes('venta')) return 'Venta creada exitosamente';
    if (urlLower.includes('movimiento')) return 'Movimiento registrado exitosamente';
    if (urlLower.includes('nomina')) return 'Nómina creada exitosamente';
    if (urlLower.includes('costo')) return 'Costo operativo creado exitosamente';
    return 'Registro creado exitosamente';
  }
  
  if (method === 'PUT' || method === 'PATCH') {
    if (urlLower.includes('producto')) return 'Producto actualizado exitosamente';
    if (urlLower.includes('cliente')) return 'Cliente actualizado exitosamente';
    if (urlLower.includes('proveedor')) return 'Proveedor actualizado exitosamente';
    if (urlLower.includes('usuario')) return 'Usuario actualizado exitosamente';
    if (urlLower.includes('venta')) return 'Venta actualizada exitosamente';
    if (urlLower.includes('nomina')) return 'Nómina actualizada exitosamente';
    if (urlLower.includes('costo')) return 'Costo operativo actualizado exitosamente';
    return 'Registro actualizado exitosamente';
  }
  
  if (method === 'DELETE') {
    if (urlLower.includes('producto')) return 'Producto eliminado exitosamente';
    if (urlLower.includes('cliente')) return 'Cliente eliminado exitosamente';
    if (urlLower.includes('proveedor')) return 'Proveedor eliminado exitosamente';
    if (urlLower.includes('usuario')) return 'Usuario eliminado exitosamente';
    if (urlLower.includes('venta')) return 'Venta eliminada exitosamente';
    if (urlLower.includes('movimiento')) return 'Movimiento eliminado exitosamente';
    if (urlLower.includes('nomina')) return 'Nómina eliminada exitosamente';
    if (urlLower.includes('costo')) return 'Costo operativo eliminado exitosamente';
    return 'Registro eliminado exitosamente';
  }
  
  return 'Operación completada exitosamente';
}

// Función para obtener mensajes de error según el código de estado
function getErrorMessage(method: string, status?: number): string {
  if (status === 401) return 'No autorizado. Por favor inicia sesión nuevamente';
  if (status === 403) return 'No tienes permisos para realizar esta acción';
  if (status === 404) return 'Recurso no encontrado';
  if (status === 409) return 'Conflicto: El recurso ya existe';
  if (status === 422) return 'Error de validación. Verifica los datos ingresados';
  if (status === 500) return 'Error interno del servidor. Intenta nuevamente más tarde';
  if (status === 503) return 'Servicio no disponible. Intenta nuevamente más tarde';
  
  if (method === 'GET') return 'Error al obtener los datos';
  if (method === 'POST') return 'Error al crear el registro';
  if (method === 'PUT' || method === 'PATCH') return 'Error al actualizar el registro';
  if (method === 'DELETE') return 'Error al eliminar el registro';
  
  return 'Error en la operación';
}

// Extender el tipo de AxiosRequestConfig para incluir metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      showToast?: boolean;
    };
  }
}
