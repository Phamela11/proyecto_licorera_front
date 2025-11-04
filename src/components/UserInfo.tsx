import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Componente que muestra la información del usuario logueado
 * y un botón para cerrar sesión
 */
export const UserInfo = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {/* Avatar y nombre del usuario */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">{user.nombre}</span>
          <span className="text-xs text-gray-500 capitalize">{user.rol}</span>
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>
    </div>
  );
};

