import { Injectable } from '@angular/core';
import { TradeFinanceService } from './trade-finance.service';
import { UtilService } from 'src/app/utility/utility.service';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import * as moment from 'moment';
import { CacheService } from 'src/app/cache/cache.service';

@Injectable({
    providedIn: 'root',
})
export class TradeFinanceSandbox {
    public selectedBG: Observable<any>;
    public _selectedBG = new BehaviorSubject<any>({});
    public accountList: any = [];
    _lcRequest = new BehaviorSubject<any>(null);
    lcRequest: Observable<any>;
    filterPipe = new CIBDefinition();
    moduleSelected = new BehaviorSubject<any>({});
    constructor(private service: TradeFinanceService, private cache: CacheService, private utilService: UtilService) {
        this.selectedBG = this._selectedBG.asObservable();
        this.lcRequest = this._lcRequest.asObservable();
    }
    getImportLCSettings() {
        return this.service.getImportLCSettings();
    }

    getModule() {
        return this.moduleSelected.value;
    }

    setModule(data: any) {
        this.moduleSelected.next(data);
    }

    getCountries() {
        return this.service.getCountries();
    }

    getCurrencyList() {
        return this.service.getCurrencyList();
    }
    setLcRequest(data: any) {
        this._lcRequest.next(data);
    }

    saveORCreateBankGuarantee(payload: any) {
        return this.service.saveORCreateBankGuarantee(payload);
    }

    submitBankGuarantee(payload: any) {
        return this.service.submitBankGuarantee(payload);
    }

    previewBankGuarantee(payload: any) {
        return this.service.previewBankGuarantee(payload);
    }

    amendBankGuarantee(payload: any) {
        return this.service.amendBankGuarantee(payload);
    }

    bankGuaranteeAmendPreview(payload: any) {
        return this.service.bankGuaranteeAmendPreview(payload);
    }

    uploadBankGuaranteeFiles(formData: any, payload: any) {
        return this.service.uploadBankGuaranteeFiles(formData, payload);
    }

    deleteIndividualDocument(payload: any) {
        return this.service.deleteIndividualDocument(payload);
    }

    getBGDrafts(payload: any) {
        return this.service.getBGDrafts(payload);
    }

    deletebankGuarantee(payload: any) {
        return this.service.deletebankGuarantee(payload);
    }

    getLcDrafts() {
        return this.service.getLCDrafts();
    }

