import { Routes } from "@angular/router";

const SettingsButtonRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./settings-button.component').then(m => m.SettingsButtonComponent)
    }
]