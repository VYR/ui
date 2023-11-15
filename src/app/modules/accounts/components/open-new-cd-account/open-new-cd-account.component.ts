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
import { NewAccountViewComponent } from '../new-account-view/new-account-view.component';
import { UtilService } from 'src/app/utility';
import { UserContext } from 'src/app/shared/models';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
    selector: 'app-open-new-cd-account',
    templateUrl: './open-new-cd-account.component.html',
    styleUrls: ['./open-new-cd-account.component.scss'],
})
export class OpenNewCDAccountComponent implements OnInit {
    openNewAccountForm!: UntypedFormGroup;
    accountList: any = [];
    tenorListCd = ['12M', '24M'];
    epr: any;
    otp: string = '';
    curncy: any;
    tableConfig!: CIBTableConfig;
    investmentList: any = [];
    sortedData: any = [];
    user!: UserContext;
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
        private router: Router,
        private appContext: ApplicationContextService
    ) {}

    ngOnInit(): void {
        this.openNewAccountForm = this._formBuilder.group({
            account: [null, Validators.required],
            amount: [null, [Validators.required, this.minCheckAndRangCheck()]],
            tenor: [null, Validators.required],
        });
        this.appContext.currentUser.subscribe((user: UserContext) => {
            this.user = user;
        });
        this.getAccountsList();
        this.filterInvestmentList();
    }

    public minCheckAndRangCheck(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const minAmount = this.curncy === 'QAR' ? 100000 : 25000;
                const minMulAmount = this.curncy === 'QAR' ? 20000 : 5000;

                const minAmountflag = control.value < minAmount;
                const MulAmountflag = Math.floor(control.value % minMulAmount) >= 1;
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

    loadDataTable() {
        let emailcol = {
            key: 'email',
            displayName: 'Email',
            type: ColumnType.icon,
            icon: 'la-paper-plane',
        };
        let colArray = [...this.cols, emailcol];
        this.tableConfig = {
            columns: colArray,
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

    public onClickCell(event: any) {
        if (event.key === 'email') {
            const payLoad = {
                amount: event.data['current_balance'],
                currency: event.data['currency'],
                customerEmail: this.user.email,
                customerName: this.user.firstName + ' ' + this.user.lastName,
                debitAccountNumber: event.data['account_no'],
                expectedProfitRate: event.data['sub_category'],
                issuedOn: event.data['create_date'],
                tenor: this.filterPipe.transform(event.data['term'], 'TENOR'),
            };
            this.sandBox.sendEmail(payLoad).subscribe((response: any) => {
                if (response.status === 'SUCCESS') {
                    this.utilService.displayNotification('Email has been sent successfully !', 'success');
                }
            });
        }
    }

    filterAccountlist(codes: any[]) {
        let validCur = ['QAR', 'USD'];
        this.accountList = this.accountList.filter(function (al: any) {
            return (
                codes.indexOf(al.category.transactionRef) !== -1 &&
                validCur.indexOf(al.currency) !== -1 &&
                ((al.currency === 'QAR' && parseFloat(al.available_bal) > 100000) ||
                    (al.currency === 'USD' && parseFloat(al.available_bal) > 5000))
            );
        });
    }

    filterInvestmentList() {
        this.sandBox.getAccountsList('CMB_DEPOSIT').subscribe((response: any) => {
            if (response.data.accounts) {
                this.investmentList = response.data.accounts;
                this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
                    if (res.CMB_DEPOSITS) {
                        const depositCdAccCode = res.CMB_DEPOSITS['CERTIFICATE OF DEPOSIT'];
                        this.investmentList = this.investmentList.filter((item: any) => {
                            if (depositCdAccCode.indexOf(item.category.transactionRef) != -1) {
                                const term = item.category.transactionRef === '21029' ? '12M' : '24M';
                                item.sortTerm = Number(term.substring(0, term.length - 1));
                                item.term = this.filterPipe.transform(term, 'TENOR');
                                item.sub_category = item.sub_category + '%';
                                item.current_balance = Number(item.current_balance);
                                return true;
                            }
                            return false;
                        });
                        this.sortedData = this.investmentList;
                        this.loadDataTable();
                    }
                });
            }
        });
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
            principalAmount: parseFloat(this.openNewAccountForm.get('amount')?.value),
            tenor: this.openNewAccountForm.get('tenor')?.value,
            type: 'C',
            expectedProfitRate: this.epr,
            action: action,
            validateOTPRequest: this.otp ? { softTokenUser: false, otp: this.otp } : {},
        };
        //add loader
        this.sandBox.openCdAccount(data).subscribe((response: any) => {
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
                            'Certificate Of Deposit Account created Successfully. Transaction ID : #' + response.data,
                            'success'
                        );
                    }
                    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['home/accounts/open-new-cd-account']);
                    });
                }
            }
        });
    }

    public generateExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.investmentList),
            'CERTIFICATE_OF_DEPOSIT_ACCOUNTS'
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
            product: 'CD',
        };
        this.sandBox.getAccountDepositExtract(queryParams).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'CERTIFICATE_OF_DEPOSIT_ACCOUNTS');
                this.utilService.displayNotification('PDF Generated successfully !', 'success');
            }
        });
    }

    openSidePanel() {
        let fieldInfo = [
            { fieldName: 'Debit Account', fieldValue: this.openNewAccountForm.get('account')?.value },
            { fieldName: 'Currency', fieldValue: this.curncy },
            { fieldName: 'CD Amount', fieldValue: this.openNewAccountForm.get('amount')?.value },
            { fieldName: 'CD Tenor', fieldValue: this.openNewAccountForm.get('tenor')?.value, pipeName: 'tenor' },
            { fieldName: 'Email ID', fieldValue: this.user.email },
            { fieldName: 'Expected Profit Rate', fieldValue: this.epr + '%' },
        ];

        let data = {
            headerName: 'Open CD Account',
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
