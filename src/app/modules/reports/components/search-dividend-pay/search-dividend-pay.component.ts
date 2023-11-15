import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { ReportsSandbox } from '../../reports.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
    selector: 'app-search-dividend-pay',
    templateUrl: './search-dividend-pay.component.html',
    styleUrls: ['./search-dividend-pay.component.scss'],
})
export class SearchDividendPayComponent {
    dividendList: any = [];
    constructor(private _formBuilder: FormBuilder, private sandBox: ReportsSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.searchFormBuilder();
    }

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'Dividend Payment From Date';
    toDateLabel = 'Dividend Payment To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5 };
    tableConfig!: CIBTableConfig;

    modes = ['Transfer', 'Cash', 'Cheque'];
    status = ['CLEARED', 'UNCLEARED'];

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'recordId',
    };

    public cols = [
        {
            key: 'date',
            displayName: 'Dividend Payment Date',
            type: ColumnType.date,
        },
        {
            key: 'qid',
            displayName: 'Qatar Id',
            type: ColumnType.link,
        },
        {
            key: 'ninNo',
            displayName: 'NIN Number',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'txnRef',
            displayName: 'Transaction Ref No.',
            sortable: true,
        },
        {
            key: 'type',
            displayName: 'Type',
            sortable: true,
        },
        {
            key: 'mode',
            displayName: 'Mode',
            sortable: true,
        },
        {
            key: 'clearDate',
            displayName: 'Cleared Date',
            type: ColumnType.date,
            sortable: true,
        },
    ];

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            qatarId: [null, ''],
            ninNumber: [null, ''],
            mode: [null, ''],
            status: [null, ''],
        }));
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    searchDividendPay() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                nin: this.searchForm.controls['ninNumber'].value || '',
                qatarId: this.searchForm.controls['qatarId'].value || '',
                mode: this.searchForm.controls['mode'].value || '',
                status: this.searchForm.controls['status'].value || '',
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize,
                sortField: this.query.sortKey || 'recordId',
                sort: this.query.sortDirection,
            };

            this.sandBox.getDividendList(params).subscribe((res: any) => {
                if (res.data) {
                    this.dividendList = res.data.content;
                    let config = {
                        columns: this.cols,
                        data: res.data.content,
                        selection: false,
                        totalRecords: res.data.totalElements,
                    };

                    this.tableConfig = config;
                }
            });
        }
    }

    resetView() {
        this.dividendList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchForm.reset();
    }

    generatePdf() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                nin: this.searchForm.controls['ninNumber'].value || '',
                qatarId: this.searchForm.controls['qatarId'].value || '',
                mode: this.searchForm.controls['mode'].value || '',
                status: this.searchForm.controls['status'].value || '',
                sortField: this.query.sortKey,
                sort: this.query.sortDirection,
                pageIndex: 0,
                pageSize: 1000,
                downloadType: 'pdf',
            };

            this.sandBox.getDividendList(params).subscribe((res: any) => {});
        }
    }

    generateExcel() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                nin: this.searchForm.controls['ninNumber'].value || '',
                qatarId: this.searchForm.controls['qatarId'].value || '',
                mode: this.searchForm.controls['mode'].value || '',
                status: this.searchForm.controls['status'].value || '',
                pageIndex: 0,
                pageSize: 1000,
            };

            this.sandBox.getDividendList(params, 'excel').subscribe((res: any) => {});
        }
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchDividendPay();
    }

    onClickCell(event: any) {
        if (event.key === 'qid') {
            this.openSidePanel(event.data);
        }
    }

    openSidePanel(selectedRow: any) {
        let fieldInfo = [
            { fieldName: 'DIVIDEND PAYMENT DATE', fieldValue: moment(selectedRow.date).format('YYYY-MM-DD hh:mm A') },
            { fieldName: 'QATAR ID', fieldValue: selectedRow.qid },
            { fieldName: 'NIN NUMBER', fieldValue: selectedRow.ninNo },
            { fieldName: 'SHARES', fieldValue: selectedRow.shares },
            { fieldName: 'AMOUNT', fieldValue: selectedRow.currency + ' ' + selectedRow.amount },
            { fieldName: 'Transaction Ref No.', fieldValue: selectedRow.txnRef },
            { fieldName: 'TYPE', fieldValue: selectedRow.type },
            { fieldName: 'BENEFICIARY NAME', fieldValue: selectedRow.benName },
            { fieldName: 'MODE', fieldValue: selectedRow.mode },
            { fieldName: 'STATUS', fieldValue: selectedRow.status },
        ];

        if (selectedRow.clearDate)
            fieldInfo.push({
                fieldName: 'CLEARED DATE',
                fieldValue: moment(selectedRow.clearDate).format('YYYY-MM-DD hh:mm A'),
            });

        let data = {
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer('Dividend Pay Details', DetailViewComponent, data);
    }
}
