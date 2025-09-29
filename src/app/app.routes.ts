import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes)
    },
    {
        path: 'users/register',
        loadChildren: () => import('./modules/register/register.routes').then(m => m.RegisterRoutes)
    },
    {
        path: 'users/password',
        loadChildren: () => import('./modules/password/password.routes').then(m => m.PasswordRoutes)
    },
    {
        path: 'users/recover-password',
        loadChildren: () => import('./modules/recover-password/recover-password.routes').then(m => m.RecoverPasswordRoutes)
    },
    {
        path: 'menu',
        loadChildren: () => import('./modules/menu/menu.routes').then(m => m.MenuRoutes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
