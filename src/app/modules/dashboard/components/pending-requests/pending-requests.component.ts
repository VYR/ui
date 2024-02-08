import { Component } from '@angular/core';
import { ROLE_NAME } from 'src/app/shared/enums';
import { DashboardSandbox } from '../../dashboard.sandbox';

@Component({
    selector: 'app-pending-requests',
    templateUrl: './pending-requests.component.html',
    styleUrls: ['./pending-requests.component.scss'],
})
export class PendingRequestsComponent {
    ROLE_NAME = ROLE_NAME;
    durationList: any = ['All', 'Last 3 months'];
    selectedDuration: any = 'Last 3 months';
    constructor(private sandbox: DashboardSandbox) {
       
    }
}
