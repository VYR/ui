import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { SGSTableConfig } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SCHEME_PAY_TABLE_COLUMNS } from 'src/app/modules/home/components/save-gold-scheme/constants/meta-data';

@Component({
    selector: 'app-dashboard-request-details-popup',
    templateUrl: './dashboard-request-details-popup.component.html',
    styleUrls: ['./dashboard-request-details-popup.component.scss'],
})
export class DashboardRequestDetailsPopupComponent implements OnInit {
    tableConfig!: SGSTableConfig;
    constructor(
        public dialogRef: MatDialogRef<DashboardRequestDetailsPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    DECISION = DECISION;
    hasFXDisclaimer: boolean = false;
    hasThresholdDisclaimer: boolean = false;
    showActivityHistory: boolean = false;

    pendingWith: any[] = [];
    ngOnInit(): void {
        if (this.data.pendingHistory?.length > 0) {
            this.pendingWith = this.data.pendingHistory || [];
        }
        this.setTableConfig();
        let fxCount: number = 0;
        let thresholdCount: number = 0;
        if (this.data?.requestData?.fileJSON) {
            this.data.requestData.fileJSON.forEach((transaction: any) => {
                if (transaction.fxTransaction === 'Y') fxCount++;
                if (transaction.thresholdExceeded === 'Y') thresholdCount++;
            });
        }
        this.hasFXDisclaimer = fxCount > 0;
        if (this.data?.responseData) {
            if (this.data.responseData.errors && this.data.responseData.errors.length > 0)
                this.data.remark = this.data?.responseData.errors[0].message;
            else this.data.remark = this.data.responseData.status;
        }
        this.hasThresholdDisclaimer = thresholdCount > 0;

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
        this.data.requestData.fileJSON.forEach((data: any) => {
            data.fileName = this.data.requestData.userFileName;
        });
        this.tableConfig = {
            columns: SCHEME_PAY_TABLE_COLUMNS,
            data: this.data.requestData.fileJSON,
            selection: false,
            showPagination:true,
            totalRecords: this.data.requestData.fileJSON.length,
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
