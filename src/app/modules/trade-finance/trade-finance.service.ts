import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TradeFinanceService {
    constructor(private http: ServerInteractionService) {}
    getImportLCSettings() {
        return this.http.get(Operations.GET_TF_LC_SETTINGS);
    }

    getCountries() {
        return this.http.get(Operations.GET_COUNTRY_LIST);
    }

    getCurrencyList() {
        return this.http.get(Operations.GET_CURRENCY_LIST);
    }

    saveORCreateBankGuarantee(payload: any) {
        return this.http.post(Operations.SAVE_OR_CREATE_BANK_GUARANTEE, payload);
    }

    submitBankGuarantee(payload: any) {
        return this.http.post(Operations.SUBMIT_BANK_GUARANTEE, payload);
    }

    previewBankGuarantee(payload: any) {
        return this.http.post(Operations.PREVIEW_BANK_GUARANTEE, payload);
    }

    amendBankGuarantee(payload: any) {
        return this.http.post(Operations.AMEND_BANK_GUARANTEE, payload);
    }

    bankGuaranteeAmendPreview(payload: any) {
        return this.http.post(Operations.BANK_GUARANTEE_AMEND_PREVIEW, payload);
    }

    uploadBankGuaranteeFiles(formData: any, payload: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('bgApplicationId', payload.bgApplicationId);
        return this.http.post(Operations.BG_HISTORY_UPLOAD, formData, undefined, undefined, paramsSet);
    }

    deleteIndividualDocument(payload: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('applicationId', payload.id);
        return this.http.get(Operations.HISTORY_FILEDELETE, paramsSet);
    }

    getBGDrafts(payload: any) {
        let paramsSet = new HttpParams().set('type', payload.type);
        if (payload.beneficiaryName && payload.productType) {
            paramsSet = paramsSet.set('beneficiary', payload.beneficiaryName).set('productType', payload.productType);
        } else if (payload.beneficiaryName) {
            paramsSet = paramsSet.set('beneficiary', payload.beneficiaryName);
        } else if (payload.productType) {
            paramsSet = paramsSet.set('productType', payload.productType);
        }
        return this.http.get(Operations.BANK_GUARANTEE_LIST, paramsSet);
    }

    deletebankGuarantee(payload: any) {
        return this.http.delete(Operations.DELETE_BANK_GUARANTEE, payload);
    }

    getLCDrafts() {
        return this.http.get(Operations.GET_LC_DRAFTS);
    }

    deleteLCDrafts(referenceNumber: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', referenceNumber);
        return this.http.delete(Operations.DELETE_LC_DRAFTS, paramsSet);
    }

    downloadFile(params: any) {
        return this.http.get(Operations.DOWNLOAD_FILE, params);
    }

    exportLC() {
        return this.http.get(Operations.EXPORT_LC);
    }

    getBillOfCollection(params?: any) {
        if (params) {
            let paramsSet = new HttpParams();

            if (params.lcRefNo) paramsSet = paramsSet.set('old_lc_number', params.lcRefNo);
            if (params.beneficiary) paramsSet = paramsSet.append('beneficiary', params.beneficiary);
            if (params.lc_amount) paramsSet = paramsSet.append('lc_amount', params.lc_amount);

            return this.http.get(Operations.GET_BILL_OF_COLLECTION, paramsSet);
        } else return this.http.get(Operations.GET_BILL_OF_COLLECTION);
    }
    getLCHistory(refNo: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', refNo);
        return this.http.get(Operations.GET_LC_HISTORY, paramsSet);
    }

    getBGHistory(refNo: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', refNo);
        return this.http.get(Operations.GET_BG_HISTORY, paramsSet);
    }

    getBGApprovrHistory(refNo: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', refNo);
        return this.http.get(Operations.GET_BG_APPRV_HISTORY, paramsSet);
    }

    getRecentlyCreatedLC(type: any, status: any) {
        if (type === 'LC') {
            if (status === 'AMEND') return this.http.get(Operations.GET_AMENDMENT_LC);
            else return this.http.get(Operations.GET_RECENTLY_CREATED_LC);
        } else {
            if (status === 'AMEND') return this.http.get(Operations.GET_AMENDMENT_BG);
            else return this.http.get(Operations.GET_RECENTLY_CREATED_BG);
        }
    }

    getFilterBgList(status: any, params: any) {
        if (status === 'AMEND') return this.http.get(Operations.GET_AMENDMENT_BG, params);
        else return this.http.get(Operations.GET_RECENTLY_CREATED_BG, params);
    }
    getLCDocumentArrivalNotice() {
        return this.http.get(Operations.GET_LC_DOCUMENT_ARRIVAL_NOTICE);
    }

    saveImportLC(postParams: any) {
        return this.http.post(Operations.IMPORT_LC_SAVE, postParams);
    }
    submitImportLC(postParams: any) {
        return this.http.post(Operations.IMPORT_LC_SUBMIT, postParams);
    }
    submitImportLCAmend(postParams: any) {
        return this.http.post(Operations.IMPORT_LC_AMEND_SUBMIT, postParams);
    }
    updateImportLC(postParams: any) {
        return this.http.post(Operations.IMPORT_LC_UPDATE, postParams);
    }
    uploadImportLC(postParams: any, queryParams: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('lcApplicationId', queryParams.lcApplicationId);
        return this.http.post(Operations.LC_HISTORY_UPLOAD, postParams, undefined, undefined, queryParams);
    }

    validateSwiftCode(queryParam: any) {
        return this.http.get(Operations.VALIDATE_SWIFT_CODE, queryParam);
    }
    previewLcPdf(params: any) {
        return this.http.post(Operations.PREVIEW_LC_PDF, params);
    }
    previewLcAmentPdf(params: any) {
        return this.http.post(Operations.PREVIEW_LC_AMEND_PDF, params);
    }

    checkAmendmentEligibility(refNo: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', refNo);
        return this.http.get(Operations.CHECK_AMENDMENT_ELIGIBILITY, paramsSet);
    }
    checkAmendmentEligibilityForLc(refNo: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('referenceNumber', refNo);
        return this.http.get(Operations.CHECK_AMENDMENT_ELIGIBILITY_FOR_LC, paramsSet);
    }
}
