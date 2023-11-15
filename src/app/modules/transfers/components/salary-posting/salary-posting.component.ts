import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isUndefined } from 'lodash';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { SalaryPostingSummaryComponent } from './components/salary-posting-summary/salary-posting-summary.component';
import { SalaryPostingErrorDialogComponent } from './components/salary-posting-error-dialog/salary-posting-error-dialog.component';
import { SalaryPostingSandbox } from './salary-posting.sandbox';
import { SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';
@Component({
    selector: 'app-salary-posting',
    templateUrl: './salary-posting.component.html',
    styleUrls: ['./salary-posting.component.scss'],
})
export class SalaryPostingComponent implements OnInit {
    spForm: FormGroup = new FormGroup({});
    fromAccounts: any[] = [];
    fromAccount: any;
    totalAmount = 0;
    totalRows = 0;
    salaryRequestData: any[] = [];
    salaryRequestTableData: any[] = [];
    acceptFileType: string = '.xls,.xlsx,.ods,.csv';
    fileTypeLabel: string = 'Choose File[.XLSX or .CSV]';
    gridData: any = [];
    SALARY_POSTING_COLUMNS = SALARY_POSTING_COLUMNS;
    tableConfig!: CIBTableConfig;
    isExcelDataLoaded = false;
    errorList: { index: number; errors: string[] }[] = [];
    @ViewChild('fileInput') fileInput!: HTMLInputElement;
    splChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    onlyEnglish = /^[A-Za-z\d\s]+$/;
    currentUser!: UserContext;
    public cols = [
        {
            key: 'debitAccountNumber',
            displayName: SALARY_POSTING_COLUMNS.DR_AC,
            sortable: false,
        },
        {
            key: 'amount',
            displayName: SALARY_POSTING_COLUMNS.AMOUNT,
            sortable: false,
            type: ColumnType.amount,
        },
        {
            key: 'creditAccountNo',
            displayName: SALARY_POSTING_COLUMNS.CR_AC,
            sortable: false,
        },
        {
            key: 'creditName',
            displayName: SALARY_POSTING_COLUMNS.CR_NAME,
            sortable: false,
        },
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private sandbox: SalaryPostingSandbox,
        private dialogService: CibDialogService,
        private appContext: ApplicationContextService,
        private util: UtilService
    ) {
        this.appContext.currentUser.subscribe((res: any) => (this.currentUser = res));
    }

    ngOnInit(): void {
        console.log(this.currentUser);
        this.spForm = this._formBuilder.group({
            fileName: [null, [Validators.required, this.specialCharactersCheck()]],
            fromAccount: [null, Validators.required],
        });

        this.sandbox.getFromAccountsList().subscribe((res: any) => {
            this.fromAccounts = this._parseAccounts(res.data.accounts) || [];
        });
    }

    private _parseAccounts(accounts: Array<any>) {
        accounts.map((x: any) => {
            x.balance = x.available_bal;
            x.accountNumber = x.t24_iban || x.iban || x.accountNo;
            x.description = (x.category && x.category.description) || x.nickName;
        });
        let validCur = ['QAR'];
        accounts = accounts.filter(function (al: any) {
            return validCur.indexOf(al.currency) !== -1;
        });
        return accounts;
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
                    const onlyEnglish = this.onlyEnglish.test(fileName[0]);
                    if (!onlyEnglish) {
                        return { onlyEnglish: { value: control.value } };
                    }
                    if (this.acceptFileType.indexOf(fileName[1]) === -1) {
                        return { extCheck: { value: control.value } };
                    }
                }
            }
            return null;
        };
    }

    onChangeFromAccount(fromAccount: any) {
        this.fromAccount = fromAccount;
        this.removeFile();
    }

    submitTransfer() {
        const formObj = this.spForm.value;
        const data = {
            action: 'VERIFY',
            amount: this.totalAmount,
            validateOTPRequest: {},
            debitAccountNumber: formObj.fromAccount.t24_iban,
            fileName: formObj.fileName,
            maker: this.currentUser.userName,
            status: 'POSTED',
            salaryPostingEntry: this.salaryRequestData,
        };
        this.submitForm('VERIFY', data);
    }

    submitForm(action: string, payload: any) {
        this.sandbox.addSalaryPostingData(payload, action).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.getConsent(payload);
            } else {
                this.removeFile();
                this.isExcelDataLoaded = true;
                this.spForm.reset();
                this.tableConfig.data = [];
            }
        });
    }

    getConsent(payload: any) {
        let data: any = {};
        data = {
            headerName: 'SALARY POSTING SUMMARY',
            isOtpNeeded: true,
            fields: payload,
        };

        const ref = this.dialogService.openDrawer(data.headerName, SalaryPostingSummaryComponent, data);
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                this.submitForm('CONFIRM', res?.data);
            }
        });
    }

    onFileSelected(event: any): void {
        if (!event.target.files.length) {
            if (this.spForm.get('fileName')?.value) {
                this.removeFile();
                this.tableConfig.data = [];
            }
            return;
        }
        const file = event.target.files[0];
        this.isExcelDataLoaded = true;
        this.spForm.get('fileName')?.setValue(file.name);
        if (this.spForm.valid)
            this.util.readFromExcel(file).subscribe((res: any) => {
                this.gridData = res.data;
                this.isExcelDataLoaded = false;
                this.setValuesAsRequired();
            });
    }

    removeFile() {
        this.spForm.get('fileName')?.reset();
        this.totalRows = 0;
        this.totalAmount = 0;
        this.gridData = [];
        this.salaryRequestData = [];
        this.salaryRequestTableData = [];
        if (this.fileInput) {
            this.fileInput.value = '';
        }
        this.tableConfig = {
            ...this.tableConfig,
            data: [],
        };
    }
    throwDataErrors() {
        const ref = this.dialogService.openOverlayPanel(
            'Salary Posting Data Errors',
            SalaryPostingErrorDialogComponent,
            this.errorList,
            CibDialogType.medium
        );

        ref.afterClosed().subscribe((result: any) => {
            this.removeFile();
        });
    }
    setValuesAsRequired() {
        this.totalAmount = 0;
        this.totalRows = 0;
        this.salaryRequestData = [];
        this.salaryRequestTableData = [];
        this.errorList = [];

        if (this.gridData.length) {
            const mandatoryFileFields = [
                SALARY_POSTING_COLUMNS.AMOUNT,
                SALARY_POSTING_COLUMNS.CR_NAME,
                SALARY_POSTING_COLUMNS.CR_AC,
            ];
            const defaultDateFormat: string = 'DD-MM-YYYY';
            this.gridData.forEach((row: any, idx: number) => {
                this.totalRows++;
                //mandatory fields check
                mandatoryFileFields.forEach((field) => {
                    if (isUndefined(row[field]) || row[field] === '') {
                        this.addError(idx, field + ' is not available.');
                    }
                });
                //Special chars check
                mandatoryFileFields.forEach((field) => {
                    if (field !== SALARY_POSTING_COLUMNS.AMOUNT && this.splChars.test(row[field])) {
                        this.addError(idx, field + ' has special characters.');
                    }
                });
                //English chars check
                if (!this.onlyEnglish.test(row[SALARY_POSTING_COLUMNS.CR_NAME])) {
                    this.addError(idx, SALARY_POSTING_COLUMNS.CR_NAME + ' has Non-English characters.');
                }
                //Amount format check
                if (isNaN(row[SALARY_POSTING_COLUMNS.AMOUNT])) {
                    this.addError(idx, SALARY_POSTING_COLUMNS.AMOUNT + ' not entered in the correct amount format.');
                }
                if (row[SALARY_POSTING_COLUMNS.CR_AC].toString().indexOf('QISB') === -1) {
                    this.addError(
                        idx,
                        'Please provide a valid QIB IBAN number in column ' + SALARY_POSTING_COLUMNS.CR_AC
                    );
                }
                // set total amount
                this.totalAmount += parseFloat(row[SALARY_POSTING_COLUMNS.AMOUNT]);
                // pushing individual rows
                const indvlRows: any = {};
                indvlRows.amount = row[SALARY_POSTING_COLUMNS.AMOUNT];
                indvlRows.creditName = row[SALARY_POSTING_COLUMNS.CR_NAME];
                indvlRows.creditAccountNo = row[SALARY_POSTING_COLUMNS.CR_AC];
                this.salaryRequestData.push(indvlRows);
                let tblData: any = { ...indvlRows, ...{ debitAccountNumber: this.fromAccount.t24_iban } };
                this.salaryRequestTableData.push(tblData);
            });
            this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
            if (this.errorList.length > 0) {
                this.throwDataErrors();
            } else {
                this.tableConfig = {
                    columns: this.cols,
                    data: this.salaryRequestTableData,
                    selection: false,
                    totalRecords: this.salaryRequestTableData.length,
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
        link.download = 'SalaryPostingSample';
        link.href = 'assets/content/SalaryPosting.xlsx';
        link.click();
    }
}
