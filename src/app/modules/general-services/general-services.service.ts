import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class GeneralServicesService {
    constructor(private http: ServerInteractionService) {}

    getAccounts() {
        return this.http.get(Operations.GET_GS_ACCOUNTS);
    }
    getCategoryCodesAccounts() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }
    getUserStatusDetails() {
        return this.http.get(Operations.GET_USER_STATUS_DETAILS);
    }
    getCurrencyList() {
        return this.http.get(Operations.GET_CURRENCY_LIST);
    }

    downloadFile(params: any) {
        return this.http.get(Operations.DOWNLOAD_FILE, params);
    }

    getRequests(params: any) {
        const httpParams = new HttpParams()
            .set('requestType', params.requestType)
            .set('pageSize', params.pageSize)
            .set('pageNumber', params.pageIndex)
            .set('sort', params.sortDirection || 'DESC')
            .set('sortField', params.sortKey || 'created');

        return this.http.get(Operations.GET_GS_REQUESTS, httpParams);
    }

    getChequeBookCharges(queryParam: any) {
        return this.http.get(Operations.GET_CHEQUE_BOOK_CHARGES, queryParam);
    }
    chequeImages(queryParam: any) {
        return this.http.get(Operations.CHEQUE_IMAGES, queryParam);
    }

    sendChequeBookRequest(postParams: any) {
        return this.http.post(Operations.SEND_CHEQUE_BOOK_REQUEST, postParams);
    }

    sendEStatementRequest(postParams: any) {
        return this.http.post(Operations.SEND_E_STATEMENT_REQUEST, postParams);
    }

    sendBalanceConfirmationRequest(postParams: any) {
        return this.http.post(Operations.SEND_BAL_CNF_REQUEST, postParams);
    }
    getBalanceConfirmationCharges(queryParam: any) {
        return this.http.get(Operations.SEND_BAL_CNF_REQUEST, queryParam);
    }

    balConfFileUpload(postParams: any) {
        return this.http.post(Operations.BAL_CNF_FILE_UPLOAD, postParams, {});
    }

    sendCreditCardRequest(postParams: any) {
        return this.http.post(Operations.SEND_CREDIT_CARD_REQUEST, postParams);
    }
    requestUserStatus(postParams: any) {
        return this.http.post(Operations.REQUEST_USER_STATUS, postParams);
    }

    getDepositCardList() {
        return this.http.get(Operations.GET_DEPOSIT_CARD_LIST);
    }

    saveDepositCards(payload: any) {
        return this.http.post(Operations.DEPOSIT_CARD, payload);
    }

    depositCardDocumentsUpload(payload: any) {
        return this.http.post(Operations.DEPOSIT_CARD_DOCUMENTS_UPLOAD, payload, {});
    }

    _getDepositCardHistory() {
        return this.http.get(Operations.DEPOSIT_CARD);
    }
}
