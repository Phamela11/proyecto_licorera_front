import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateLayout from '@/layouts/PrivateLayout';
import Dashboard from '@/pages/backoffice/dashboard/dashboard';

// Lazy loading para optimizar el rendimiento
//auth views
const Register = lazy(() => import('@/pages/auth/view/register'));
const Login = lazy(() => import('@/pages/auth/view/Login'));
//backoffice views
const Users = lazy(() => import('@/pages/backoffice/users/users'));
//backoffice views
const Productos = lazy(() => import('@/pages/Productos'));
const Categorias = lazy(() => import('@/pages/Categorias'));

export const appRoutes: RouteObject[] = [
  // Rutas de autenticación
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  },
  
  // Rutas privadas (requieren autenticación)
  {
    path: '/',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        index: true,
        path: 'usuarios',
        element: <Users />
      },
      {
        path: 'productos',
        element: <Productos />
      },
      {
        path: 'categorias/:categoria',
        element: <Categorias />
      }
    ]
  },
  
  // Redirección por defecto
  {
    path: '*',
    element: <div>Página no encontrada</div>
  }
];