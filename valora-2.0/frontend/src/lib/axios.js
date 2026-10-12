import axios from 'axios';
import { PROTECTED_ROUTES } from '@/lib/routes';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * ==================================================
 * Cliente HTTP centralizado (Axios)
 * ==================================================
 **/

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/+$/, '')}/api`,
  withCredentials: true, // Envía cookies HttpOnly automáticamente
  //  COMUNICACIÓN ENTRE PUERTOS EN DESARROLLO
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/
/**
 * Interceptor de respuesta: manejo global de errores HTTP.
 * Si la API responde 401 (no autenticado), redirigir al login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (error.response?.status === 401 && isProtectedRoute) {
      const loginUrl = new URL('/login', window.location.origin);
      loginUrl.searchParams.set('redirect', pathname);
      window.location.replace(loginUrl.toString());
    }
    return Promise.reject(error);
  }
);

export default api;