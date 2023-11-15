import { Component } from '@angular/core';

@Component({
    selector: 'app-cheque-management',
    templateUrl: './cheque-management.component.html',
    styleUrls: ['./cheque-management.component.scss'],
})
export class ChequeManagementComponent {
    public menu: Array<any> = [
        {
            uuid: 'POST_DATED_CHEQUE',
            name: 'PDC',
            path: 'pdc',
        },
        {
            uuid: 'POSITIVE_PAY_ADD_DATA',
            name: 'Positive Pay',
            path: 'positive-pay',
        },
    ];

    constructor() {}
}
