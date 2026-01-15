import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { CategoriesList } from './features/pages/categories/categories-list/categories-list';
import { CategoriesEditForm } from './features/pages/categories/categories-edit-form/categories-edit-form';
import { CategoriesNewForm } from './features/pages/categories/categories-new-form/categories-new-form';

export const routes: Routes = [
    { path: `home`, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `404`, component: ErrorPageNotFound},
    { path:`dashboard/categories`, component: CategoriesList},
    { path:`dashboard/categories/edit`, component: CategoriesEditForm},
    { path:`dashboard/categories/new`, component: CategoriesNewForm},

    { path: ``, redirectTo: `home`, pathMatch: `full`},
    { path: `**`, redirectTo: `404`, pathMatch: `full`}, 
    
];
