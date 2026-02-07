import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona acceso fácil al usuario y funciones de autenticación
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();

  /**
   * Función para cerrar sesión
   * Limpia el store y redirige al login
   */
  const logout = () => {
    logoutStore();
    navigate('/login');
  };

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = (role: string): boolean => {
    return user?.rol === role;
  };

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = (): boolean => {
    return user?.rol === 'administrador';
  };

  return {
    user,
    isAuthenticated,
    logout,
    hasRole,
    isAdmin,
  };
};

