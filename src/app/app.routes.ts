import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes)
    }
];
