import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_NAME } from 'src/app/shared/enums';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { kycPopupComponent } from '../kyc-popup/kyc-popup.component';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
    APP_ROUTES = APP_ROUTES;
    ROLE_NAME = ROLE_NAME;
    isStpUser = false;
    constructor(private router: Router, private dialog: CibDialogService, private sandbox: DashboardSandbox) {
        //this.isStpUser = this.sandbox.userContext.stpUser;
        this.kycPopup(this.sandbox.userContext);
    }

    viewAllRequests(route: APP_ROUTES) {
        this.router.navigate([route]);
    }

    kycPopup(userInfo: any) {
        if (userInfo.kycPopType === 1 || userInfo.kycPopType === 2) {
            const ref = this.dialog.openDialog(CibDialogType.large, kycPopupComponent, {
                data: userInfo.kycPopType,
            });
        }
    }
}
