/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { Dashboard } from './features/pages/dashboard/dashboard';
import { ErrorPageNotFound } from './features/pages/error-page-not-found/error-page-not-found';
import { CategoriesList } from './features/pages/categories/categories-list/categories-list';
import { CategoriesEditForm } from './features/pages/categories/categories-edit-form/categories-edit-form';
import { CategoriesNewForm } from './features/pages/categories/categories-new-form/categories-new-form';
import { CollectionsNewForm } from './features/pages/collections/collections-new-form/collections-new-form';
import { CollectionsList } from './features/pages/collections/collections-list/collections-list';
import { CollectionsEditForm } from './features/pages/collections/collections-edit-form/collections-edit-form';

import { authGuard } from './core/guards/auth-guard';
import { Necklaces } from './features/pages/necklaces/necklaces';
import { Bracelets } from './features/pages/bracelets/bracelets';
import { Earrings } from './features/pages/earrings/earrings';
import { Rings } from './features/pages/rings/rings';
import { ProductList } from './features/pages/products/product-list/product-list';
import { ProductEditForm } from './features/pages/products/product-edit-form/product-edit-form';
import { ProductNewForm } from './features/pages/products/product-new-form/product-new-form';
import { UserNewForm } from './features/pages/user/user-new-form/user-new-form';

export const routes: Routes = [
    { path: `home`, component: Home}, 
    { path: `login`, component: Login},
    { path: `register`, component: Register},
    { path: `404`, component: ErrorPageNotFound},
    { path: `necklaces`, component: Necklaces },
    { path: `bracelets`, component: Bracelets },
    { path: `earrings`, component: Earrings },
    { path: `rings`, component: Rings },
    { path: `dashboard`, component: Dashboard, canActivate: [authGuard] },
    { path: `dashboard/products`, component: ProductList, canActivate: [authGuard] },
    { path: `dashboard/categories`, component: CategoriesList, canActivate: [authGuard] },
    { path: `dashboard/collections`, component: CollectionsList, canActivate: [authGuard] },
    { path: `dashboard/products/edit`, component: ProductEditForm, canActivate: [authGuard] },
    { path: `dashboard/products/new`, component: ProductNewForm, canActivate: [authGuard] },
    { path: `dashboard/categories/edit`, component: CategoriesEditForm, canActivate: [authGuard] },
    { path: `dashboard/categories/new`, component: CategoriesNewForm, canActivate: [authGuard] },
    { path: `dashboard/collections/new`, component: CollectionsNewForm, canActivate: [authGuard] },
    { path: `dashboard/collections/edit`, component: CollectionsEditForm, canActivate: [authGuard] },
    { path: `dashboard/user/new`, component: UserNewForm, canActivate: [authGuard] },
    { path: ``, redirectTo: `home`, pathMatch: `full` },
    { path: `**`, redirectTo: `404`, pathMatch: `full` },
];
