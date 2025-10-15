import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { httpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { httpLoaderInterceptor } from '@core/interceptors/http-loader.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { jwtInterceptor } from '@core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpLoaderInterceptor, jwtInterceptor])), // withInterceptors([httpErrorInterceptor])
    importProvidersFrom(MatSnackBarModule),
    provideAnimations()
  ]
};