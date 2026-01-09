import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';

export const routes: Routes = [
    { path: ``, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `404`, component: ErrorPageNotFound},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
