import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as moment from 'moment';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { BULK_UPLOAD_HEADER, FILE_TYPES } from '../../constants/meta-data';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { TransferSandbox } from '../../transfers.sandbox';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { ExchangeRatePopupComponent } from '../exchange-rate-popup/exchange-rate-popup.component';
import { BulkUploadSummaryComponent } from '../bulk-upload-summary/bulk-upload-summary.component';
import { UtilService } from 'src/app/utility/utility.service';
import { SCREEN_MODE } from 'src/app/shared/enums';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent implements OnInit {
    @Input() bulkDraftData: any;
    public fileType = FILE_TYPES;
    showCustomFileType: boolean = false;
    hasAccesToKey: boolean = false;
    currentDate = moment(new Date()).format('Do MMM, YYYY hh:mm A');
    todayDate = moment(new Date()).format('DD-MM-YYYY');
    public bulkUploadForm!: UntypedFormGroup;
    tableConfig: CIBTableConfig = {
        columns: BULK_UPLOAD_HEADER,
        data: [],
        selection: false,
        totalRecords: 0,
    };
    bulkSampleExcelurl: any = 'assets/content/bulk-transfer-sample.xlsx';
    custPaymentdateFormat: any;
    currency = 'QAR';
    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    fileName: any = '';
    selectedFileType: any = 0;
    defaultFileType = 1;
    supportingDocCurrencyList: any = [];
    excelData: any = {
        totalRecords: 0,
        fileName: null,
        data: [],
        totalAmount: 0,
    };
    transferSuccess: boolean = false;
    mode: SCREEN_MODE = SCREEN_MODE.CREATE;
    SCREEN_MODE = SCREEN_MODE;
    title!: string;
    requestId!: string;
    draftId!: string;
    acceptFileType: string = '.xls,.xlsx,.ods,.csv';
    fileTypeLabel: string = 'Choose File[.XLSX or .CSV]';

    constructor(
        public fb: UntypedFormBuilder,
        public sandBox: TransferSandbox,
        private dialog: CibDialogService,
        private utilService: UtilService
    ) {
        this.bulkUploadForm = this.fb.group({
            fileName: [null],
            date: [null],
            remarks: [null],
        });
    }

    ngOnInit(): void {
        this.hasAccesToKey = this.sandBox.h2hEnabled;
        this._setDataForBulkDraft();
    }

    _setDataForBulkDraft() {
        this.sandBox.selectedBulkDraft.subscribe((res: any) => {
            this.draftId = res.uid;
            this.mode = res?.drafts?.data?.length > 0 ? SCREEN_MODE.EDIT : SCREEN_MODE.CREATE;
            if (res?.drafts?.data?.length > 0) {
                this.mapData(res.drafts);
            }
        });
    }

    onFileSelected(event: any): void {
        if (!event.target.files.length) return;
        this.bulkUploadForm.patchValue({ date: this.currentDate });
        if (this.selectedFileType === 0 || this.selectedFileType === 1) {
            this.uploadStandardAndCustomFile(event.target.files[0]);
        } else if (this.selectedFileType === 2 || this.selectedFileType === 3 || this.selectedFileType === 4) {
            this.uploadTXTandXMLfile(event.target.files[0]);
        }
    }

    uploadStandardAndCustomFile(file: any) {
        this.utilService.startSpinner();
        this.sandBox.uploadData(file, this.selectedFileType).subscribe((res: any) => {
            this.utilService.stopSpinner();
            this.mapData(res);
        });
    }

    mapData(res: any) {
        this.excelData = res;
        this.fileName = res.fileName;
        this.bulkUploadForm.patchValue({
            fileName: res.data.length > 0 ? res.fileName : '',
            date: res.data.length > 0 ? this.currentDate : '',
        });
        this.tableConfig = {
            columns: BULK_UPLOAD_HEADER,
            data: res.data,
            selection: false,
            totalRecords: res.totalRecords,
            clientPagination: true,
        };
    }

    uploadTXTandXMLfile(selectedfile: any) {
        this.utilService.startSpinner();
        this.sandBox.uploadTXTandXMLfile(selectedfile, this.selectedFileType).subscribe((data: any) => {
            data.subscribe((res: any) => {
                this.utilService.stopSpinner();
                this.mapData(res);
            });
        });
    }

    downloadDoc() {
        this.sandBox.fetchKey().subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'H2H Encrypted Key');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    onChange($event: MatSlideToggleChange) {
        this.showCustomFileType = $event.checked;
        $event.checked ? (this.selectedFileType = 1) : (this.selectedFileType = 0);
        this.setFormlableAndAcceptFileType();
        this.resetData();
    }

    setFormlableAndAcceptFileType() {
        switch (this.selectedFileType) {
            case 0:
            case 1: {
                this.acceptFileType = '.xls,.xlsx,.ods,.csv';
                this.fileTypeLabel = 'Choose File[.XLSX or .CSV]';
                break;
            }
            case 2:
            case 3: {
                this.acceptFileType = '.txt';
                this.fileTypeLabel = 'Choose File[.TXT]';
                break;
            }
            case 4: {
                this.acceptFileType = '.xml';
                this.fileTypeLabel = 'Choose File[.XML]';
                break;
            }
            default: {
                this.acceptFileType = '.xls,.xlsx,.ods,.csv';
                this.fileTypeLabel = 'Choose File[.XLSX or .CSV]';
                break;
            }
        }
    }

    switchFileType(event: any) {
        this.selectedFileType = event.value;
        this.setFormlableAndAcceptFileType();
    }

    /*show rates of all the foreign currency transfers */
    showRates() {
        const ref = this.dialog.openDialog(CibDialogType.small, ExchangeRatePopupComponent, this.excelData.exDetails);
        ref.afterClosed().subscribe((result: any) => {});
    }

    resetData() {
        this.bulkUploadForm.reset();
        this.tableConfig = {
            ...this.tableConfig,
            data: [],
        };
    }

    validateTransfer() {
        this.excelData.data.map((value: any) => {
            let benefBankCountry = value['Beneficiary Bank Country']?.toString()?.toUpperCase() || '';
            let pymtCurr = value['Payment Currency']?.toString()?.toUpperCase() || '';
            let clearingCode = value['Clearing Code']?.toString() || '';
            if (benefBankCountry === 'IN' && pymtCurr === 'INR') {
                value.ifscCode = clearingCode;
            } else if (benefBankCountry === 'US' && pymtCurr === 'USD') {
                value.fedwire = clearingCode;
            } else if (benefBankCountry === 'CA' && pymtCurr === 'CAD') {
                value.transitNo = clearingCode;
            } else if (benefBankCountry === 'AU' && pymtCurr === 'AUD') {
                value.bsbNo = clearingCode;
            } else {
                value.swiftCode = value['Beneficiary Bank SWIFT CODE']?.toString() || '';
            }
        });
        this.initiateBulkTransfer(this.excelData.data);
    }

    private _stringifyTransferData(data: any) {
        (data || []).forEach((x: any) => {
            Object.entries(x).forEach((entry: any) => (x[entry[0]] = String(entry[1])));
        });
        return data;
    }

    initiateBulkTransfer(dataToTransfer: any) {
        let payLoad = {
            headerName: 'Bulk Upload Summary',
            isOtpNeeded: true,
            action: 'VERIFY',
            validateOTPRequest: {},
            filename: this.excelData.fileName,
            fileUploadDate: this.currentDate,
            totalAmount: this.excelData.totalAmount,
            fxTransaction: this.excelData.fxTransactionCount > 0 ? true : false,
            thresholdExceeded: this.excelData.thresholdCount > 0 ? true : false,
            fileJSON: this._stringifyTransferData(dataToTransfer),
            date: this.todayDate,
            backDate: this.excelData.backDate.format('DD-MM-YYYY'),
            transferType: this.selectedFileType,
            currency: this.currency,
            desc: this.bulkUploadForm.controls['remarks'].value,
            exchangeRate: this.excelData.exDetails,
            userFileName: this.fileName,
        };
        this.sandBox.initiateBulkTransfer(payLoad).subscribe((response: any) => {
            const ref = this.dialog.openDrawer(payLoad.headerName, BulkUploadSummaryComponent, payLoad);
            ref.afterClosed().subscribe((result) => {
                if (result.event === 'confirm') {
                    let payload = {
                        fileJSON: this._stringifyTransferData(dataToTransfer),
                        date: this.todayDate,
                        backDate: this.excelData.backDate.format('DD-MM-YYYY'),
                        transferType: this.selectedFileType,
                        currency: this.currency,
                        desc: this.bulkUploadForm.controls['remarks'].value,
                        action: 'CONFIRM',
                        totalAmount: this.excelData.totalAmount,
                        validateOTPRequest: result.otp,
                        exchangeRate: this.excelData.exDetails,
                        userFileName: this.fileName,
                    };
                    this.sandBox.initiateBulkTransfer(payload).subscribe((response: any) => {
                        this.resetData();
                        if (response.data.requestId || response.status === 'APPROVAL_REQUESTED') {
                            this.transferSuccess = true;
                            this.requestId = 'Request ID: #' + response.data.requestId;
                            this.title = 'YOUR TRANSFER REQUEST HAS BEEN SENT FOR APPROVAL';
                        } else {
                            this.transferSuccess = true;
                            this.requestId = 'Reference No: #' + response.data.referenceNumber;
                            this.title = 'YOUR TRANSFER REQUEST HAS CREATED SUCCESSFULLY';
                        }
                        if (this.draftId != undefined) {
                            this.sandBox.deleteDraftsRequest(this.draftId).subscribe((res) => {});
                        }
                    });
                }
            });
        });
    }

    saveAsDraft() {
        let payload = {
            type: 'bulk',
            data: [
                {
                    date: new Date(),
                    desc: this.bulkUploadForm.controls['remarks'].value || '',
                    fileName: this.fileName,
                    totalValue: this.excelData.totalAmount,
                    currency: this.currency,
                    transferType: this.selectedFileType,
                    userFileName: this.fileName
                        .toString()
                        .split(/(\\|\/)/g)
                        .pop(),
                },
            ],
        };
        this.sandBox.saveBulkDrafts(payload).subscribe((response: any) => {
            this.utilService.displayNotification('Draft Saved Successfully', 'success');
            this.resetData();
        });
    }

    closeTransferSuccess() {
        this.transferSuccess = false;
    }

    closeBulkDraft() {
        this.mode = SCREEN_MODE.CREATE;
        this.resetData();
    }

    downloadExcelFormat() {
        let link = document.createElement('a');
        link.download = 'Bulk-Transfer-Sample';
        link.href = this.bulkSampleExcelurl;
        link.click();
    }

    ngOnDestroy() {
        this.sandBox.clearDraftData([]);
    }
}
