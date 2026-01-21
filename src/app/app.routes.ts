import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { UserNewForm } from './features/pages/user/user-new-form/user-new-form';

export const routes: Routes = [
    { path: ``, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `user/new`, component: UserNewForm},
    { path: `404`, component: ErrorPageNotFound},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
