import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import PrivateLayout from '@/layouts/PrivateLayout';

// Lazy loading para optimizar el rendimiento
//auth views
const Register = lazy(() => import('@/pages/auth/view/register'));
const Login = lazy(() => import('@/pages/auth/view/Login'));
//backoffice views
const Home = lazy(() => import('@/pages/backoffice/Home'));
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
        element: <Home />
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