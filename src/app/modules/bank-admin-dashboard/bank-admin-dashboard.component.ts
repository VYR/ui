import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-bank-admin-dashboard',
    templateUrl: './bank-admin-dashboard.component.html',
    styleUrls: ['./bank-admin-dashboard.component.scss'],
})
export class BankAdminDashboardComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Request Queue',
            path: 'my-queue',
        },
        {
            uuid: '',
            name: 'Application Config',
            path: 'app-config',
        },
        {
            uuid: '',
            name: 'Feature Management',
            path: 'feature-management',
        },
    ];
}
