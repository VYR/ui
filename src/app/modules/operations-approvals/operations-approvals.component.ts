import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-operations-approvals',
    templateUrl: './operations-approvals.component.html',
    styleUrls: ['./operations-approvals.component.scss'],
})
export class OperationsApprovalsComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'LC Inquiry',
            path: 'lc-inquiry',
        },
        {
            uuid: '',
            name: 'BG Inquiry',
            path: 'bg-inquiry',
        },
        {
            uuid: '',
            name: 'Service Requests',
            path: 'service-requests',
        },
    ];
}
