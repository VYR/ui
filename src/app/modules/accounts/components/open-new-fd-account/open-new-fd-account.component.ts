import { Component, OnInit } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { AccountsSandbox } from '../../accounts.sandbox';
import { UtilService } from 'src/app/utility';
import { NewAccountViewComponent } from '../new-account-view/new-account-view.component';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';

@Component({
    selector: 'app-open-new-fd-account',
    templateUrl: './open-new-fd-account.component.html',
    styleUrls: ['./open-new-fd-account.component.scss'],
})
export class OpenNewFDAccountComponent implements OnInit {
    openNewAccountForm!: UntypedFormGroup;
    accountList: any = [];
    tenorList = ['1M', '3M', '6M', '12M', '24M', '36M', '60M'];
    epr: any;
    otp: string = '';
    curncy: any;
    tableConfig!: CIBTableConfig;
    investmentList: any = [];
    sortedData: any = [];
    filterPipe = new CIBDefinition();

    public cols = [
        {
            key: 'account_no',
            displayName: 'Account',
            sortable: true,
        },
        {
            key: 'current_balance',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'term',
            displayName: 'Tenor',
            sortable: true,
        },
        {
            key: 'sub_category',
            displayName: 'Expected Profit Rate',
            sortable: true,
        },
    ];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private sandBox: AccountsSandbox,
        private dialog: CibDialogService,
        private utilService: UtilService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.openNewAccountForm = this._formBuilder.group({
            account: [null, Validators.required],
            amount: [null, [Validators.required, this.minCheckAndRangCheck()]],
            tenor: [null, Validators.required],
        });
        this.getAccountsList();
        this.filterInvestmentList();
    }

    public generateExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.investmentList),
            'MUDARABA_TERM_DEPOSIT_ACCOUNTS'
        );
        this.utilService.displayNotification('Excel Generated successfully !', 'success');
    }

    formatDataForExcel(investmentList: any = []) {
        const temp: any = [];
        investmentList.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['Account No'] = ele.account_no;
            tempObject['Amount'] = ele.current_balance;
            tempObject['Tenor'] = ele.term;
            tempObject['Expected Profit Rate'] = ele.sub_category;
            temp.push(tempObject);
        });
        return temp;
    }

    public generatePdf() {
        let queryParams = {
            downloadType: 'pdf',
            product: 'MTD',
        };
        this.sandBox.getAccountDepositExtract(queryParams).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'MUDARABA_TERM_DEPOSIT_ACCOUNTS');
                this.utilService.displayNotification('PDF Generated successfully !', 'success');
            }
        });
    }

    public getAccountsList() {
        this.sandBox.getAccountsList('CMB_ACCOUNT').subscribe((res: any) => {
            if (res.data.accounts) {
                this.accountList = res.data.accounts;
                this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
                    if (res.data) {
                        const transactionAccCode = res.data.transactionAccounts;
                        this.filterAccountlist(transactionAccCode);
                    }
                });
            }
        });
    }

    public minCheckAndRangCheck(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const minAmountflag = control.value < 10000;
                const MulAmountflag = Math.floor(control.value % 5000) >= 1;
                if (minAmountflag) {
                    return { minimunCheck: { value: control.value } };
                }
                if (MulAmountflag) {
                    return { multiple: { value: control.value } };
                }
            }
            return null;
        };
    }

    filterAccountlist(codes: any[]) {
        let validCur = ['QAR', 'USD'];
        this.accountList = this.accountList.filter(function (al: any) {
            return (
                codes.indexOf(al.category.transactionRef) !== -1 &&
                validCur.indexOf(al.currency) !== -1 &&
                parseFloat(al.available_bal) > 10000
            );
        });
    }

    filterInvestmentList() {
        this.sandBox.getAccountsList('CMB_DEPOSIT').subscribe((response: any) => {
            if (response.data.accounts) {
                this.investmentList = response.data.accounts;
                this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
                    if (res.CMB_DEPOSITS) {
                        const depositCdAccCode = res.CMB_DEPOSITS['FIXED DEPOSIT'];
                        this.investmentList = this.investmentList.filter((item: any) => {
                            if (depositCdAccCode.indexOf(item.category.transactionRef) != -1) {
                                item.sub_category = item.sub_category + '%';
                                item.sortTerm = Number(item.term.substring(0, item.term.length - 1));
                                item.term = this.filterPipe.transform(item.term, 'TENOR');
                                item.current_balance = Number(item.current_balance);
                                return true;
                            } else return false;
                        });

                        this.sortedData = this.investmentList;
                        this.loadDataTable();
                    }
                });
            }
        });
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.sortedData,
            selection: false,
            totalRecords: this.sortedData.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            event.sortKey = event.sortKey === 'term' ? 'sortTerm' : event.sortKey;
            this.sortedData = this.investmentList.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onAccountChange(event: any, acc: any) {
        if (event.isUserInput) {
            this.openNewAccountForm.controls['amount'].reset();
            this.curncy = acc.currency;
        }
    }

    opnAccount(action: string) {
        const data = {
            debitAccountNumber: this.openNewAccountForm.get('account')?.value,
            currency: this.curncy,
            principalAmount: this.openNewAccountForm.get('amount')?.value,
            tenor: this.openNewAccountForm.get('tenor')?.value,
            autoRollOver: true,
            type: 'N',
            expectedProfitRate: this.epr,
            action: action,
            validateOTPRequest: this.otp ? { softTokenUser: false, otp: this.otp } : {},
        };
        this.sandBox.openFdAccount(data).subscribe((response: any) => {
            if (response.data) {
                if (action === 'VERIFY') {
                    setTimeout(() => {
                        this.epr = response.data.epr;
                        this.openSidePanel();
                    }, 850);
                } else {
                    if (response.data.requestId) {
                        this.utilService.displayNotification(
                            'Request has been sent for approval. Request ID: #' + response.data.requestId,
                            'success'
                        );
                    } else {
                        this.utilService.displayNotification(
                            'Mudaraba Term Deposit Account created Successfully. Transaction ID : #' + response.data,
                            'success'
                        );
                    }
                    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['home/accounts/open-new-fd-account']);
                    });
                }
            }
        });
    }

    openSidePanel() {
        let fieldInfo = [
            { fieldName: 'Debit Account', fieldValue: this.openNewAccountForm.get('account')?.value },
            { fieldName: 'Currency', fieldValue: this.curncy },
            { fieldName: 'MTD Amount', fieldValue: this.openNewAccountForm.get('amount')?.value },
            {
                fieldName: 'MTD Tenor',
                fieldValue: this.openNewAccountForm.get('tenor')?.value,
                pipeName: 'tenor',
            },
            { fieldName: 'Expected Profit Rate', fieldValue: this.epr + '%' },
            { fieldName: 'Perpetual Auto Rollover', fieldValue: 'YES' },
            { fieldName: 'Auto rollover principal', fieldValue: this.openNewAccountForm.get('amount')?.value },
        ];

        let data = {
            headerName: 'Open MTD account',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(`Request Summary - ${data.headerName}`, NewAccountViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.otp = result.data;
                this.opnAccount('CONFIRM');
            }
        });
    }
}
