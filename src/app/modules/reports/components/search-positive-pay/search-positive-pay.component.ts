import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { ReportsSandbox } from '../../reports.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
    selector: 'app-search-positive-pay',
    templateUrl: './search-positive-pay.component.html',
    styleUrls: ['./search-positive-pay.component.scss'],
})
export class SearchPositivePayComponent implements OnInit {
    positivePayList: any = [];
    filterPipe = new CIBDefinition();
    constructor(private _formBuilder: FormBuilder, private sandBox: ReportsSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.searchFormBuilder();
    }

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'created',
    };

    public cols = [
        {
            key: 'created',
            displayName: 'CHEQUE UPLOAD DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'accountNo',
            displayName: 'POSITIVE PAY ACCOUNT NUMBER',
            sortable: true,
        },
        {
            key: 'chequeNum',
            displayName: 'CHEQUE NUMBER',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'currencyCode',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'CHEQUE AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'formattedChequeDate',
            displayName: 'CHEQUE ISSUE DATE',
            sortable: true,
        },
        {
            key: 'type',
            displayName: 'TYPE',
            sortable: true,
        },
    ];

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'From Date';
    toDateLabel = 'To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5 };
    tableConfig!: CIBTableConfig;

    generateExcel() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                chequeNumber: this.searchForm.controls['chequeNumber'].value || '',
                pageIndex: 0,
                pageSize: 1000,
            };

            this.sandBox.getPositivePay(params, 'excel').subscribe((res: any) => {});
        }
    }

    generatePdf() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                chequeNumber: this.searchForm.controls['chequeNumber'].value || '',
                pageIndex: 0,
                pageSize: 1000,
                downloadType: 'pdf',
            };

            this.sandBox.getPositivePay(params).subscribe((res: any) => {});
        }
    }

    resetView() {
        this.positivePayList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchForm.reset();
    }

    searchPositivePay() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                chequeNumber: this.searchForm.controls['chequeNumber'].value || '',
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize,
                sortField: this.query.sortKey,
                sort: this.query.sortDirection,
            };

            this.sandBox.getPositivePay(params).subscribe((res: any) => {
                if (res.data) {
                    this.positivePayList = res.data.content;
                    this.positivePayList.forEach((x: any) => {
                        x.type = this.filterPipe.transform(x.type, 'TRANSFER_ENTRY');
                    });
                    let config = {
                        columns: this.cols,
                        data: this.positivePayList,
                        selection: false,
                        totalRecords: res.data.totalElements,
                    };

                    this.tableConfig = config;
                }
            });
        }
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            chequeNumber: [null, ''],
        }));
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchPositivePay();
    }

    onClickCell(event: any) {
        if (event.key === 'chequeNum') {
            this.openSidePanel(event.data);
        }
    }

    openSidePanel(selectedRow: any) {
        let fieldInfo = [
            { fieldName: 'CHEQUE NUMBER', fieldValue: selectedRow.chequeNum },
            { fieldName: 'CHEQUE AMOUNT', fieldValue: selectedRow.currencyCode + ' ' + selectedRow.amount },
            {
                fieldName: 'CHEQUE UPLOAD DATE',
                fieldValue: moment(selectedRow.created).format('MMM DD, YYYY hh:mm:ss A'),
            },
            { fieldName: 'POSITIVE PAY ACCOUNT NUMBER', fieldValue: selectedRow.accountNo },
            { fieldName: 'CHEQUE ISSUE DATE', fieldValue: selectedRow.formattedChequeDate },
            { fieldName: 'TYPE', fieldValue: selectedRow.type },
        ];

        let data = {
            headerName: 'Positive Pay Details',
            isOtpNeeded: false,
            fields: fieldInfo,
        };
        this.dialog.openDrawer('Positive Pay Details', DetailViewComponent, data);
    }
}
