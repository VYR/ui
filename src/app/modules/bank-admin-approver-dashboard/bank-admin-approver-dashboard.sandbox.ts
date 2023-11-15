import { Injectable } from '@angular/core';
import { DECISION } from 'src/app/shared/enums';
import { UtilService } from 'src/app/utility';
import { BankAdminApproverDashboardService } from './bank-admin-approver-dashboard.service';
import { map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Injectable({
    providedIn: 'root',
})
export class BankadminApproverDashboardSandbox {
    constructor(
        private bankAdminApproverDashboardService: BankAdminApproverDashboardService,
        private util: UtilService,
        private router: Router
    ) {}

    getAdminApproverRequestList(query: any, type: any) {
        return this.bankAdminApproverDashboardService.getAdminApproverRequestList(query, type);
    }

    actOnAdminRequest(payload: any, action: any, decision: any) {
        return this.bankAdminApproverDashboardService.actOnAdminRequest(payload).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    if (action !== DECISION.VERIFY) {
                        this.util.displayNotification(
                            `Request is ${
                                decision.toUpperCase() == DECISION.APPROVE ? 'Approved' : 'Rejected'
                            } successfully!`,
                            'success'
                        );
                        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                            this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD_APPROVER]);
                        });
                    }
                }
            })
        );
    }
}
