import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { AccountsSandbox } from '../../accounts.sandbox';
import { AccountStatementQuery } from '../../models/account-statement-query.model';
import * as moment from 'moment';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { AccountTransationsDetailsComponent } from '../account-transactions-details/account-transactions-details.component';
import { UtilService } from 'src/app/utility/utility.service';

@Component({
    selector: 'app-account-details',
    templateUrl: './account-details.component.html',
    styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
    @Input() selectedAccount: any = [];
    @ViewChild('menuTrigger') trigger: any;
    public today = new Date();
    public minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate());
    public maxDate = new Date();

    accountsSummary: any = [];
    public isCIBTransactionalAccount: boolean = false;
    public query = new AccountStatementQuery();
    public filterstatementForm!: FormGroup;

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    searchFilterApplied: boolean = false;
    tableConfig!: CIBTableConfig;
    constructor(
        private router: Router,
        public sandBox: AccountsSandbox,
        public fb: FormBuilder,
        private dialog: CibDialogService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.filterstatementForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
            credit: [''],
            debit: [''],
            txnReference: [''],
        });
    }

    ngOnChanges() {
        this.tableConfig = Object.assign(
            {},
            {
                columns: [
                    {
                        key: 'valueDate',
                        displayName: 'DATE',
                        type: ColumnType.date,
                        sortable: true,
                    },
                    {
                        key: 'txnReference',
                        displayName: 'REFERENCE NUMBER',
                        type: ColumnType.link,
                        sortable: true,
                    },
                    {
                        key: 'currency',
                        displayName: 'CURRENCY',
                    },
                    {
                        key: 'credit',
                        displayName: 'CREDIT AMT',
                        type: ColumnType.amount,
                        sortable: true,
                    },
                    {
                        key: 'debit',
                        displayName: 'DEBIT AMT',
                        type: ColumnType.amount,
                        sortable: true,
                    },
                ],
                data: [],
                selection: false,
                totalRecords: 0,
            }
        );
        this.resetTheSearchCriteria();
        this.isCIBTransactionalAccount =
            this.sandBox.transactionAndPaymentAccountsCodes.indexOf(this.selectedAccount?.category.transactionRef) !==
            -1;
    }

    resetTheSearchCriteria() {
        if (this.filterstatementForm) this.filterstatementForm.reset();
        this.searchFilterApplied = false;
        this.lazyLoad(new CIBTableQuery());
    }

    lazyLoad(query: CIBTableQuery) {
        this.queryParams = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            sortKey: query.sortKey,
            sortDirection: query.sortDirection,
        };
        this.getTransactionsForAccounts(this.queryParams);
    }

    getTransactionsForAccounts(queryParams: any) {
        if (this.selectedAccount?.account_no) {
            this.sandBox
                .getTransactionsForAccounts(this.selectedAccount?.account_no, queryParams)
                .subscribe((res: any) => {
                    if (res.data.content) {
                        this.accountsSummary = this._customizeTransactions(res.data.content || []);
                        this.tableConfig = {
                            ...this.tableConfig,
                            data: this.accountsSummary,
                            totalRecords: res.data.totalPages,
                        };
                    }
                });
        }
    }

    makeTransfer() {
        this.router.navigate(['home/transfers/single-multiple-transers']);
    }

    makePayment() {
        this.router.navigate(['home/payments/payments']);
    }

    viewStatement() {
        this.router.navigate(['home/accounts/transactional/account-summary']);
    }

    onClickCell(event: any) {
        const payLoad = event.data;
        payLoad['currency'] = this.selectedAccount?.currency;
        const ref = this.dialog.openDrawer('TRANSACTIONS DETAILS', AccountTransationsDetailsComponent, payLoad);
        ref.afterClosed().subscribe();
    }

    private _customizeTransactions(transactionsResponse: any) {
        transactionsResponse.forEach((transaction: any) => {
            transaction.currency = this.selectedAccount?.currency || 'QAR';
            if (transaction.hasOwnProperty('txnReference')) {
                transaction.txnReference = this._truncateReference(transaction.txnReference);
            }
            if (transaction.hasOwnProperty('valueDate')) {
                transaction.valueDate = this._formatTransactionDate(transaction.valueDate);
            }
        });
        return transactionsResponse;
    }

    private _formatTransactionDate(transactionDate: any) {
        if (transactionDate != '' && transactionDate != null && transactionDate != undefined) {
            return moment(transactionDate).format('DD-MMM-YYYY');
        } else {
            return transactionDate;
        }
    }

    filterStatements() {
        this.searchFilterApplied = true;
        this.queryParams = {
            pageNumber: 0,
            pageSize: 5,
        };
        const form = this.filterstatementForm.value;
        Object.getOwnPropertyNames(form).forEach((control: any) => {
            if (['fromDate', 'toDate'].indexOf(control) !== -1)
                this.queryParams[control] = this._formatTransactionDate(form[control]);
            else if (['credit', 'debit'].indexOf(control) !== -1)
                this.queryParams[control] = this._formatAmount(form[control]);
            else this.queryParams[control] = form[control];
        });
        this.closeMatmenu();
        this.getTransactionsForAccounts(this.queryParams);
    }

    generateExcel() {
        this.queryParams['pageSize'] = 10000;
        this.queryParams['pageNumber'] = 0;
        if (this.selectedAccount?.account_no) {
            this.sandBox
                .getTransactionsForAccounts(this.selectedAccount?.account_no, this.queryParams)
                .subscribe((res: any) => {
                    if (res.data.content) {
                        this.utilService.exportAsExcelFile(
                            this.formatDataForExcel(this._customizeTransactions(res.data.content || [])),
                            'ACCOUNT_TRANSACTIONS'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                });
        }
    }

    formatDataForExcel(accountsSummary: any) {
        const temp: any = [];
        accountsSummary.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['DATE'] = moment(ele.valueDate).format('DD-MM-YYYY');
            tempObject['REFERENCE_NO'] = this._truncateReference(ele.txnReference);
            tempObject['CURRENCY'] = ele.currency;
            tempObject['DEBIT AMOUNT'] = ele.debit ? ele.debit : null;
            tempObject['CREDIT AMOUNT'] = ele.credit ? ele.credit : null;
            tempObject['ACCOUNT_NUMBER'] = ele.accountNumber;
            tempObject['DESCRIPTION'] = ele.description;
            temp.push(tempObject);
        });
        return temp;
    }

    _formatAmount(amount: any) {
        return Number.isInteger(amount) ? Number(amount).toFixed(2).toString() : amount;
    }

    private _truncateReference(value: any) {
        if (value !== undefined && value !== '' && value !== ' ') {
            value = value.split('\\')[0];
            return value;
        }
    }

    generatePdf() {
        this.queryParams['pageSize'] = 10000;
        this.queryParams['pageNumber'] = 0;
        this.queryParams['downloadtype'] = 'pdf';

        if (this.selectedAccount?.account_no) {
            this.sandBox
                .getTransactionsForAccounts(this.selectedAccount?.account_no, this.queryParams)
                .subscribe((res: any) => {
                    if (res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'ACCOUNT_TRANSACTIONS');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                });
        }
    }

    enableFilterButton() {
        if (
            this.filterstatementForm.controls['fromDate'].value &&
            this.filterstatementForm.controls['fromDate'].value !== '' &&
            this.filterstatementForm.controls['toDate'].value &&
            this.filterstatementForm.controls['toDate'].value !== ''
        ) {
            return true;
        }
        if (
            this.filterstatementForm.controls['credit'].value &&
            this.filterstatementForm.controls['credit'].value !== ''
        ) {
            return true;
        }
        if (
            this.filterstatementForm.controls['debit'].value &&
            this.filterstatementForm.controls['debit'].value !== ''
        ) {
            return true;
        }
        if (
            this.filterstatementForm.controls['txnReference'].value &&
            this.filterstatementForm.controls['txnReference'].value !== ''
        ) {
            return true;
        }
        return false;
    }

    closeMatmenu() {
        this.trigger.closeMenu();
    }
}
