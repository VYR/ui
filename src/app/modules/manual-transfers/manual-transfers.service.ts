import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ManualTransfersService {
    constructor(private http: ServerInteractionService) {}

    getFromAccountsList(type: any) {
        const httpParams = new HttpParams().set('product', type);
        return this.http.get(Operations.GET_FROM_ACCOUNT_LIST, httpParams);
    }

    getPurposeCodes() {
        return this.http.get(Operations.GET_PURPOSE_CODES);
    }

    getIncomeSources() {
        return this.http.get(Operations.GET_INCOME_SOURCES);
    }

    getCountryList() {
        return this.http.get(Operations.GET_COUNTRY_LIST);
    }

    getCurrencyList() {
        return this.http.get(Operations.GET_CURRENCY_LIST);
    }

    getBankListQatar() {
        return this.http.get(Operations.GET_BANK_LIST_QATAR);
    }

    getManualTransferRelations() {
        return this.http.get(Operations.GET_BENEFICIARY_RELATIONS);
    }

    addManualTransfer(req: any) {
        return this.http.post(Operations.CREATE_MANUAL_TRANSFER, req);
    }

    updateManualTransfer(req: any) {
        return this.http.put(Operations.UPDATE_MANUAL_TRANSFER, req);
    }

    listManualTransfers() {
        return this.http.get(Operations.LIST_MANUAL_TRANSFERS);
    }

    validateSwiftCode(queryParam: any) {
        return this.http.get(Operations.VALIDATE_SWIFT_CODE, queryParam);
    }
}
