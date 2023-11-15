import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { AccountsSandbox } from '../../accounts.sandbox';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility/utility.service';
import { AccountTransationsDetailsComponent } from '../account-transactions-details/account-transactions-details.component';
@Component({
    selector: 'app-account-summary',
    templateUrl: './account-summary.component.html',
    styleUrls: ['./account-summary.component.scss'],
})
export class AccountSummaryComponent implements OnInit {
    public selectedAccount!: any;
    tableConfig!: CIBTableConfig;
    monthFlag: boolean = true;
    public transactionhistoryForm!: FormGroup;
    public cols = [
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
    ];
    public currentDate = new Date();
    public minDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 6,
        this.currentDate.getDate()
    );
    public maxDate = new Date(new Date().setDate(new Date().getDate() - 1));
    public fromDate!: any;
    public toDate!: any;
    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    statementPeriod: any = 'byMonth';
    transactionData: any = [];
    constructor(
        private router: Router,
        public sandBox: AccountsSandbox,
        public fb: FormBuilder,
        private dialog: CibDialogService,
        private utilService: UtilService
    ) {
        this.selectedAccount = this.sandBox.selectedAccount;
    }

    ngOnInit(): void {
        this.transactionhistoryForm = this.fb.group({
            startDate: [this.minDate, Validators.required],
            endDate: [this.maxDate, Validators.required],
        });
    }

    goBack() {
        this.router.navigate(['home/accounts']);
    }

    onClickCell(event: any) {
        const payLoad = event.data;
        payLoad['currency'] = this.selectedAccount.currency;
        const ref = this.dialog.openDrawer('TRANSACTIONS DETAILS', AccountTransationsDetailsComponent, payLoad);
        ref.afterClosed().subscribe();
    }

    statementBasedOnPeriod(event: any) {
        this.statementPeriod = event.value;
        switch (event.value) {
            case 'byMonth':
                this.monthFlag = true;
                this.resetStatementTransaction();
                break;
            case 'sixMonths':
                this.monthFlag = false;
                this.resetStatementTransaction();
                break;
        }
    }

    resetStatementTransaction() {
        this.transactionData = [];
    }

    public generateExcel() {
        this.formatDates();
        if (this.selectedAccount?.account_no !== null && this.fromDate !== null && this.toDate !== null) {
            this.queryParams = {};
            this.queryParams['account'] = this.selectedAccount.account_no;
            this.queryParams['fromDate'] = this.fromDate;
            this.queryParams['toDate'] = this.toDate;
            this.queryParams['pageSize'] = 10000;
            this.queryParams['pageNumber'] = 0;
            this.queryParams['responseType'] = 'arraybuffer';
            this.queryParams['downloadType'] = 'excel';
            this.sandBox.downloadAccountsStatements(this.queryParams).subscribe((res: any) => {
                if (res.data) {
                    this.utilService.exportAsExcelFile(
                        this.formatDataForExcel(res.data),
                        'ACCOUNT_TRANSACTION_HISTORY'
                    );
                    this.utilService.displayNotification('Excel generated successfully!', 'success');
                }
            });
        }
    }

    formatDataForExcel(transactionData: any) {
        const temp: any = [];
        transactionData.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['DATE'] = moment(ele.booking_DATE).format('DD-MM-YYYY');
            tempObject['REFERENCE_NO'] = this.truncateReference(ele.txn_REFERENCE);
            tempObject['CURRENCY'] = this.selectedAccount?.currency;
            tempObject['DEBIT AMOUNT'] = ele.debit ? ele.debit : null;
            tempObject['CREDIT AMOUNT'] = ele.credit ? ele.credit : null;
            tempObject['BALANCE'] = ele.running_BALANCE;
            tempObject['ACCOUNT_NUMBER'] = ele.account_NUMBER;
            tempObject['DESCRIPTION'] = ele.description;
            temp.push(tempObject);
        });
        return temp;
    }

    truncateReference(value: any) {
        if (value !== undefined && value !== '' && value !== ' ') {
            value = value.split('\\')[0];
            return value;
        }
    }

    public generatePdf() {
        this.queryParams = {};
        this.queryParams['account'] = this.selectedAccount.account_no;
        this.queryParams['fromDate'] = this.fromDate;
        this.queryParams['toDate'] = this.toDate;
        this.queryParams['pageSize'] = 10000;
        this.queryParams['pageNumber'] = 0;
        this.queryParams['responseType'] = 'arraybuffer';
        this.queryParams['downloadType'] = 'pdf';
        this.sandBox.downloadAccountsStatements(this.queryParams).subscribe((res: any) => {
            if (res?.data?.length > 0) {
                this.utilService.downloadPdf(res.data, 'ACCOUNT_TRANSACTION_HISTORY');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    lazyLoad(query: CIBTableQuery) {
        this.queryParams = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            sortKey: query.sortKey,
            sortDirection: query.sortDirection,
        };
        this.requestViewStatement();
    }

    requestViewStatement() {
        this.formatDates();
        if (this.selectedAccount?.account_no !== null && this.fromDate !== null && this.toDate !== null) {
            this.queryParams['fromDate'] = this.fromDate;
            this.queryParams['toDate'] = this.toDate;
            this.sandBox
                .getTransactionsForAccounts(this.selectedAccount.account_no, this.queryParams)
                .subscribe((res: any) => {
                    if (res.data.content) {
                        this.transactionData = res.data.content;
                        this.transactionData.forEach((transaction: any) => {
                            transaction.currency = this.selectedAccount?.currency;
                        });
                        this.tableConfig = {
                            columns: this.cols,
                            data: this.transactionData,
                            selection: false,
                            totalRecords: res.data.totalPages,
                        };
                    }
                });
        }
    }

    enableFilterButton() {
        if (this.statementPeriod === 'sixMonths') return true;
        if (this.statementPeriod === 'byMonth')
            return (
                this.transactionhistoryForm.controls['startDate'].valid &&
                this.transactionhistoryForm.controls['endDate'].valid
            );
        return false;
    }

    formatDates() {
        if (this.statementPeriod === 'byMonth') {
            this.fromDate = moment(this.transactionhistoryForm.controls['startDate'].value).format('DD-MMM-YY');
            this.toDate = moment(this.transactionhistoryForm.controls['endDate'].value).format('DD-MMM-YY');
        }
        if (this.statementPeriod === 'sixMonths') {
            this.fromDate = moment(this.minDate).startOf('month').format('DD-MMM-YY');
            var c = new Date();
            var d = c.setDate(c.getDate() - 1);
            this.toDate = moment(d).format('DD-MMM-YY');
        }
    }
}
