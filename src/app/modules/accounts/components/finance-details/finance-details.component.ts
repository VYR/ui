import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AccountsSandbox } from '../../accounts.sandbox';

@Component({
    selector: 'app-finance-details',
    templateUrl: './finance-details.component.html',
    styleUrls: ['./finance-details.component.scss'],
})
export class FinanceDetailsComponent {
    @Input() selectedAccount: any = [];
    constructor(private router: Router, public sandBox: AccountsSandbox) {}

    viewStatement() {
        this.sandBox.selectedAccount = this.selectedAccount;
        this.router.navigate(['home/accounts/finance/finance-statement']);
    }
}
