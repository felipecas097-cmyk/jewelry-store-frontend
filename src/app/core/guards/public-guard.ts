import { CanActivateFn } from '@angular/router';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, tap } from 'rxjs';

/**
 * publicGuard — Protege rutas PÚBLICAS (login, register).
 *
 * ¿QUÉ HACE?
 * Si el usuario YA está logueado (tiene token en localStorage),
 * lo redirige a /home. NO debería poder ver el login si ya tiene sesión.
 *
 * ¿POR QUÉ SE ROMPÍA ANTES?
 * Antes dependía SOLO de checkAuthStatus() que llama a /auth/renew-token.
 * Si ese endpoint fallaba (red, servidor, etc), catchError devolvía false
 * y el guard dejaba al usuario acceder a /login estando logueado.
 *
 * SOLUCIÓN: Primero revisa si hay token en localStorage (check rápido).
 * Si existe → redirige a /home inmediatamente, sin esperar al backend.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  // Paso 1: Check rápido — ¿hay token en localStorage?
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    // Ya tiene sesión → redirigir a home, NO dejar ver login/register
    router.navigate(['/home']);
    return of(false);
  }

  // Paso 2: Si no hay token local, confirmar con el backend (por si acaso)
  return httpAuth.checkAuthStatus().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/home']);
      }
    }),
    map((isAuthenticated) => !isAuthenticated),
  );
};
