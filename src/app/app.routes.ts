import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'users/register',
        loadComponent: () => import('./modules/register/register.component').then(m => m.RegisterComponent),
        data: { flow: 'set' }
    },
    {
        path: 'users/password',
        loadComponent: () => import('./modules/password/password.component').then(m => m.PasswordComponent)
    },
    {
        path: 'users/recover-password',
        loadComponent: () => import('./modules/recover-password/recover-password.component').then(m => m.RecoverPasswordComponent),
        data: { flow: 'recover' }
    },
    {
        path: '**',
        redirectTo: ''
    }
];
