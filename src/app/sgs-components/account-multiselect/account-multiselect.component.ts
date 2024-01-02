import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-account-multiselect',
    templateUrl: './account-multiselect.component.html',
    styleUrls: ['./account-multiselect.component.scss'],
})
export class AccountMultiselectComponent implements OnChanges {
    @Input() label!: string;
    @Input() options!: Array<any>;
    @Input() formControlName!: string;
    @Input() formGroup!: any;
    selectedAccounts: any;

    constructor() {}

    accountSelected(accounts: any) {
        let totalBalance: number = 0;
        this.selectedAccounts = {};
        accounts.forEach((account: any) => {
            this.selectedAccounts['currency'] = account.currency;
            totalBalance = totalBalance + Number(account.balance);
        });
        this.selectedAccounts['balance'] = totalBalance;
        this.selectedAccounts['accountDetails'] =
            accounts.map((account: any) => account.accountNumber + ' - ' + account.description).join(',') || '';
    }

    ngOnChanges() {
        this.selectedAccounts = {};
    }
}
