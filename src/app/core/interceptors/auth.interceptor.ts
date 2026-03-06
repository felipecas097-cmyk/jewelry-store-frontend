/**
 * ============================================================
 * AUTH INTERCEPTOR — Manejo de token y auto-logout
 * ============================================================
 *
 * ¿QUÉ HACE?
 * 1. Agrega el token JWT a peticiones que LO NECESITAN (rutas protegidas).
 * 2. NO envía token en rutas públicas (products, categories, collections).
 * 3. Si el backend responde 401 en una ruta protegida → auto-logout.
 *
 * ¿POR QUÉ NO ENVIAR TOKEN EN RUTAS PÚBLICAS?
 * Si dejas la página abierta varios días y el token expira,
 * el interceptor enviaba ese token viejo en TODAS las peticiones,
 * incluyendo las públicas como GET /product. El backend rechazaba
 * con 401 y el interceptor redirigía a /login, impidiendo ver
 * productos SIN estar logueado.
 *
 * SOLUCIÓN: Definir una lista de rutas públicas del API y NO
 * enviar el token en esas peticiones. Así un visitante sin cuenta
 * puede ver productos normalmente.
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Lista de segmentos de URL del API que son PÚBLICAS.
 * Estas rutas NO necesitan token para funcionar.
 * GET /product, GET /category, GET /collection → cualquiera puede verlas.
 */
const PUBLIC_API_SEGMENTS = ['/product', '/category', '/collection'];

/**
 * Verifica si una URL es una ruta pública del API.
 * Compara contra los segmentos definidos arriba.
 */
function isPublicApiUrl(url: string): boolean {
  return PUBLIC_API_SEGMENTS.some((segment) => url.includes(segment));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Paso 1: Decidir si enviar el token o no
  // - Si es ruta pública del API → NO enviar token (cualquiera puede ver productos)
  // - Si es ruta protegida (cart, favorites, dashboard) → SÍ enviar token
  const shouldSendToken = token && !isPublicApiUrl(req.url);

  const authReq = shouldSendToken ? req.clone({ setHeaders: { 'X-Token': token } }) : req;

  // Paso 2: Enviar la petición y manejar errores 401
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Solo hacer auto-logout si NO es una ruta de auth (evitar loop)
        const isAuthRoute =
          req.url.includes('/auth/login') ||
          req.url.includes('/auth/register') ||
          req.url.includes('/auth/renew-token');

        // Solo redirigir si la petición SÍ enviaba token (ruta protegida)
        // No redirigir si falla una petición pública
        if (!isAuthRoute && shouldSendToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    }),
  );
};
