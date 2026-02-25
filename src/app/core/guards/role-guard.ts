import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = async (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  // Extrae la lista de roles permitidos de cada ruta
  const allowedRoles = route.data['roles'];

  // Obtenemos los datos del usuario (Observable), convertimos en una Promesa (firstValueFrom ==> RxJS)
  const user = await firstValueFrom(httpAuth.currentUser$);
  //const role = user?.role;      // Extraemos el rol del usuario autenticado
  const userRoles: string[] = Array.isArray(user?.roles) ? user.roles : [];



  // Paso 1 (Opcional, para los bobitos): Verificamos si NO hay usuario (aunque el authGuard deberia haberlo atrapado antes)
  if (!user) {
    // TODO: Ventanita emergente
    router.navigateByUrl('/login');
    return false;
  }

  // Paso 2: Verificamos si la ruta no tiene definidos los roles, permitimos el acceso
  if (!allowedRoles || allowedRoles.length == 0) {
    return true;
  }

  // Paso 3: Verificamos si el rol del usuario esta en la lista de permitidos (data.roles)
  if (userRoles.some(r => allowedRoles.includes(r))) {
    return true;
  }

  // Por defecto: Si no tiene permiso, redirigir (opcional, o simplemente denegar)
  router.navigateByUrl('/home');
  return false;
};