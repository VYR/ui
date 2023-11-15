import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SettingsService } from './settings.service';
import { tap } from 'rxjs/operators';
import { UtilService } from 'src/app/utility';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsSandbox implements OnDestroy {
    private unsubscribe$ = new Subject<void>();
    currentUser: any;
    constructor(
        private service: SettingsService,
        private utilService: UtilService,
        private appContext: ApplicationContextService
    ) {
        appContext.currentUser.subscribe((res: any) => {
            this.currentUser = res;
        });
    }

    getSettingsList() {
        const req = {
            userName: this.currentUser.firstName,
        };
        return this.service.getDeviceSettingsList(req);
    }

    public deRegisterDevice(deviceId: any): any {
        const req = {
            userName: this.currentUser.userName,
            deviceId: deviceId,
        };
        return this.service.deRegisterDevice(req).pipe(
            tap((res: any) => {
                if (res.status === 'SUCCESS') {
                    this.utilService.displayNotification('Device de-linked Successfully!', 'success');
                } else {
                    this.utilService.displayNotification(res.message, 'error');
                }
            })
        );
    }

    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
