import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-corporate-management',
    templateUrl: './corporate-management.component.html',
    styleUrls: ['./corporate-management.component.scss'],
})
export class CorporateManagementComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Corporate Registration',
            path: 'corporate',
        },
        {
            uuid: '',
            name: 'Corporate Business Group',
            path: 'corporate-groups',
        },
        {
            uuid: '',
            name: 'Template Mapping',
            path: 'template-mapping',
        },
        {
            uuid: '',
            name: 'Positive Pay Registration',
            path: 'positive-pay-registration',
        },
        {
            uuid: '',
            name: 'Host to Host',
            path: 'host-to-host',
        },
        {
            uuid: '',
            name: 'Transaction History',
            path: 'transaction-history',
        },
        {
            name: 'Delink Device',
            path: 'delink-to-device',
        },
    ];
    constructor() {}
}
