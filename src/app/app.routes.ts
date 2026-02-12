import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { Dashboard } from './features/pages/dashboard/dashboard';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: ``, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `dashboard`, component: Dashboard, canActivate: [authGuard]},
    { path: `404`, component: ErrorPageNotFound},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
