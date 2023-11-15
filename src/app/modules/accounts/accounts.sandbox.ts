import { Injectable } from '@angular/core';
import { AccountsService } from './accounts.service';

@Injectable({
    providedIn: 'root',
})
export class AccountsSandbox {
    public selectedAccount: any;
    public transactionAndPaymentAccountsCodes: any = [];
    constructor(private service: AccountsService) {}

    getAccountsList(accountype: any) {
        return this.service.getAccountsList(accountype);
    }

    openCdAccount(req: any) {
        return this.service.openCdAccount(req);
    }

    openFdAccount(req: any) {
        return this.service.openFdAccount(req);
    }

    sendEmail(req: any) {
        return this.service.sendEmail(req);
    }

    getAccountDepositExtract(req: any) {
        return this.service.getAccountDepositExtract(req);
    }

    getTransactionsForAccounts(accountNumber: any, queryParams: any) {
        return this.service.getTransactionsForAccounts(accountNumber, queryParams);
    }

    getCategoryCodesAccounts() {
        return this.service.getCategoryCodesAccounts();
    }

    getInvestmentDeals(legacy_no: any) {
        return this.service.getInvestmentDeals(legacy_no);
    }

    getRevolvingLimitsList(limitType: any, status: any, downloadType?: string) {
        return this.service.getRevolvingLimitsList(limitType, status, downloadType);
    }

    getFinanceStatements(queryParams: any) {
        return this.service.getFinanceStatements(queryParams);
    }

    downloadAccountsStatements(queryParams: any) {
        return this.service.downloadAccountsStatements(queryParams);
    }
}
