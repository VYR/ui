import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core/server-interaction.service';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpParams } from '@angular/common/http';
import { STO_TYPE } from 'src/app/shared/enums';

@Injectable({
    providedIn: 'root',
})
export class TransferService {
    constructor(private http: ServerInteractionService) {}

    getDraftsList(type: any) {
        const httpParams = new HttpParams().set('type', type);
        return this.http.get(Operations.GET_DRAFTS_LIST, httpParams);
    }

    deleteDraftsRequest(uniqueId: string) {
        const params = { uid: uniqueId };
        return this.http.post(Operations.DELETE_DRAFT, params);
    }

    getExchangeRates() {
        return this.http.get(Operations.GET_EXCHANGE_RATES);
    }

    getFromAccountsList(type: any) {
        const httpParams = new HttpParams().set('product', type);
        return this.http.get(Operations.GET_FROM_ACCOUNT_LIST, httpParams);
    }

    initiateBulkTransfer(req: any) {
        return this.http.post(Operations.INITIATE_BULK_TRANSFER, req);
    }

    saveBulkDrafts(req: any, type: any) {
        const httpParams = new HttpParams().set('type', type);
        return this.http.put(Operations.SAVE_BULK_DRAFTS, req, undefined, undefined, httpParams);
    }

    parseCustomFileTransfer(req: any) {
        return this.http.post(Operations.PARSE_CUSTOM_FILE_TRANSFER, req);
    }

    getTemplateMapping() {
        return this.http.get(Operations.GET_TEMPLATE_MAPPING);
    }

    getBenificiaries() {
        return this.http.get(Operations.GET_BENEFICIARY_LIST);
    }

    getPurposeCodes() {
        return this.http.get(Operations.GET_PURPOSE_CODES);
    }

    getIncomeSources() {
        return this.http.get(Operations.GET_INCOME_SOURCES);
    }

    saveTransfers(payload: any) {
        return this.http.put(Operations.SAVE_BULK_DRAFTS, payload, '?type=sinMul');
    }

    getCountryList() {
        return this.http.get(Operations.GET_COUNTRY_LIST);
    }

    createTransfer(payload: any) {
        let url: string = '';
        if (payload.transferData && payload.transferData.length > 1) {
            url = Operations.TRANSFER_MULTIPLE;
        } else {
            if (payload.payeeType === STO_TYPE.WQIB) url = Operations.TRANSFER_WACC;
            if (payload.payeeType === STO_TYPE.WQAR) {
                url = payload.toAccount?.indexOf('QISB') !== -1 ? Operations.TRANSFER_WQIB : Operations.TRANSFER_WQAR;
            }
            if (payload.payeeType === STO_TYPE.INTL) url = Operations.TRANSFER_INTL;
        }
        return this.http.post(url, payload);
    }

    fetchKey() {
        return this.http.get(Operations.FETCH_KEY);
    }
}
