import { Routes } from "@angular/router";
import { MenuComponent } from "./menu.component";

export const MenuRoutes: Routes = [
    {
        path: '',
        component: MenuComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./layouts/dashboard/dashboard.component').then(m => m.DashboardComponent)
            }
        ]
    }
]