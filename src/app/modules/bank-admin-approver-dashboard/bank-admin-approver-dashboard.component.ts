import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-bank-admin-approver-dashboard',
    templateUrl: './bank-admin-approver-dashboard.component.html',
    styleUrls: ['./bank-admin-approver-dashboard.component.scss'],
})
export class BankAdminApproverDashboardComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'APPROVAL QUEUE',
            path: 'dashboard',
        },
    ];
    constructor() {}
}
