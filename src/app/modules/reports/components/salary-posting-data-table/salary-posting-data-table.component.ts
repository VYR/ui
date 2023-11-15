import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CIBTableConfig, CIBTableQuery } from 'src/app/cib-components/cib-table/models/config.model';
import { SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';
import { UtilService } from 'src/app/utility';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-salary-posting-data-table',
    templateUrl: './salary-posting-data-table.component.html',
    styleUrls: ['./salary-posting-data-table.component.scss'],
})
export class SalaryPostingDataTableComponent implements OnInit {
    totalRecords: any;
    params: any;
    spList: Array<any> = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private utilService: UtilService,
        private sandBox: ReportsSandbox
    ) {}
    tableConfig!: CIBTableConfig;
    successTransactions = 0;
    pendingTransactions = 0;
    failedTransactions = 0;

    ngOnInit(): void {
        this.setTableConfig();
    }

    setTableConfig() {
        this.params = this.data.params;
        this.params.pageSize = 1000;
        this.getSalaryPostingListEntries();
    }
    lazyLoad(query: CIBTableQuery) {
        this.params = query;
        this.getSalaryPostingListEntries();
    }

    getSalaryPostingListEntries() {
        if (this.params.fileName) {
            this.sandBox.getSalaryPostingListEntries(this.params).subscribe((res: any) => {
                if (res.data) {
                    this.spList = res?.data || [];
                    this.totalRecords = this.spList.length;
                    this.spList = this.sandBox.formatSalaryPostingResponse(this.spList);
                    this.spList.forEach((ele: any) => {
                        if (ele.txnStatus?.toUpperCase() === 'SUCCESS') {
                            this.successTransactions++;
                        } else if (ele.txnStatus?.toUpperCase() === 'PENDING') {
                            this.pendingTransactions++;
                        } else {
                            this.failedTransactions++;
                        }
                        ele.debitAccountNumber = this.params.debitAccountNumber;
                    });
                    let config = {
                        columns: this.data.columns,
                        data: this.spList,
                        selection: false,
                        totalRecords: this.spList.length,
                        clientPagination: true,
                    };
                    this.tableConfig = config;
                }
            });
        }
    }
    generateExcel() {
        if (this.data) {
            this.utilService.exportAsExcelFile(this.formatDataForExcel(this.spList || []), 'Salary_Posting_Details');
            this.utilService.displayNotification('Excel generated successfully!', 'success');
        }
    }
    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject[SALARY_POSTING_COLUMNS.DR_AC] = ele.debitAccountNumber;
            tempObject[SALARY_POSTING_COLUMNS.CURRENCY] = ele.currency;
            tempObject[SALARY_POSTING_COLUMNS.AMOUNT] = ele.amount;
            tempObject[SALARY_POSTING_COLUMNS.CR_AC] = ele.creditIbanNo;
            tempObject[SALARY_POSTING_COLUMNS.CR_NAME] = ele.creditName;
            tempObject[SALARY_POSTING_COLUMNS.TXN_STATUS] = ele.status;
            tempObject[SALARY_POSTING_COLUMNS.REF_NO] = ele.refNo;
            tempObject[SALARY_POSTING_COLUMNS.REMARK] = ele.statusDesc;
            temp.push(tempObject);
        });
        return temp;
    }

    generatePdf() {
        let params = { ...this.params, downloadType: 'pdf' };

        this.sandBox.getSalaryPostingListEntries(params).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'Salary_Posting_Details');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }
}
