import { Component, OnInit } from '@angular/core';

import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { BULK_KYC_UPLOAD_HEADER } from 'src/app/modules/transfers/constants/meta-data';
import { UtilService } from 'src/app/utility';
import {
    AbstractControl,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { KycRemediationSandbox } from './kyc-remediation.sandbox';

@Component({
    selector: 'app-kyc-remediation',
    templateUrl: './kyc-remediation.component.html',
    styleUrls: ['./kyc-remediation.component.scss'],
})
export class KycRemediationComponent implements OnInit {
    fileName: any = '';
    selectedFileType: any = 0;
    customHeaderList: any = [];
    kycData: any = [];
    currentDate = moment(new Date()).format('Do MMM, YYYY hh:mm A');
    todayDate = moment(new Date()).format('DD-MM-YYYY');
    splChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    public bulkUploadForm!: UntypedFormGroup;

    tableView: boolean = false;
    tableConfig: CIBTableConfig = {
        columns: BULK_KYC_UPLOAD_HEADER,
        data: [],
        selection: false,
        totalRecords: 0,
    };
    acceptFileType: string = '.xls,.xlsx,.ods,.csv';
    fileTypeLabel: string = 'Choose File[.XLSX or .CSV]';
    gridData: any = [];
    fileValid: boolean = false;
    btnView: boolean = false;
    bulkSampleExcelurl: any = 'assets/content/kyc-remediation-bulk-upload-sample.xlsx';

    constructor(
        private sandBox: KycRemediationSandbox,
        private utilService: UtilService,
        public fb: UntypedFormBuilder
    ) {
        this.bulkUploadForm = this.fb.group({
            fileName: [null, [Validators.required]],
        });
    }

    public specialCharactersCheck(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                let fileName = control.value.split('.');
                if (fileName.length >= 2) {
                    const minAmountflag = this.splChars.test(fileName[0]);
                    if (minAmountflag) {
                        return { splChrCheck: { value: control.value } };
                    }
                    if (this.acceptFileType.indexOf(fileName[1]) === -1) {
                        return { extCheck: { value: control.value } };
                    }
                }
            }
            return null;
        };
    }

    ngOnInit(): void {
        this.getKycRemediation();
    }

    getKycRemediation() {
        this.gridData = [];
        this.tableView = false;
        this.btnView = false;
        this.sandBox.getKycRemediation().subscribe((res: any) => {
            if (res.data) {
                this.gridData = res?.data;
            }

            this.tableConfig = {
                columns: BULK_KYC_UPLOAD_HEADER,
                data: this.gridData,
                selection: false,
                totalRecords: this.gridData.length,
                clientPagination: true,
            };
            this.tableView = true;
        });
    }

    onFileSelected(event: any): void {
        this.btnView = false;
        if (!event.target.files.length) {
            if (this.bulkUploadForm.get('fileName')?.value) {
                this.tableConfig.data = [];
            }
            return;
        }
        const file = event.target.files[0];
        this.tableView = false;
        this.bulkUploadForm.get('fileName')?.setValue(file.name);
        if (this.bulkUploadForm.valid)
            this.utilService.readFromExcel(file).subscribe((res: any) => {
                let keyKyc = Object.keys(res.data[0]);
                if (keyKyc.indexOf('CUSTOMER_NO') > -1) {
                    const fullPayload = res?.data.map((item: any) => {
                        return {
                            rimnumber: item.CUSTOMER_NO.toString(),
                            kycStatus: item.KYC_STATUS,
                            popType: item.POPUP_TYPE,
                        };
                    });
                    this.gridData = fullPayload.filter(
                        (obj: any, index: any) =>
                            fullPayload.findIndex((item: any) => item.uniqueUserId === obj.uniqueUserId) === index
                    );
                    this.mapData(this.gridData);
                    this.fileValid = false;
                } else {
                    this.bulkUploadForm.controls['fileName'].markAsTouched();
                    this.bulkUploadForm.controls['fileName'].setErrors({ incorrect: true });
                    this.fileValid = true;
                    this.gridData = [];
                }
            });
    }

    mapData(res: any) {
        this.tableConfig = {
            columns: BULK_KYC_UPLOAD_HEADER,
            data: res,
            selection: false,
            totalRecords: res.length,
            clientPagination: true,
        };
        this.tableView = true;
        this.btnView = true;
    }

    saveAsKyc() {
        let payload = {
            data: this.gridData,
        };

        this.sandBox.saveKycRemediation(payload).subscribe((response: any) => {
            this.utilService.displayNotification('KYC Saved Successfully', 'success');
            this.resetData();
        });
    }

    closekyc() {
        this.resetData();
    }

    resetData() {
        this.bulkUploadForm.reset();
        this.tableConfig = {
            ...this.tableConfig,
            data: [],
        };
        this.tableView = false;
        this.btnView = false;
        this.getKycRemediation();
    }

    downloadExcelFormat() {
        let link = document.createElement('a');
        link.download = 'Kyc-Remediation-bulk-Upload-Sample';
        link.href = this.bulkSampleExcelurl;
        link.click();
    }
}
