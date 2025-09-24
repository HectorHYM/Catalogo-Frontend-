import { HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor : HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((err: HttpErrorResponse | GeneralResponse<any>) => {
            let msg = "Error en la operación, intente más tarde.";

            if(err instanceof HttpErrorResponse) {
                msg = err.error?.msg ?? err.message ?? msg;
            }else{
                msg = err.msg ?? msg;
            }

            console.error(msg);
            return throwError(() => err);
        })
    );
}