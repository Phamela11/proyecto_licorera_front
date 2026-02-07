# 🎯 Zustand - Sistema de Autenticación

## ✅ Instalación Completada

Zustand ha sido instalado y configurado correctamente en tu aplicación.

## 📁 Archivos Creados

```
licorera/
├── src/
│   ├── store/
│   │   ├── useAuthStore.ts       # Store principal de Zustand
│   │   ├── index.ts              # Exportaciones centralizadas
│   │   └── README.md             # Documentación detallada
│   ├── hooks/
│   │   └── useAuth.ts            # Hook personalizado para autenticación
│   └── components/
│       └── UserInfo.tsx          # Componente de ejemplo
└── pages/
    └── Login/
        └── useLogin.ts           # ✅ Actualizado para usar Zustand
```

## 🚀 Características Implementadas

### 1. Store de Autenticación (`useAuthStore`)
- ✅ Persistencia automática en localStorage
- ✅ Tipado completo con TypeScript
- ✅ Funciones para login y logout
- ✅ Estado global accesible desde cualquier componente

### 2. Hook Personalizado (`useAuth`)
- ✅ Funciones de utilidad: `logout`, `hasRole`, `isAdmin`
- ✅ Acceso simplificado al usuario y estado de autenticación
- ✅ Navegación automática al cerrar sesión

### 3. Componente de Usuario (`UserInfo`)
- ✅ Muestra información del usuario logueado
- ✅ Avatar con icono
- ✅ Botón de cerrar sesión integrado
- ✅ Diseño responsive

## 📊 Estructura de Datos del Usuario

```typescript
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "id_usuario": 2,
    "nombre": "Admin Principal",
    "correo": "admin@sistema.com",
    "rol": "administrador",
    "id_rol": 1
  }
}
```

## 💡 Uso Rápido

### Opción 1: Hook Personalizado (Recomendado)

```typescript
import { useAuth } from '@/hooks/useAuth';

function MiComponente() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Bienvenido {user?.nombre}</p>}
      {isAdmin() && <p>Panel de Admin</p>}
      <button onClick={logout}>Salir</button>
    </div>
  );
}
```

### Opción 2: Store Directo

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function MiComponente() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return <p>Hola {user?.nombre}</p>;
}
```

### Opción 3: Componente UserInfo

```typescript
import { UserInfo } from '@/components/UserInfo';

function Header() {
  return (
    <header>
      <h1>Mi App</h1>
      <UserInfo /> {/* Muestra usuario y botón de logout */}
    </header>
  );
}
```

## 🔧 Integración en tu Aplicación

### 1. Agregar UserInfo al Header/Navbar

```typescript
import { UserInfo } from '@/components/UserInfo';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <div>Logo</div>
      <UserInfo />
    </nav>
  );
}
```

### 2. Proteger Rutas

```typescript
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

### 3. Mostrar contenido según rol

```typescript
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      <h1>Dashboard de {user?.nombre}</h1>
      
      {isAdmin() && (
        <div>
          <h2>Panel de Administrador</h2>
          {/* Contenido solo para admin */}
        </div>
      )}
    </div>
  );
}
```

## 🎨 Personalización

### Cambiar el nombre de la clave en localStorage

En `useAuthStore.ts`, cambia el `name` en persist:

```typescript
persist(
  // ...
  {
    name: 'mi-app-auth', // Cambia aquí
  }
)
```

### Agregar más propiedades al usuario

En `useAuthStore.ts`, actualiza la interfaz `User`:

```typescript
export interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_rol: number;
  // Agregar nuevos campos aquí
  avatar?: string;
  telefono?: string;
}
```

## 📖 Documentación Completa

Para ver ejemplos más detallados y casos de uso avanzados, consulta:
- `src/store/README.md` - Documentación completa del store

## ⚡ Ventajas de Zustand

1. **Simple**: No necesitas providers ni context
2. **Rápido**: Solo re-renderiza los componentes que usan los datos que cambiaron
3. **TypeScript**: Completamente tipado
4. **Pequeño**: Solo 1.3KB minified + gzipped
5. **Persistente**: Guarda automáticamente en localStorage
6. **DevTools**: Compatible con Redux DevTools

## 🔍 Debugging

Para ver el estado actual del store en la consola:

```javascript
console.log(useAuthStore.getState());
```

Para ver el estado persistido en localStorage:

```javascript
console.log(localStorage.getItem('auth-storage'));
```

## 📞 Soporte

Si necesitas ayuda o tienes dudas sobre el uso de Zustand, consulta:
- [Documentación oficial de Zustand](https://docs.pmnd.rs/zustand)
- El archivo `src/store/README.md` en este proyecto

---

✨ **¡Todo listo!** Tu sistema de autenticación con Zustand está completamente configurado y listo para usar.

