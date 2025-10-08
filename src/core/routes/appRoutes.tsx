import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PrivateLayout from '@/layouts/PrivateLayout';
import Dashboard from '@/pages/dashboard/dashboard';

// Lazy loading para optimizar el rendimiento
//auth views
const Login = lazy(() => import('@/pages/Login/Login'));
//backoffice views
const Users = lazy(() => import('@/pages/users/users'));
const Clientes = lazy(() => import('@/pages/clientes/clientes'));
//backoffice views
const Products = lazy(() => import('@/pages/products/products'));
const LicorTypes = lazy(() => import('@/pages/licorTypes/licorTypes'));


export const appRoutes: RouteObject[] = [
  // Rutas de autenticación
  {
    path: '/',
    element: <Login />,
  },
  
  // Rutas privadas (requieren autenticación)
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'usuarios',
        element: <Users />
      },
      {
        path: 'clientes',
        element: <Clientes />
      },
      {
        path: 'productos',
        element: <Products />
      },
      {
        path: 'tipos-de-licor',
        element: <LicorTypes />
      },
    ]
  },
  
  // Redirección por defecto
  {
    path: '*',
    element: <div>Página no encontrada</div>
  }
];