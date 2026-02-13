import { CanActivateFn } from '@angular/router';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  return httpAuth.checkAuthStatus().pipe(
    tap((isAuthenticated) => {
      if(!isAuthenticated){
        router.navigate(['/login']);
      }
    })
  );
};
