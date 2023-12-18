import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_NAME } from 'src/app/shared/enums';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';

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
        
    }

    viewAllRequests(route: APP_ROUTES) {
        this.router.navigate([route]);
    }
}
