import { Component } from '@angular/core';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Accounts',
            path: 'transactional',
        },
        {
            uuid: '',
            name: 'Deposits',
            path: 'deposits',
        },
        {
            uuid: '',
            name: 'Finance',
            path: 'finance',
        },
        {
            uuid: 'ACCOUNT_LIMIT',
            name: 'Revolving Facilities Limits',
            path: 'revolving',
        },
        {
            uuid: 'ACCOUNT_OPENING_MUDARABA_TERM_DEPOSIT',
            name: 'Open New Account (MTD)',
            path: 'open-new-fd-account',
        },
    ];
    /*     {
        uuid: 'ACCOUNT_OPENING_CERTIFICATE_OF_DEPOSIT',
        name: 'Open New Account (CD)',
        path: 'open-new-cd-account',
    }, */
}
