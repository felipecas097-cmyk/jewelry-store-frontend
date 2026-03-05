/**
 * ============================================================
 * AUTH INTERCEPTOR — Manejo automático de token y expiración
 * ============================================================
 *
 * ¿QUÉ HACE?
 * 1. Agrega el token JWT a TODAS las peticiones HTTP via header X-Token.
 * 2. Si el backend responde con 401 (Unauthorized), significa que el
 *    token expiró o es inválido → hace logout automático y redirige a /login.
 *
 * ¿POR QUÉ ES NECESARIO?
 * Sin esto, si dejas la página abierta varios días y el token expira,
 * el frontend sigue pensando que estás logueado (token en localStorage)
 * pero TODAS las peticiones al backend fallan con 401.
 * El interceptor detecta ese 401 y limpia la sesión automáticamente.
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Paso 1: Si hay token, clonamos la petición y lo agregamos al header
  const authReq = token ? req.clone({ setHeaders: { 'X-Token': token } }) : req;

  // Paso 2: Enviamos la petición y capturamos errores 401
  return next(authReq).pipe(
    catchError((error) => {
      // Si el backend responde 401 → token expirado o inválido
      if (error.status === 401) {
        // Evitar loop infinito: no hacer logout si ya estamos en /login o /auth/renew-token
        const isAuthRoute =
          req.url.includes('/auth/login') || req.url.includes('/auth/renew-token');

        if (!isAuthRoute) {
          // Limpiar toda la sesión
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Redirigir al login
          router.navigate(['/login']);
        }
      }

      // Re-lanzar el error para que los subscribers lo manejen también
      return throwError(() => error);
    }),
  );
};
