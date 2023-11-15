import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { SALARY_POSTING_HEADER } from 'src/app/modules/transfers/constants/meta-data';

@Component({
    selector: 'app-dashboard-salary-posting-details-popup',
    templateUrl: './dashboard-salary-posting-details-popup.component.html',
    styleUrls: ['./dashboard-salary-posting-details-popup.component.scss'],
})
export class DashboardSalaryPostingDetailsPopupComponent implements OnInit {
    tableConfig!: CIBTableConfig;
    showActivityHistory: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<DashboardSalaryPostingDetailsPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(data);
    }

    DECISION = DECISION;
    hasFXDisclaimer: boolean = false;

    pendingWith: any[] = [];
    ngOnInit(): void {
        if (this.data.pendingHistory?.length > 0) {
            this.pendingWith = this.data.pendingHistory || [];
        }
        this.setTableConfig();
        if (this.data?.responseData) {
            if (this.data.responseData.errors && this.data.responseData.errors.length > 0) {
                this.data.remark = this.data.responseData.errors[0].message;
                this.data.fileStatus = 'FAILURE';
            } else {
                this.data.referenceNumber = this.data.responseData.data.referenceNumber;
                this.data.fileStatus = this.data.responseData.status;
            }
        }
        if (this.data.requestAction?.length > 0) {
            let completeActivityCount = 0;
            this.data.requestAction.forEach((action: any) => {
                if (action.complete) {
                    completeActivityCount++;
                }
            });
            this.showActivityHistory = completeActivityCount > 0;
        }
    }

    setTableConfig() {
        this.data.requestData.salaryPostingEntry.forEach((ele: any) => {
            ele.fileName = this.data.requestData.fileName;
            ele.debitAccountNumber = this.data.requestData.debitAccountNumber;
            ele.currency = 'QAR';
            ele.creditAccountNo = ele?.creditIbanNo || ele.creditAccountNo;
            ele.refNo = '';
            ele.statusDesc = '';
            ele.txnStatus = '';
            if (ele.status) {
                if (ele.status?.toUpperCase() === 'SUCCESS') {
                    ele.txnStatus = 'SUCCESS';
                    ele.refNo = ele.Ifx_reference_no || '';
                } else {
                    ele.statusDesc = ele.status.split('-')[2];
                    ele.txnStatus = 'FAILED';
                }
            } else {
                ele.txnStatus = 'PENDING';
            }
        });
        this.tableConfig = {
            columns: SALARY_POSTING_HEADER,
            data: this.data.requestData.salaryPostingEntry,
            selection: false,
            totalRecords: this.data.requestData.salaryPostingEntry.length,
            clientPagination: true,
        };
    }

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
