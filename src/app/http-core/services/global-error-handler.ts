import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { UtilService } from '../../utility';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    public handleError(error: Error | HttpErrorResponse): void {
        const utilityService = this.injector.get(UtilService);
        let message;
        if (error instanceof HttpErrorResponse) {
            // Server error
            message = this.getServerErrorMessage(error);
            utilityService.displayNotification(message, 'error', 'Server Error');
        } else {
            // Client Error
            message = this.getClientErrorMessage();
            utilityService.displayNotification(message, 'error', 'Client Error');
        }
        // Always log errors
        // tslint:disable-next-line:no-console
        console.error(error);
    }

    public getClientErrorMessage(): string {
        return 'An Internal error has occured while processing your request.';
    }

    public getServerErrorMessage(error: HttpErrorResponse): string {
        return navigator.onLine
            ? error
                ? error.error?.message
                : this.getClientErrorMessage()
            : 'No Internet Connection';
    }
}
