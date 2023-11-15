import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';

import { HttpConfigInterceptor } from './interceptors';
import { GlobalErrorHandler } from './services';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true,
        },
    ],
})
export class HttpCoreModule {}
