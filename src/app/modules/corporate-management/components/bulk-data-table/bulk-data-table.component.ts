import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { UtilService } from 'src/app/utility';

@Component({
    selector: 'app-bulk-data-table',
    templateUrl: './bulk-data-table.component.html',
    styleUrls: ['./bulk-data-table.component.scss'],
})
export class BulkDataTableComponent implements OnInit {
    totalRecords: any;
    rim: any;
    fileName: any;
    date: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
    tableConfig!: CIBTableConfig;
    successTransactions = 0;
    pendingTransactions = 0;
    failedTransactions = 0;

    ngOnInit(): void {
        this.setTableConfig();
    }

    setTableConfig() {
        this.totalRecords = this.data.data.length;
        this.rim = this.data.data.uniqueUserId;
        this.fileName = this.data.data.fileName;
        this.date = moment(this.data.data.created).format('YYYY-MM-DD hh:mm A');

        this.tableConfig = {
            columns: this.data.columns,
            data: this.data.data.bulkTransferEntry,
            selection: false,
            totalRecords: this.data.data.length,
            clientPagination: true,
        };
    }
}