    deleteLcDrafts(referenceNumber: any) {
        return this.service.deleteLCDrafts(referenceNumber).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification('LC Draft deleted successfully !', 'success');
                }
            })
        );
    }

    exportLC(downloadType?: any) {
        if (downloadType && downloadType === 'excel') {
            return this.service.exportLC().pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatLCExportForExcel(res.data || []),
                            'Adviced_LC_Report'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.exportLC();
    }

    getLcHistory(refNo: any) {
        return this.service.getLCHistory(refNo);
    }

    getBgHistory(refNo: any) {
        return this.service.getBGHistory(refNo);
    }

    getBgApproveHistory(refNo: any) {
        return this.service.getBGApprovrHistory(refNo);
    }

    getBillOfCollection(downloadType?: any) {
        if (downloadType && downloadType === 'excel') {
            return this.service.getBillOfCollection().pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatBCListForExcel(res.data || []),
                            'BILL_FOR_COLLECTION_REPORT'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.getBillOfCollection();
    }

    filterBillOfCollection(payload: any) {
        return this.service.getBillOfCollection(payload);
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.utilService.downloadFile(res, fileName, fileType);
                this.utilService.displayNotification(`File generated successfully.`, 'success');
            })
        );
    }

    getFilterBgList(status: any, params: any) {
        return this.service.getFilterBgList(status, params);
    }

    getRecentlyCreatedLC(type: any, status: any, downloadType?: any) {
        if (downloadType && downloadType === 'excel') {
            return this.service.getRecentlyCreatedLC(type, status).pipe(
                tap((response: any) => {
                    if (response.data && response.data.length > 0) {
                        if (type === 'LC') {
                            if (status !== 'AMEND') {
                                response.data = response.data.filter(function (lc: any) {
                                    return (
                                        (lc.lcStatusBean.statusDesc !== 'ISSUED' &&
                                            lc.lcStatusBean.isAmendable === 'N') ||
                                        lc.lcStatusBean.isAmendable === 'Y'
                                    );
                                });
                            }

                            response.data.forEach((item: any) => {
                                item.lcBeneficiaryName = item.lcAdvicingBankDetails?.lcBeneficiaryName;
                                item.lcProductType = item.lcbasicDetails?.lcProductType;
                                item.lcExpiryDate = item.lcbasicDetails?.lcExpiryDate;
                                item.statusDesc = item.lcStatusBean?.statusDesc;
                                item.updated = item.updated || item.created;
                                item.lcAmount = item.lcbasicDetails?.lcAmount;
                            });
                        }
                        if (type === 'BG') {
                            if (status !== 'AMEND') {
                                response.data = response.data.filter(function (bg: any) {
                                    return (
                                        (bg.status.statusDesc !== 'ISSUED' && bg.status.isAmendable === 'N') ||
                                        bg.status.isAmendable === 'Y'
                                    );
                                });
                            }

                            response.data.forEach((item: any) => {
                                item.bankRef = item.id || item.bankRef;
                                item.statusDesc = item.status?.statusDesc;
                                item.updated = item.updated || item.created;
                                item.docLength = item.documents?.length;
                            });
                        }

                        if (status === 'AMEND') {
                            this.utilService.exportAsExcelFile(
                                this.formatLcBgAmendForExcel(type, response.data || []),
                                type + '_AMEND_REPORT'
                            );
                        } else {
                            this.utilService.exportAsExcelFile(
                                this.formatLcBgStatusForExcel(type, response.data || []),
                                type + '_STATUS_REPORT'
                            );
                        }

                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.getRecentlyCreatedLC(type, status);
    }

    getLCDocumentArrivalNotice(downloadType?: any) {
        if (downloadType && downloadType === 'excel') {
            return this.service.getLCDocumentArrivalNotice().pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatLCDocForExcel(res.data || []),
                            'LC_Document_Arrival_Notice'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.getLCDocumentArrivalNotice();
    }

    formatBCListForExcel(data: any) {
        const temps: any = [];
        data.forEach((value: any) => {
            let tempObject: any = {};
            tempObject.BCREFERENCE = value.applnId || value.lcRefNo;
            tempObject.TFREFERENCE = value.txnRefNo;
            tempObject.DRAWERNAME = value.lcAdvicingBankDetails?.lcBeneficiaryName;
            tempObject.CURRENCY = value.currency;
            tempObject.AMOUNT = value.amount;
            tempObject.TENOR = value.lcbasicDetails?.lcTenor;
            tempObject.ADVICEDON = value.issueDate;

            temps.push(tempObject);
        });
        return temps;
    }

    formatLcBgStatusForExcel(type: any, data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['REFERENCE No'] = res.txnRefNo || res.bankRef;
            if (type === 'LC') temp['LC REFERENCE'] = res.lcRefNo;
            else temp['BG REFERENCE'] = res.bgRefNo;
            temp['BENEFICIARYNAME'] = res.lcBeneficiaryName || res.beneficiaryName;
            temp['CURRENCY'] = res.currency;
            temp['AMOUNT'] = res.lcAmount || res.principalAmount;
            if (type === 'LC') temp['LC Type'] = res.lcProductType;
            else temp['BG TYPE'] = res.bgProductTypeText;
            temp['REQUEST DATE'] = moment(res.updated).format('YYYY-MM-DD hh:mm A');
            temp['EXPIRY DATE'] = res.lcExpiryDate || res.expiryDate;
            if (type === 'LC') temp['LC STATUS'] = res.statusDesc;
            else temp['BG STATUS'] = res.statusDesc;

            temps.push(temp);
        });
        return temps;
    }

    formatLCExportForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['QIB REFERENCE'] = res.lcRefNo;
            temp['LC REFERENCE'] = res.lcAdvicingBankDetails?.issBankRef;
            temp['APPLICANT NAME'] = res.lcAdvicingBankDetails.applicant;
            temp['ISSUING BANK NAME'] = res.lcAdvicingBankDetails?.issuingBank;
            temp['CURRENCY'] = res.lcbasicDetails?.lcCurrency;
            temp['AMOUNT'] = res.amount;
            temp['ISSUE DATE'] = moment(res.issueDate).format('YYYY-MM-DD hh:mm A');
            temp['EXPIRY DATE'] = res.lcbasicDetails?.lcExpiryDate;

            temps.push(temp);
        });
        return temps;
    }

    formatLcBgAmendForExcel(type: any, data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['REFERENCE NO'] = res.applnId || res.bankRef;

            if (type === 'LC') temp['LC REFERENCE'] = res.lcRefNo;
            else temp['BG REFERENCE'] = res.bgRefNo;
            temp['REQUEST DATE'] = moment(res.updated).format('YYYY-MM-DD hh:mm A');
            temp['BENEFICIARYNAME'] = res.lcBeneficiaryName || res.beneficiaryName;
            temp['CURRENCY'] = res.currency;
            temp['AMOUNT'] = res.lcAmount || res.principalAmount;
            temp['EXPIRY DATE'] = res.lcExpiryDate || res.expiryDate;
            if (type === 'LC') temp['LC STATUS'] = res.statusDesc;
            else temp['BG STATUS'] = res.statusDesc;

            temps.push(temp);
        });
        return temps;
    }

    formatLCDocForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['LODGEMENT NUMBER '] = res.lc_number;
            temp['LC REFERENCE '] = res.ld_limit_reference;
            temp['LC Type'] = res.lc_credit_type;
            temp['CURRENCY'] = res.draw_currency;
            temp['DOCUMENT AMOUNT'] = res.document_amount;
            temp['RECEIVED DATE'] = moment(res.value_date).format('YYYY-MM-DD hh:mm A');
            temp['REMARKS'] = res.discrepancy;

            temps.push(temp);
        });
        return temps;
    }
    saveImportLC(postParams: any) {
        return this.service.saveImportLC(postParams);
    }
    submitImportLC(postParams: any) {
        return this.service.submitImportLC(postParams);
    }
    submitImportLCAmend(postParams: any) {
        return this.service.submitImportLCAmend(postParams);
    }
    updateImportLC(postParams: any) {
        return this.service.updateImportLC(postParams);
    }
    uploadImportLC(postParams: any, queryParams: any) {
        return this.service.uploadImportLC(postParams, queryParams);
    }

    validateSwiftCode(queryParam: any) {
        return this.service.validateSwiftCode(queryParam);
    }

    previewLcPdf(queryParam: any) {
        return this.service.previewLcPdf(queryParam);
    }
    previewLcAmentPdf(queryParam: any) {
        return this.service.previewLcAmentPdf(queryParam);
    }

    checkAmendmentEligibility(refNum: any) {
        return this.service.checkAmendmentEligibility(refNum);
    }

    checkAmendmentEligibilityForLc(refNum: any) {
        return this.service.checkAmendmentEligibilityForLc(refNum);
    }
}
