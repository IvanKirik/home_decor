import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const tokens = this.authService.getTokens();
    if(tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-access-token', tokens.accessToken)
      });

      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if(error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle401Error(authReq, next);
            }
            return throwError(() => error);
          }),
          finalize(() => {
            this.loaderService.hide();
          })
        );
    }
    return next.handle(req)
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
      );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';
          if((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }
          const refreshResult = result as LoginResponseType;
          if(!refreshResult. accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = "Ошибка авторизации";
          }
          if(error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq = req.clone({
            headers: req.headers.set('x-access-token', refreshResult.accessToken)
          });

          return next.handle(authReq);
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.router.navigate(['/'])
          return throwError(() => error);
        })
      )

  }
}
