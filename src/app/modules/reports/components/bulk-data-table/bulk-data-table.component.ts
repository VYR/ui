import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { UtilService } from 'src/app/utility';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-bulk-data-table',
    templateUrl: './bulk-data-table.component.html',
    styleUrls: ['./bulk-data-table.component.scss'],
})
export class BulkDataTableComponent implements OnInit {
    totalRecords: any;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private utilService: UtilService,
        private sandBox: ReportsSandbox
    ) {}
    tableConfig!: CIBTableConfig;
    successTransactions = 0;
    pendingTransactions = 0;
    failedTransactions = 0;
    hasFXDisclaimer: boolean = false;
    hasThresholdDisclaimer: boolean = false;

    ngOnInit(): void {
        this.setTableConfig();
    }

    setTableConfig() {
        this.totalRecords = this.data.data.length;
        let fxCount: number = 0;
        let thresholdCount: number = 0;
        this.data.data.forEach((ele: any) => {
            if (ele.hasOwnProperty('ifscCode')) ele.swiftCode = ele.ifscCode;
            if (ele.hasOwnProperty('fedwire')) ele.swiftCode = ele.fedwire;
            if (ele.hasOwnProperty('transitNo')) ele.swiftCode = ele.transitNo;
            if (ele.hasOwnProperty('bsbNo')) ele.swiftCode = ele.bsbNo;
            if (ele.fxTransaction) fxCount++;
            if (ele.thresholdExceeded) thresholdCount++;

            if (ele.status?.toUpperCase() === 'SUCCESS') this.successTransactions++;
            if (ele.status?.toUpperCase() === 'SUBMITTED') this.pendingTransactions++;
            if (ele.status?.toUpperCase() === 'FAILED') this.failedTransactions++;
        });
        this.hasFXDisclaimer = fxCount > 0;
        this.hasThresholdDisclaimer = thresholdCount > 0;

        this.tableConfig = {
            columns: this.data.columns,
            data: this.data.data,
            selection: false,
            totalRecords: this.data.data.length,
            clientPagination: true,
        };
    }

    generateExcel() {
        if (this.data) {
            this.utilService.exportAsExcelFile(this.formatDataForExcel(this.data.data || []), 'Bulk_Transfer_Details');
            this.utilService.displayNotification('Excel generated successfully!', 'success');
        }
    }

    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let row: any = {};
            Object.keys(ele).forEach((property: string) => {
                if (property === 'created' || property === 'fileDate' || property === 'paymentDate')
                    row[property] = moment(ele[property]).format('YYYY-MM-DD hh:mm A');
                else row[property] = ele[property];
            });
            temp.push(row);
        });
        return temp;
    }

    generatePdf() {
        let id = this.data ? this.data.data[0].parentBulkId : 0;
        this.sandBox.getBulkTransferDetailsPdf(id, 'pdf');
    }
}
