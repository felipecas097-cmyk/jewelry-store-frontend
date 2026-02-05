/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';


export const routes: Routes = [
    { path: `home`, component: Home}, 
    { path: `404`, component: ErrorPageNotFound},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
