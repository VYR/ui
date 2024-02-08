import { Component } from '@angular/core';
import { ROLE_NAME } from 'src/app/shared/enums';
import { DashboardSandbox } from '../../dashboard.sandbox';

@Component({
    selector: 'app-completed-overview',
    templateUrl: './completed-overview.component.html',
    styleUrls: ['./completed-overview.component.scss'],
})
export class CompletedOverviewComponent {
    ROLE_NAME = ROLE_NAME;
    constructor(private sandbox: DashboardSandbox) {
       
    }
}
