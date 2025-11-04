# Zustand Auth Store - Documentación de Uso

Este store de Zustand maneja el estado de autenticación del usuario en toda la aplicación.

## 📦 Estructura de Datos del Usuario

```typescript
{
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_rol: number;
}
```

## 🚀 Uso Básico

### 1. Obtener información del usuario en cualquier componente

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function MiComponente() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      {isAuthenticated && (
        <p>Bienvenido, {user?.nombre}</p>
      )}
    </div>
  );
}
```

### 2. Usar el hook personalizado useAuth (Recomendado)

```typescript
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <p>Usuario: {user?.nombre}</p>
          <p>Rol: {user?.rol}</p>
          {isAdmin() && <p>Eres administrador</p>}
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      )}
    </div>
  );
}
```

### 3. Acceder a propiedades específicas del usuario

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function UserProfile() {
  // Solo se re-renderiza cuando cambia el nombre
  const userName = useAuthStore((state) => state.user?.nombre);
  
  // Solo se re-renderiza cuando cambia el rol
  const userRole = useAuthStore((state) => state.user?.rol);

  return (
    <div>
      <h2>{userName}</h2>
      <p>Rol: {userRole}</p>
    </div>
  );
}
```

### 4. Cerrar sesión

```typescript
import { useAuth } from '@/hooks/useAuth';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Cerrar Sesión
    </button>
  );
}
```

### 5. Proteger rutas basadas en rol

```typescript
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
```

### 6. Obtener el usuario fuera de un componente React

```typescript
import { useAuthStore } from '@/store/useAuthStore';

// En un servicio o función utilitaria
function getUserData() {
  const user = useAuthStore.getState().getUser();
  return user;
}
```

## 🔐 Funciones del Store

### `setUser(user: User)`
Establece el usuario en el store después del login.

### `logout()`
Cierra la sesión, limpia el store y el localStorage.

### `getUser()`
Obtiene el usuario actual del store.

## 💾 Persistencia

El store utiliza el middleware `persist` de Zustand, lo que significa que:
- Los datos se guardan automáticamente en `localStorage`
- Se restauran automáticamente al recargar la página
- La clave en localStorage es `auth-storage`

## 🎯 Ventajas de usar Zustand

1. **Simple**: No requiere providers ni context
2. **Rápido**: Re-renderiza solo los componentes que usan los datos que cambiaron
3. **TypeScript**: Totalmente tipado
4. **Persistente**: Los datos sobreviven a las recargas de página
5. **DevTools**: Compatible con Redux DevTools para debugging

## 📝 Ejemplo Completo

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

function UserDashboard() {
  // Opción 1: Usar el hook personalizado
  const { user, logout, isAdmin } = useAuth();

  // Opción 2: Acceder directamente al store
  const userName = useAuthStore((state) => state.user?.nombre);

  return (
    <div className="dashboard">
      <h1>Dashboard de {userName}</h1>
      
      {user && (
        <div className="user-info">
          <p>Email: {user.correo}</p>
          <p>Rol: {user.rol}</p>
          <p>ID: {user.id_usuario}</p>
        </div>
      )}

      {isAdmin() && (
        <div className="admin-panel">
          <h2>Panel de Administrador</h2>
          {/* Contenido solo para admin */}
        </div>
      )}

      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

