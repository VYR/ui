import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ApplicationContextService } from '../shared/services/application-context.service';
import { UtilService } from '../utility';
import { SgsComponentsService } from './sgs-components.service';

@Injectable({
    providedIn: 'root',
})
export class SgsComponentsSandbox implements OnDestroy {
    private unsubscribe$ = new Subject<void>();
    currentUser: any;
    constructor(
        private sgsComponentsService: SgsComponentsService,
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
        this.sgsComponentsService
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
