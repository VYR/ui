import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AccountsService {
    constructor(private http: ServerInteractionService) {}

    getAccountsList(accountype: any) {
        const httpParams = new HttpParams().set('product', accountype);
        return this.http.get(Operations.GET_ACCOUNTS_LIST, httpParams);
    }

    openCdAccount(req: any) {
        return this.http.post(Operations.OPEN_CD_ACCOUNT, req);
    }

    openFdAccount(req: any) {
        return this.http.post(Operations.OPEN_FD_ACCOUNT, req);
    }

    sendEmail(req: any) {
        return this.http.post(Operations.SEND_EMAIL, req);
    }

    getAccountDepositExtract(req: any) {
        return this.http.get(Operations.ACCOUNT_DEPOSIT_EXTRACT, req);
    }

    getTransactionsForAccounts(accountNumber: any, queryParams: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet
            .set('account', accountNumber)
            .set('pageSize', queryParams.pageSize)
            .set('pageNumber', queryParams.pageNumber)
            .set('sort', queryParams.sortDirection || 'DESC')
            .set('sortField', queryParams.sortKey || 'valueDate');
        if (queryParams.fromDate && queryParams.fromDate !== '' && queryParams.toDate && queryParams.toDate !== '') {
            paramsSet = paramsSet.set('fromDate', queryParams.fromDate).set('toDate', queryParams.toDate);
        }
        if (queryParams.credit && queryParams.credit !== '') {
            paramsSet = paramsSet.set('credit', queryParams.credit);
        }
        if (queryParams.debit && queryParams.debit !== '') {
            paramsSet = paramsSet.set('debit', queryParams.debit);
        }
        if (queryParams.txnReference && queryParams.txnReference !== '') {
            paramsSet = paramsSet.set('txnReference', queryParams.txnReference);
        }
        if (queryParams.downloadtype && queryParams.downloadtype !== '') {
            paramsSet = paramsSet.set('downloadType', queryParams.downloadtype);
        }
        return this.http.get(Operations.GET_TRANSACTIONS_ACCOUNTS, paramsSet);
    }

    getCategoryCodesAccounts() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }

    getInvestmentDeals(legacy_no: any) {
        const httpParams = new HttpParams().set('accountId', legacy_no);
        return this.http.get(Operations.GET_INVESTMENT_DEALS, httpParams);
    }

    getRevolvingLimitsList(limitType: any, status: any, downloadType?: string) {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('limitType', limitType).set('status', status);
        if (downloadType) httpParams = httpParams.set('downloadType', downloadType);
        return this.http.get(Operations.GET_REVOLVING_LIMITS_LIST, httpParams);
    }

    getFinanceStatements(queryParams: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('ldAccountNumber', queryParams.account);
        if (queryParams.downloadtype) {
            paramsSet = paramsSet.set('downloadType', queryParams.downloadtype);
        }
        return this.http.get(Operations.GET_FINANCE_STATEMENTS, paramsSet);
    }

    downloadAccountsStatements(params: any) {
        return this.http.get(Operations.DOWNLOAD_ACCOUNT_STATEMENTS, params);
    }
}
