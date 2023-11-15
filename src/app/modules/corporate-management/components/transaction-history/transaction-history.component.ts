import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { TransactionHistorySandbox } from './transaction-history.sandbox';
import { UtilService } from 'src/app/utility';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'rim',
                displayName: 'RIM',
                sortable: true,
            },
            {
                key: 'payeeType',
                displayName: 'Payee',
                sortable: true,
            },
            {
                key: 'debitAccountNo',
                displayName: 'From Account',
                sortable: true,
            },
            {
                key: 'toAccount',
                displayName: 'To Account',
                sortable: true,
            },
            {
                key: 'beneficiaryName',
                displayName: 'Beneficiary',
                sortable: true,
            },
            {
                key: 'txnDate',
                displayName: 'Transaction Date',
                sortable: true,
                type: ColumnType.date,
            },
            {
                key: 'amount',
                displayName: 'Amount',
                sortable: true,
                type: ColumnType.amount,
            },
            {
                key: 'currency',
                displayName: 'Currency',
                sortable: true,
            },
            {
                key: 'customerRef',
                displayName: 'Customer Reference',
                sortable: true,
            },
            {
                key: 'modeOfTransfer',
                displayName: 'Transfer Mode',
                sortable: true,
            },
            {
                key: 'failureReason',
                displayName: 'Failure Reason',
                sortable: true,
                type: ColumnType.html,
            },
        ],
        selection: false,
        totalRecords: 0,
        clientPagination: true,
        data: [],
    };
    totalGroups: Array<any> = [];
    filterPipe = new CIBDefinition();

    searchForm: FormGroup = new FormGroup({});
    startDate = null;
    endDate = null;
    dateVal = new Date();
    minDate = new Date(this.dateVal.getFullYear(), this.dateVal.getMonth(), this.dateVal.getDate() - 30);
    maxDate = new Date(this.dateVal.getFullYear(), this.dateVal.getMonth(), this.dateVal.getDate());
    searchData: Array<any> = [];
    errMsg = '';
    payeeTypes: Array<any> = [];
    constructor(
        private sandbox: TransactionHistorySandbox,
        private _formBuilder: FormBuilder,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.searchForm = this._formBuilder.group({
            rim: [null],
            payeeType: [null],
            debitAccountNo: [null],
            toAccount: [null],
            beneficiaryName: [null],
            fromDate: [null],
            toDate: [null],
        });
        this.sandbox.getFailureHistory('', '').subscribe((res: any) => {
            const data: any[] = res['data'];

            data.forEach((d) => {
                d.payeeType = this.filterPipe.transform(d.payeeType, 'PAYEE');
                if (!this.payeeTypes.includes(d.payeeType)) this.payeeTypes.push(d.payeeType);
                d.toAccount =
                    d.creditAccountNo && d.creditAccountNo !== 'NA'
                        ? d.creditAccountNo
                        : d.beneficiaryAccNo && d.beneficiaryAccNo !== 'NA'
                        ? d.beneficiaryAccNo
                        : d.cardNumber;
                d.txnDate = d.paymentDate || d.createdDate;
                d.modeOfTransfer = d.modeOfTransfer.replace(/_/g, ' ');
                d.failureReasonForExcel = d.failureReason;
                d.failureReason = `<span style="color:red">${d.failureReason}<span>`;
            });
            this.totalGroups = data;
            this.searchData = data;
            this.loadDataTable(this.searchData);
        });
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.searchData = this.searchData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.searchData);
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    loadDataTable(data: any[]) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }

    generateExcel() {
        if (this.tableConfig.data.length > 0) {
            this.utilService.exportAsExcelFile(
                this.formatDataForExcel(this.tableConfig.data || []),
                'FAILED_TRANSACTIONS'
            );
            this.utilService.displayNotification('Excel generated successfully!', 'success');
        }
    }

    formatDataForExcel(accountsSummary: any) {
        const temp: any = [];
        accountsSummary.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['RIM'] = ele.rim;
            tempObject['Payee'] = ele.payeeType;
            tempObject['From Account'] = ele.debitAccountNo;
            tempObject['To Account'] = ele.toAccount;
            tempObject['Beneficiary'] = ele.beneficiaryName;
            tempObject['Transaction Date'] = moment(ele.txnDate).format('DD-MM-YYYY');
            tempObject['Amount'] = ele.amount ? ele.amount : null;
            tempObject['Currency'] = ele.currency;
            tempObject['Customer Reference'] = ele.customerRef;
            tempObject['Transfer Mode'] = ele.modeOfTransfer;
            tempObject['Failure Reason'] = ele.failureReasonForExcel;
            temp.push(tempObject);
        });
        return temp;
    }
    search() {
        this.errMsg = '';
        const formData = this.searchForm.value;
        let queryParams: any = {};
        Object.getOwnPropertyNames(formData).forEach((control: any) => {
            if (formData[control] && !['fromDate', 'toDate'].includes(control))
                queryParams[control] = formData[control];
        });
        if ((formData.toDate && formData.fromDate) || (formData.toDate && !formData.fromDate))
            if (moment(formData.toDate).diff(formData.fromDate, 'days') < 0) {
                this.errMsg = 'To Date must be greater than From Date';
                this.searchData = [];
                this.loadDataTable(this.searchData);
                return;
            }
        this.searchData = this.totalGroups.filter((el: any) => this.validateFilter(el, formData, queryParams));
        this.loadDataTable(this.searchData);
    }

    validateFilter(data: any, formData: any, queryParams: any) {
        let isValid: boolean = true;
        Object.getOwnPropertyNames(queryParams).forEach((control: any) => {
            if (queryParams[control] != data[control]) {
                isValid = false;
            }
        });
        if (formData.toDate && formData.fromDate && isValid)
            isValid =
                moment(data.txnDate).diff(formData.fromDate, 'days') > -1 &&
                moment(formData.toDate).diff(data.txnDate, 'days') > -1;
        else if (formData.fromDate && isValid)
            isValid = moment(data.txnDate).format('DD-MM-YYYY') === moment(formData.fromDate).format('DD-MM-YYYY');
        else if (formData.toDate && isValid)
            isValid = moment(data.txnDate).format('DD-MM-YYYY') === moment(formData.toDate).format('DD-MM-YYYY');
        return isValid;
    }
    getFromDate(ev: any) {
        this.startDate = ev;
    }

    getToDate(ev: any) {
        this.endDate = ev;
    }

    clearForm() {
        this.searchForm.reset();
        this.errMsg = '';
        this.searchData = [...this.totalGroups];
        this.loadDataTable(this.searchData);
    }
}
