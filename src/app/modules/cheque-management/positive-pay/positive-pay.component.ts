import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isUndefined } from 'lodash';
import * as moment from 'moment';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { BulkUploadErrorsDialogComponent } from '../../transfers/components/bulk-upload-errors-dialog/bulk-upload-errors-dialog.component';
import { ChequeManagementSandbox } from '../cheque-management.sandbox';
import { ChequeSummaryComponent } from '../cheque-summary/cheque-summary.component';

@Component({
    selector: 'app-positive-pay',
    templateUrl: './positive-pay.component.html',
    styleUrls: ['./positive-pay.component.scss'],
})
export class PositivePayComponent implements OnInit {
    ppForm: FormGroup = new FormGroup({});
    fromAccounts: any[] = [];
    issueDate = null;
    dateVal = new Date();
    minDate = new Date(this.dateVal.getFullYear(), this.dateVal.getMonth() - 6, this.dateVal.getDate());
    maxDate = new Date(this.dateVal.getFullYear() + 2, this.dateVal.getMonth(), this.dateVal.getDate());
    totalValue = 0;
    totalRows = 0;
    transferData: any[] = [];

    ppType = 'single';
    transferBulkData: any[] = [];
    acceptFileType: string = '.xls,.xlsx,.ods,.csv';
    fileTypeLabel: string = 'Choose File[.XLSX or .CSV]';
    gridData: any = [];

    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'accountNo',
            displayName: 'Positive Pay Account Number',
            sortable: false,
        },
        {
            key: 'chequeNum',
            displayName: 'Cheque Number',
            sortable: false,
        },
        {
            key: 'amount',
            displayName: 'Cheque Amount',
            sortable: false,
        },
        {
            key: 'issueDate',
            displayName: 'Cheque Issue Date',
            sortable: false,
        },
    ];

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    bulkTransferSuccess = false;
    errorList: { index: number; errors: string[] }[] = [];

    @ViewChild('fileInput') fileInput!: HTMLInputElement;

    constructor(
        private _formBuilder: FormBuilder,
        private cmSandbox: ChequeManagementSandbox,
        private dialogService: CibDialogService,
        private util: UtilService
    ) {}

    ngOnInit(): void {
        this.initForm('single');

        this.cmSandbox.getPositivePayAccounts().subscribe((res: any) => {
            this.fromAccounts = this._parseAccount(res.data.positivePayAccounts);
        });
    }

    initForm(type: string) {
        if (type === 'single') {
            this.ppForm = this._formBuilder.group({
                payType: ['single', Validators.required],
                account: [null, Validators.required],
                chequeNum: [null, Validators.required],
                currency: [null, Validators.required],
                amount: [null, Validators.required],
                issueDate: [this.issueDate, Validators.required],
            });
        } else {
            this.ppForm = this._formBuilder.group({
                payType: ['bulk', Validators.required],
                fileName: [null, Validators.required],
            });
        }
    }

    private _parseAccount(accountList: any[]) {
        const accounts = accountList.map((acc) => {
            acc.account['accountNumber'] = acc.account?.accountNumber || acc.account?.account_no;
            acc.account['description'] = acc.account?.description || acc.account?.category?.description;
            acc.account['balance'] = acc.account?.available_bal || 0;
            return acc.account;
        });
        return accounts;
    }

    onChangePayType(value: any) {
        this.ppType = value;
        this.initForm(value);
        if (this.ppType === 'bulk') {
            this.removeFile();
        }
        this.ppForm.reset();
        this.ppForm.get('payType')?.setValue(value);
    }

    accountChange(ev: any) {
        this.ppForm.get('currency')?.setValue(ev.currency);
    }

    getIssueDate(ev: any) {
        this.issueDate = ev;
    }

    addTransfer() {
        const formValue = this.ppForm.getRawValue();
        const indvlTrnsfr: any = {};
        indvlTrnsfr.accountNo = formValue.account.accountNumber;
        indvlTrnsfr.currencyCode = formValue.currency;
        indvlTrnsfr.chequeNum = formValue.chequeNum;
        indvlTrnsfr.amount = formValue.amount;
        indvlTrnsfr.issueDate = this.issueDate;
        this.transferData.push(indvlTrnsfr);
        this.resetView();
    }

    removeTransfer(idx: number) {
        this.transferData.splice(idx, 1);
    }

    checkForTransferError() {
        let accAndCheqNumList: any = [];
        let totalErr = 0;
        this.transferData.forEach((td) => {
            this.totalRows++;
            this.totalValue += parseFloat(td.amount);
            //duplicate cheque number
            const accAndCheqNo = td.accountNo + '-' + td.chequeNum;
            if (accAndCheqNumList.indexOf(accAndCheqNo) !== -1) {
                totalErr++;
            }
            accAndCheqNumList.push(accAndCheqNo);
        });
        return totalErr > 0;
    }

    submitTransfer() {
        if (this.ppType === 'single') {
            if (this.ppForm.valid) {
                this.addTransfer();
            }

            if (!this.checkForTransferError()) {
                const data = {
                    positivePayData: this.transferData,
                    type: 'single',
                    action: 'VERIFY',
                    totalAmount: this.calTotal(),
                    validateOTPRequest: {},
                };

                this.submitForm('VERIFY', data);
            } else {
                this.cmSandbox.showError('Duplicate cheque number for same account');
            }
        } else {
            const data = {
                positivePayData: this.transferBulkData,
                type: 'bulk',
                action: 'VERIFY',
                totalAmount: this.totalValue,
                validateOTPRequest: {},
            };

            this.submitForm('VERIFY', data);
        }
    }

    submitForm(action: string, payload: any) {
        this.cmSandbox.addPositivePay(payload, action).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.getConsent(payload);
            } else {
                if (this.ppType === 'single') {
                    this.transferData = [];
                    this.resetView();
                } else {
                    this.removeFile();
                    this.bulkTransferSuccess = true;
                }
            }
        });
    }

    getConsent(payload: any) {
        let data: any = {};
        data = {
            headerName: 'POSITIVE PAY SUMMARY',
            isOtpNeeded: true,
            fields: payload,
        };

        const ref = this.dialogService.openDrawer(data.headerName, ChequeSummaryComponent, data);
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                this.submitForm('CONFIRM', res?.data);
            }
        });
    }

    resetView() {
        this.ppForm.reset();
        this.ppForm.get('payType')?.setValue('single');
    }

    calTotal() {
        let totalAmount = 0;
        this.transferData.forEach((td) => {
            totalAmount += parseFloat(td.amount);
        });
        return totalAmount;
    }

    onFileSelected(event: any): void {
        if (this.ppForm.get('fileName')?.value) {
            this.removeFile();
            this.tableConfig.data = [];
        }

        if (!event.target.files.length) return;
        const file = event.target.files[0];

        this.ppForm.get('fileName')?.setValue(file.name);
        this.util.readFromExcel(file).subscribe((res: any) => {
            this.gridData = res.data;

            this.setValuesAsRequired();
        });
    }

    removeFile() {
        this.ppForm.get('fileName')?.reset();
        this.totalRows = 0;
        this.totalValue = 0;
        this.gridData = [];
        this.transferBulkData = [];
        if (this.fileInput) {
            this.fileInput.value = '';
        }
        this.tableConfig = {
            ...this.tableConfig,
            data: [],
        };
    }

    setValuesAsRequired() {
        this.totalValue = 0;
        this.totalRows = 0;
        this.transferBulkData = [];
        this.errorList = [];

        if (this.gridData.length) {
            let accAndCheqNumList: any[] = [];
            const mandatoryFileFields = [
                'Positive Pay Account Number',
                'Cheque Number',
                'Cheque Amount',
                'Cheque Issue Date',
            ];
            const defaultDateFormat: string = 'DD/MM/YYYY';

            this.gridData.forEach((row: any, idx: number) => {
                this.totalRows++;

                mandatoryFileFields.forEach((field) => {
                    if (isUndefined(row[field]) || row[field] === '') {
                        this.addError(idx, field + ' is not available.');
                    }
                });

                // account check
                const validAccounts = this.fromAccounts.filter((al: any) => {
                    return (
                        al.account_no === row['Positive Pay Account Number'] ||
                        al.t24_iban === row['Positive Pay Account Number']
                    );
                });

                if (validAccounts.length === 0) {
                    this.addError(idx, 'Account is not registered for positive pay');
                }

                // date check
                if (
                    !(
                        moment(row['Cheque Issue Date'], defaultDateFormat, true).isValid() &&
                        moment(row['Cheque Issue Date'], defaultDateFormat).isAfter(moment().subtract(6, 'months'))
                    )
                ) {
                    this.addError(idx, 'Invalid date/ date format provided');
                }

                //duplicate cheque number
                const accAndCheqNo = row['Positive Pay Account Number'] + '-' + row['Cheque Number'];
                if (accAndCheqNumList.indexOf(accAndCheqNo) !== -1) {
                    this.addError(idx, 'Duplicate cheque number for same account');
                }
                accAndCheqNumList.push(accAndCheqNo);

                // set total amount
                this.totalValue += parseFloat(row['Cheque Amount']);

                // pushing individual transfers
                const indvlTrnsfr: any = {};
                indvlTrnsfr.accountNo = row['Positive Pay Account Number'];
                indvlTrnsfr.currencyCode = validAccounts[0]?.currency;
                indvlTrnsfr.chequeNum = row['Cheque Number'];
                indvlTrnsfr.amount = row['Cheque Amount'];
                indvlTrnsfr.issueDate = moment(row['Cheque Issue Date'], defaultDateFormat).format('DD-MM-YYYY');
                this.transferBulkData.push(indvlTrnsfr);
            });

            if (this.errorList.length > 0) {
                const ref = this.dialogService.openOverlayPanel(
                    'Bulk Upload Data Errors',
                    BulkUploadErrorsDialogComponent,
                    this.errorList,
                    CibDialogType.medium
                );

                ref.afterClosed().subscribe((result: any) => {
                    this.removeFile();
                });
            } else {
                this.tableConfig = {
                    columns: this.cols,
                    data: this.transferBulkData,
                    selection: false,
                    totalRecords: this.transferBulkData.length,
                    clientPagination: true,
                };
            }
        }
    }

    addError(idx: number, error: string) {
        if (this.errorList[idx]) {
            this.errorList[idx].errors.push(error);
        } else {
            this.errorList.push({ index: idx, errors: [error] });
        }
    }

    downloadExcelFormat() {
        let link = document.createElement('a');
        link.download = 'Bulk_Positive_Pay_Sample';
        link.href = 'assets/content/bulk-positive-pay-sample.xlsx';
        link.click();
    }
}
