import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class CardsService {
    constructor(private http: ServerInteractionService) {}

    aamaliCardDocumentsUpload(payload: any) {
        return this.http.post(Operations.AAMALI_CARD_DOCUMENTS_UPLOAD, payload, {});
    }

    getAccounts() {
        return this.http.get(Operations.GET_CARD_ACCOUNTS);
    }
    getCardsList() {
        return this.http.get(Operations.GET_CARDS_LIST);
    }

    getCategoryCodesAccounts() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }

    getCard(queryParam: any) {
        return this.http.get(Operations.GET_CARD, queryParam);
    }
    getCardTransactions(queryParam: any) {
        return this.http.get(Operations.GET_CARD_TRANSACTIONS, queryParam);
    }
    getCardMagstripe(queryParam: any) {
        return this.http.get(Operations.GET_CARD_MAGSTRIPE, queryParam);
    }
    deactivateCardMagstripe(queryParam: any) {
        return this.http.post(Operations.GET_CARD_MAGSTRIPE, queryParam);
    }
    getCountries() {
        return this.http.get(Operations.GET_COUNTRY_LIST);
    }

    modifyCardStatus(postParam: any) {
        return this.http.post(Operations.BLOCK_CARD, postParam);
    }
    modifyDebitCardStatus(postParam: any) {
        return this.http.post(Operations.BLOCK_DEBIT_CARD, postParam);
    }
    getTransactionsList(postParam: any) {
        return this.http.post(Operations.GET_TRANSACTIONS_LIST, postParam);
    }
    makeSingleCardPayment(postParam: any) {
        return this.http.post(Operations.SINGLE_CARD_PAYMENT, postParam);
    }
    makeBulkCardPayment(postParam: any) {
        return this.http.post(Operations.BULK_CARD_PAYMENT, postParam);
    }
    downloadCardPDFStatement(postParam: any) {
        return this.http.post(Operations.CARD_PDF_STMT, postParam);
    }
    getAmaliHistory() {
        return this.http.get(Operations.GET_AMALI_HISTORY);
    }
    saveAmaliCard(payload: any) {
        return this.http.post(Operations.SAVE_AMALI_CARD, payload);
    }
    debitCardApproval(payload: any) {
        return this.http.post(Operations.DEBIT_CARD_APPROVAL, payload);
    }
    uploadAmaliDocs(payload: any) {
        return this.http.post(Operations.UPLOAD_AMALI_DOCS, payload, {});
    }
    getApprovers() {
        return this.http.get(Operations.GET_APPROVERS);
    }
    getAmaliRequestCount(queryParam: any) {
        return this.http.get(Operations.GET_AMALI_REQUEST_COUNT, queryParam);
    }
    getDebitCardList() {
        return this.http.get(Operations.GET_DEBIT_CARD_LIST);
    }
    getDebitCardDetails(queryParam: any) {
        return this.http.get(Operations.GET_DEBIT_CARD_DETAILS, queryParam);
    }
    getDebitCardMagneticStripe(queryParam: any) {
        return this.http.get(Operations.GET_DEBIT_CARD_MAGNETIC_STRIPE, queryParam);
    }
    deactivateDebitCardMagneticStripe(queryParam: any) {
        return this.http.post(Operations.GET_DEBIT_CARD_MAGNETIC_STRIPE, queryParam);
    }
    resetCardPIN(postParam: any) {
        return this.http.post(Operations.RESET_DEBIT_CARD_PIN, postParam);
    }
    getCountry() {
        return this.http.get(Operations.GET_COUNTRY);
    }
    downloadFile(params: any) {
        return this.http.get(Operations.DOWNLOAD_CARD_FILES, params);
    }
}
