import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Search User',
            path: 'search',
        },
        {
            uuid: '',
            name: 'Create User',
            path: 'create-user',
        },
    ];
    constructor() {}
}
