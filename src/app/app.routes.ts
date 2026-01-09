/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { ProductList } from './features/pages/products/product-list/product-list';
import { ProductEditForm } from './features/pages/products/product-edit-form/product-edit-form';
import { ProductNewForm } from './features/pages/products/product-new-form/product-new-form';

export const routes: Routes = [
    { path: `home`, component: Home}, 
    { path: `login`, component: Login},
    { path: `dashboard/products`, component: ProductList},
    { path: `dashboard/products/:id`, component: ProductEditForm},
    { path: `dashboard/products/new`, component: ProductNewForm},
    { path: `register`, component: Register},
    { path: `404`, component: ErrorPageNotFound},
    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`} 
];
