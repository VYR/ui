import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-sweep-history',
    templateUrl: './sweep-history.component.html',
    styleUrls: ['./sweep-history.component.scss'],
})
export class SweepHistoryComponent {
    tableConfig!: CIBTableConfig;

    public cols = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'fromAccount',
            displayName: 'From Account',
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'To Account',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'Threshold Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'action',
            displayName: 'Action',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'statusDesc',
            displayName: 'Reason',
            sortable: true,
        },
    ];

    sweepHistory: any = [];

    constructor(private sandBox: ReportsSandbox) {}

    ngOnInit(): void {
        this.getSweepHistory();
    }

    generateExcel() {
        this.sandBox.getSweepHistory('excel').subscribe((response: any) => {});
    }

    generatePdf() {
        this.sandBox.getSweepHistory('pdf').subscribe((response: any) => {});
    }

    public getSweepHistory() {
        this.sandBox.getSweepHistory().subscribe((response: any) => {
            if (response.data) {
                response.data.forEach((resp: any) => {
                    resp.fromAccount = resp.requestData?.fromAccount;
                    resp.toAccount = resp.requestData?.toAccount;
                    resp.currency = resp.requestData?.currency;
                    resp.amount = resp.requestData?.amount;
                });
                this.sweepHistory = response.data;
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
            data: this.sweepHistory,
            selection: false,
            totalRecords: this.sweepHistory.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.sweepHistory = this.sweepHistory.sort((a: any, b: any) => {
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
