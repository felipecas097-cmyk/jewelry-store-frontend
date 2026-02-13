import { CanActivateFn } from '@angular/router';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const httpAuth = inject(HttpAuth);

  return httpAuth.checkAuthStatus();
};
