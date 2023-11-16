import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ApplicationContextService } from '../shared/services/application-context.service';
import { UtilService } from '../utility';
import { CibComponentsService } from './cib-components.service';

@Injectable({
    providedIn: 'root',
})
export class CibComponentsSandbox implements OnDestroy {
    private unsubscribe$ = new Subject<void>();
    currentUser: any;
    constructor(
        private cibComponentsService: CibComponentsService,
        private appContext: ApplicationContextService,
        private utilService: UtilService
    ) {
        this.appContext.currentUser.subscribe((res: any) => {
            this.currentUser = res;
        });
    }

    public resendOtp(email?: string): any {
        const payload = {
            email: email ? email : this.currentUser.userName,
        };
        this.cibComponentsService
            .resendOtp(payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response: any) => {
                if (response.status === 'SUCCESS') {
                    this.utilService.displayNotification('OTP sent Successfully!', 'success');
                }
            });
    }

    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
