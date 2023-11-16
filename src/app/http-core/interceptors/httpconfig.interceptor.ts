import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap, timeout } from 'rxjs/operators';
import { UserContext } from 'src/app/shared/models';

import { ApplicationContextService } from '../../shared/services/application-context.service';
import { UtilService } from '../../utility';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    public count = 0;
    currentUser!: UserContext;
    constructor(private utilService: UtilService, private appContext: ApplicationContextService) {
        this.appContext.currentUser.subscribe((res: any) => (this.currentUser = res));
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.utilService.startSpinner();
        this.count++;
        const isLoggedIn = this.currentUser && this.currentUser.access_token;
        if (isLoggedIn) {
            request = request.clone({
                headers: request.headers.set('Authorization', this.currentUser.access_token),
            });
        }

        return next.handle(request).pipe(
            timeout(900000),
            tap(
                () => {},
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if ([401, 403].indexOf(err.status) !== -1) {
                            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                            this.appContext.logout();
                        }

                        if ([500, 503].indexOf(err.status) !== -1) {
                            this.appContext.serviceDown();
                        }
                        if ([200, 304].indexOf(err.status) !== -1) {
                            return;
                        } else {
                            return throwError(err);
                        }
                    } else return;
                }
            ),
            map(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                    return event;
                },

                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                })
            ),
            finalize(() => {
                this.count--;
                if (this.count === 0) {
                    this.utilService.stopSpinner();
                }
            })
        );
    }
}
