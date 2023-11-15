import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-positive-pay-history',
    templateUrl: './positive-pay-history.component.html',
    styleUrls: ['./positive-pay-history.component.scss'],
})
export class PositivePayHistoryComponent implements OnInit {
    tableConfig!: CIBTableConfig;
    filterPipe = new CIBDefinition();
    public cols = [
        {
            key: 'created',
            displayName: 'DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'accountNo',
            displayName: 'ACCOUNT NUMBER',
            sortable: true,
        },
        {
            key: 'chequeNum',
            displayName: 'CHEQUE NUMBER',
            sortable: true,
        },
        {
            key: 'currencyCode',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'chequeIssueDate',
            displayName: 'CHEQUE DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'type',
            displayName: 'Type',
            sortable: true,
        },
        {
            key: 'statusDesc',
            displayName: 'Reason',
            sortable: true,
        },
    ];
    positiveHistory: any = [];

    constructor(private sandBox: ReportsSandbox) {}

    ngOnInit(): void {
        this.getPositivePayHistory();
    }

    generateExcel() {
        this.sandBox.getPositivePayHistory('excel').subscribe((response: any) => {});
    }

    generatePdf() {
        this.sandBox.getPositivePayHistory('pdf').subscribe((response: any) => {});
    }

    public getPositivePayHistory() {
        this.sandBox.getPositivePayHistory().subscribe((response: any) => {
            if (response.data) {
                response.data.forEach((resp: any) => {
                    resp.type = this.filterPipe.transform(resp.type, 'TRANSFER_ENTRY');
                });
                this.positiveHistory = response.data;

                let config = {
                    columns: this.cols,
                    data: response.data,
                    selection: false,
                    totalRecords: response.data.length,
                    clientPagination: true,
                };

                this.tableConfig = config;
            }
        });
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.positiveHistory,
            selection: false,
            totalRecords: this.positiveHistory.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.positiveHistory = this.positiveHistory.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
