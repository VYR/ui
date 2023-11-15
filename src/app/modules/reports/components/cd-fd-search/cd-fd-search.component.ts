import { Component, OnInit } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-cd-fd-search',
    templateUrl: './cd-fd-search.component.html',
    styleUrls: ['./cd-fd-search.component.scss'],
})
export class CdFdSearchComponent implements OnInit {
    tableConfig!: CIBTableConfig;

    public cols = [
        {
            key: 'created',
            displayName: 'CREATED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'account',
            displayName: 'Account',
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
            key: 'tenor',
            displayName: 'Tenor',
            sortable: true,
        },
        {
            key: 'rate',
            displayName: 'Expected Profit Rate',
            sortable: true,
        },
        {
            key: 'type',
            displayName: 'Type',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'reason',
            displayName: 'Reference',
            sortable: true,
        },
    ];
    accountsHistory: any = [];

    filterPipe = new CIBDefinition();

    constructor(private sandBox: ReportsSandbox) {}

    ngOnInit(): void {
        this.getAccountHistory();
    }

    generateExcel() {
        this.sandBox.getAccountHistoryExcel();
    }

    generatePdf() {
        this.sandBox.getAccountHistory('pdf').subscribe((response: any) => {});
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.accountsHistory = this.accountsHistory.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.tableConfig = {
                columns: this.cols,
                data: this.accountsHistory,
                selection: false,
                totalRecords: this.accountsHistory.length,
                clientPagination: true,
            };
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public getAccountHistory() {
        this.sandBox.getAccountHistory().subscribe((response: any) => {
            this.accountsHistory = [];
            if (response.data) {
                response.data.forEach((res: any) => {
                    let temp = {
                        created: res.created,
                        account: res.requestData.debitAccountNumber,
                        currency: res.requestData.currency,
                        amount: res.requestData.principalAmount,
                        tenor: this.filterPipe.transform(res.requestData.tenor, 'TENOR'),
                        rate: res.requestData.expectedProfitRate + '%',
                        type: this.filterPipe.transform(res.requestData.type, 'ACCOUNT_TYPE'),
                        status: res.status,
                        reason: res.responseData.acctountId,
                    };
                    this.accountsHistory.push(temp);
                });

                let config = {
                    columns: this.cols,
                    data: this.accountsHistory,
                    selection: false,
                    totalRecords: this.accountsHistory.length,
                    clientPagination: true,
                };

                this.tableConfig = config;
            }
        });
    }
}
