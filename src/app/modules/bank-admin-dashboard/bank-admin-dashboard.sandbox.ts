import { Injectable } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UtilService } from 'src/app/utility';
import { BankAdminDashboardService } from './bank-admin-dashboard.service';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BankadminDashboardSandbox {
    userContext!: UserContext;
    constructor(
        private bankAdminDashboardService: BankAdminDashboardService,
        private util: UtilService,
        private appContext: ApplicationContextService
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    getAdminRequestList(query: any, type: any) {
        return this.bankAdminDashboardService.getAdminRequestList(query, type);
    }

    updateSysConfig(payload: any) {
        return this.bankAdminDashboardService.updateSysConfig(payload).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.util.displayNotification(`System configuration updated successfully!`, 'success');
                }
            })
        );
    }
    getEntitlementsForCorporate() {
        return this.bankAdminDashboardService.getEntitlementsForCorporate();
    }
    updateEntitlementsForCorporate(payload: any) {
        return this.bankAdminDashboardService.updateEntitlementsForCorporate(payload).pipe(
            tap((res: any) => {
                if (res && res.data) {
                    this.util.displayNotification(
                        `Request has been sent successfully with request Id#${res.data.requestId}`,
                        'success'
                    );
                }
            })
        );
    }
    getEntitlementsForAdmin() {
        return this.bankAdminDashboardService.getEntitlementsForAdmin();
    }
    updateEntitlementsForAdmin(payload: any) {
        return this.bankAdminDashboardService.updateEntitlementsForAdmin(payload).pipe(
            tap((res: any) => {
                if (res && res.data) {
                    this.util.displayNotification(
                        `Request has been sent successfully with request Id#${res.data.requestId}`,
                        'success'
                    );
                }
            })
        );
    }
}
