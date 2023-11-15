import { Component, Input, OnInit } from '@angular/core';
import { SCREEN_MODE } from 'src/app/shared/enums';
import { Account, Entitlement } from '../../models/entitlement';

@Component({
    selector: 'app-account-selection',
    templateUrl: './account-selection.component.html',
    styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
    @Input() entitlement!: Entitlement;
    @Input() fullAccountPrivilege: boolean = false;
    @Input() screenMode: SCREEN_MODE = SCREEN_MODE.CREATE;
    @Input() updateMode: any = {};
    @Input() fromNewRim!: boolean;
    SCREEN_MODE = SCREEN_MODE;
    constructor() {}

    selectAllAccounts(event: any, entitlement: Entitlement): void {
        entitlement.accounts.map((x: Account) => (x.selected = event));
        entitlement.allAccountsSelected = event;
    }

    onClickAccount(entitlement: Entitlement, account: Account) {
        if (this.evaluate(account)) return;
        account.selected = !account.selected;
        entitlement.allAccountsSelected = entitlement.accounts.every((x: Account) => x.selected);
    }

    evaluate(account: Account) {
        if (this.screenMode === SCREEN_MODE.CREATE || this.fromNewRim) return false;
        return this.updateMode.value === 'UPDATE' ? account.userEntitleAccountId : !account.userEntitleAccountId;
    }
}
