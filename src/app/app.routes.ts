import { Routes } from '@angular/router';
import { HomeComponent } from '@modules/home/home.component';
import { RegisterComponent } from '@modules/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes)
    },
    {
        path: 'register',
        component: RegisterComponent,
        loadChildren: () => import('./modules/register/register.routes').then(m => m.RegisterRoutes)
    }
];
