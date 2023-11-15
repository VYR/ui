import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-auto-history',
    templateUrl: './auto-history.component.html',
    styleUrls: ['./auto-history.component.scss'],
})
export class AutoHistoryComponent {
    tableConfig!: CIBTableConfig;

    public cols = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'linkedAccountId',
            displayName: 'Cover Account',
            sortable: true,
        },
        {
            key: 'accountId',
            displayName: 'Transaction Account',
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

    autoCoverHistory: any = [];

    constructor(private sandBox: ReportsSandbox) {}

    ngOnInit(): void {
        this.getAutoCoverHistory();
    }

    generateExcel() {
        this.sandBox.getAutoCoverHistory('excel').subscribe((response: any) => {});
    }

    generatePdf() {
        this.sandBox.getAutoCoverHistory('pdf').subscribe((response: any) => {});
    }

    public getAutoCoverHistory() {
        this.sandBox.getAutoCoverHistory().subscribe((response: any) => {
            if (response.data) {
                this.autoCoverHistory = response.data;

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
            data: this.autoCoverHistory,
            selection: false,
            totalRecords: this.autoCoverHistory.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.autoCoverHistory = this.autoCoverHistory.sort((a: any, b: any) => {
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
