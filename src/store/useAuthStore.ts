import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaz para los datos del usuario
export interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_rol: number;
}

// Interfaz para el estado del store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  getUser: () => User | null;
}

// Crear el store con persistencia en localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // Función para establecer el usuario al hacer login
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Función para cerrar sesión
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('user'); // Limpiar localStorage por compatibilidad
      },

      // Función para obtener el usuario actual
      getUser: () => {
        return get().user;
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // Solo persistir user e isAuthenticated
    }
  )
);

