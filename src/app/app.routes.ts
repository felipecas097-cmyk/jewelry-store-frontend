import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { Necklaces } from './features/pages/necklaces/necklaces';
import { Bracelets } from './features/pages/bracelets/bracelets';
import { Earrings } from './features/pages/earrings/earrings';
import { Rings } from './features/pages/rings/rings';

export const routes: Routes = [
    { path: ``, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `404`, component: ErrorPageNotFound},
    { path: `necklaces`, component: Necklaces},
    { path: `bracelets`, component: Bracelets},
    { path: `earrings`, component: Earrings},
    { path: `rings`, component: Rings},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
