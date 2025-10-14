import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  //* Si ya exsite un usuario en memoria, se permite el acceso
  const currentUser = userSvc.getCurrentUser();
  if(currentUser) return true

  //* Si no hay usuario y tampoco token, se redirige al login
  const token = userSvc.getToken();
  if(!token){
    return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url }});
  }

  //* Hay token pero no usuario, se intenta cargar el usuario actual
  return userSvc.ensureCurrentUserLoaded().then(user => {
    if (user) return true;
    //* En caso de no poder cargar el usuario, se redirige al login
    return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url }});
  });
};