import { Component, OnInit, ViewChild } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { CardsSandbox } from '../../cards.sandbox';
import * as moment from 'moment';
import { UtilService } from 'src/app/utility/utility.service';
import { CardDetails } from '../../model/cards.model';
import { CARD_TYPES } from 'src/app/shared/enums';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    public filterstatementForm!: FormGroup;
    tableConfig!: CIBTableConfig;
    tableConfig2!: CIBTableConfig;
    transactions: any = [];
    statements: any = [];
    showForm = false;
    cardDetails: CardDetails = new CardDetails();
    public transactionsForm!: UntypedFormGroup;
    searchFilterApplied: boolean = false;

    public cols = [
        {
            key: 'transactionDate',
            displayName: 'DATE',
            sortable: true,
        },
        {
            key: 'merchant',
            displayName: 'MERCHANT',
            sortable: true,
        },
        {
            key: 'referenceNumber',
            displayName: 'RERERENCE NO.',
            sortable: true,
        },
        {
            key: 'transactionCurrency',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            sortable: true,
            type: ColumnType.amount,
        },
    ];

    public cols2 = [
        {
            key: 'postingDate',
            displayName: 'DATE',
            sortable: true,
        },
        {
            key: 'merchantName',
            displayName: 'MERCHANT',
            sortable: true,
        },
        {
            key: 'transactionCurrency',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'transactionAmount',
            displayName: 'AMOUNT',
            sortable: true,
        },
    ];

    sortedData: any = [];
    sortedStatementData: any = [];
    durations: any = [];
    month = '';
    year = 0;
    @ViewChild('menuTrigger') trigger: any;
    public today = new Date();
    public minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate());
    public maxDate = new Date();
    card_types: any = CARD_TYPES;

    constructor(public fb: UntypedFormBuilder, private sandBox: CardsSandbox, private utilService: UtilService) {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
        });
    }

    ngOnInit(): void {
        const payload: any = {
            cardNumber: this.cardDetails.cardNumberUnmasked,
            noOfTransactions: 20,
            filter: true,
        };
        this.getTransactions(payload);

        for (let i = 0; i < 6; i++) {
            const getMonth = moment().subtract(i, 'month').format('MMM');
            const getYear = moment().subtract(i, 'month').format('YYYY');
            this.durations.push({ month: getMonth, year: getYear, name: getMonth + '-' + getYear });
        }

        this.filterstatementForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
            amount: [''],
            referenceNumber: [''],
        });

        this.transactionsForm = this.fb.group({
            duration: [null, [Validators.required]],
        });
    }

    public getTransactions(params: any) {
        this.sandBox.getCardTransactions(params).subscribe((res: any) => {
            this.transactions = res.data?.transactions || [];
            this.sortedData = this.transactions;
            this.loadDataTable('transaction');
        });
    }

    public getTransactionsList(type: string) {
        const formData: any = this.transactionsForm.value;
        const currentDuration = this.durations[formData.duration];
        const payload = {
            cardNo: this.cardDetails.cardNumberUnmasked,
            month: currentDuration?.month || '',
            year: currentDuration?.year || 0,
        };
        let call: any;
        if (type === CARD_TYPES.CREDIT) {
            call = this.sandBox.getTransactionsList(payload);
        }

        call.subscribe((res: any) => {
            this.statements = res.data?.ccTransactionTOList || [];
            this.sortedStatementData = this.statements;
            this.loadDataTable('statement');
        });
    }

    goBack() {
        this.showForm = false;
        this.transactionsForm.reset();
    }

    generatePdf() {
        if (this.transactionsForm.valid) {
            const formData: any = this.transactionsForm.value;
            const currentDuration = this.durations[formData.duration];
            const payload = {
                cardNo: this.cardDetails.cardNumberUnmasked,
                month: currentDuration?.month || '',
                year: currentDuration?.year || 0,
            };
            this.sandBox.downloadCardPDFStatement(payload).subscribe((res: any) => {
                if (res.status == 'SUCCESS') {
                    this.utilService.downloadPdf(res.data, 'CARD_STATEMENT');
                    this.utilService.displayNotification('PDF generated successfully!', 'success');
                }
            });
        }
    }

    generateLastTransactionPdf() {
        let queryParams: any = {
            cardNumber: this.cardDetails.cardNumberUnmasked,
            filter: true,
            noOfTransactions: 20,
            downloadType: 'pdf',
        };
        this.searchFilterApplied = true;
        const form = this.filterstatementForm.value;
        Object.getOwnPropertyNames(form).forEach((control: any) => {
            if (form[control])
                queryParams[control] =
                    ['fromDate', 'toDate'].indexOf(control) !== -1
                        ? this._formatTransactionDate(form[control])
                        : form[control];
        });

        this.sandBox.getCardTransactions(queryParams).subscribe((res: any) => {
            if (res.status == 'SUCCESS') {
                this.utilService.downloadPdf(res.data, 'CARD_TRANSACTIONS');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    generateExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.statements || [], 'statement'),
            'CARD_STATEMENT'
        );
        this.utilService.displayNotification('Excel generated successfully!', 'success');
    }

    generateLastTransactionExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.transactions || [], 'transaction'),
            'CARD_TRANSACTIONS'
        );
        this.utilService.displayNotification('Excel generated successfully!', 'success');
    }

    formatDataForExcel(accountsSummary: any, type: string) {
        const temp: any = [];
        accountsSummary.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['DATE'] = (type === 'transaction' ? ele.transactionDate : ele.postingDate) || null;
            tempObject['MERCHANT NAME'] = (type === 'transaction' ? ele.merchant : ele.merchantName) || null;
            tempObject['MERCHANT CITY'] = ele.merchantCity || null;
            tempObject['MERCHANT COUNTRY'] = ele.merchantCountry || null;
            if (type === 'transaction') tempObject['REFERENCE NUMBER'] = ele.referenceNumber || null;
            tempObject['CURRENCY'] = ele.transactionCurrency || null;
            tempObject['AMOUNT'] = (type === 'transaction' ? ele.amount : ele.transactionAmount) || null;
            temp.push(tempObject);
        });
        return temp;
    }

    filterStatements() {
        let queryParams: any = {
            cardNumber: this.cardDetails.cardNumberUnmasked,
            noOfTransactions: 20,
            filter: true,
        };
        this.searchFilterApplied = true;
        const form = this.filterstatementForm.value;
        Object.getOwnPropertyNames(form).forEach((control: any) => {
            if (form[control])
                queryParams[control] =
                    ['fromDate', 'toDate'].indexOf(control) !== -1
                        ? this._formatTransactionDate(form[control])
                        : form[control];
        });
        this.closeMatmenu();
        this.getTransactions(queryParams);
    }

    private _formatTransactionDate(transactionDate: any) {
        if (transactionDate != '' && transactionDate != null && transactionDate != undefined) {
            return moment(transactionDate).format('yyyy-MM-DD');
        } else {
            return transactionDate;
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
            this.filterstatementForm.controls['amount'].value &&
            this.filterstatementForm.controls['amount'].value !== ''
        ) {
            return true;
        }
        if (
            this.filterstatementForm.controls['referenceNumber'].value &&
            this.filterstatementForm.controls['referenceNumber'].value !== ''
        ) {
            return true;
        }
        return false;
    }

    closeMatmenu() {
        this.trigger.closeMenu();
    }

    public lazyLoad(event: any, type: string) {
        if (event.sortKey) {
            if (type === 'transaction') {
                this.transactions = this.sortedData.sort((a: any, b: any) => {
                    const isAsc = event.sortDirection === 'ASC';
                    return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
                });
            } else if (type === 'statement') {
                this.statements = this.sortedStatementData.sort((a: any, b: any) => {
                    const isAsc = event.sortDirection === 'ASC';
                    return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
                });
            }
            this.loadDataTable(type);
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    loadDataTable(type: string) {
        if (type === 'transaction') {
            this.tableConfig = {
                columns: this.cols,
                data: this.transactions,
                selection: false,
                totalRecords: this.transactions.length,
                clientPagination: true,
            };
        } else if (type === 'statement') {
            this.tableConfig2 = {
                columns: this.cols2,
                data: this.statements,
                selection: false,
                totalRecords: this.statements.length,
                clientPagination: true,
            };
        }
    }

    resetTheSearchCriteria() {
        if (this.filterstatementForm) this.filterstatementForm.reset();
        this.searchFilterApplied = false;
        this.getTransactions({
            cardNumber: this.cardDetails.cardNumberUnmasked,
            noOfTransactions: 20,
            filter: true,
        });
    }
}
