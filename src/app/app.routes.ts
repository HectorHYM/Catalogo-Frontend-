import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes)
    },
    {
        path: 'register',
        loadChildren: () => import('./modules/register/register.routes').then(m => m.RegisterRoutes)
    }
];
