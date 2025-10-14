import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full' //? pathMatch es usado para especificar como se debe hacer el match de la ruta. 'full' significa que la ruta debe coincidir exactamente.
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
        path: 'menu',
        loadChildren: () => import('./modules/menu/menu.routes').then(m => m.MenuRoutes),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
