import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoaderService } from "@core/services/loader.service";
import { finalize } from "rxjs";

export const httpLoaderInterceptor : HttpInterceptorFn = (req, next) => {
    const loader = inject(LoaderService);
    loader.show();
    return next(req).pipe(
        finalize(() => loader.hide())
    );
};