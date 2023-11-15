import { Component } from '@angular/core';

@Component({
    selector: 'app-bank-admin-group-management',
    templateUrl: './bank-admin-group-management.component.html',
    styleUrls: ['./bank-admin-group-management.component.scss'],
})
export class BankAdminGroupManagementComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Search Group',
            path: 'search',
        },
        {
            uuid: '',
            name: 'Group Set Up',
            path: 'create',
        },
        {
            uuid: '',
            name: 'Group Mappings',
            path: 'mappings',
        },
        {
            uuid: '',
            name: 'Group Matrix',
            path: 'matrix',
        },
    ];
    constructor() {}
}
