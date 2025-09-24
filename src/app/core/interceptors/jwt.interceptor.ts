import { HttpHandlerFn, HttpRequest, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { UserService } from "@core/services/user.service";

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const userService = inject(UserService);
    const token = userService.getToken();

    const clonedReq = token ? req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    }) : req;

    return next(clonedReq);
};