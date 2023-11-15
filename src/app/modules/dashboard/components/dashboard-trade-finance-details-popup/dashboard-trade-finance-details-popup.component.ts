import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TradeFinanceSandbox } from 'src/app/modules/trade-finance/trade-finance.sandbox';
@Component({
    selector: 'app-dashboard-trade-finance-details-popup',
    templateUrl: './dashboard-trade-finance-details-popup.component.html',
    styleUrls: ['./dashboard-trade-finance-details-popup.component.scss'],
})
export class DashboardTradeFinanceDetailsPopupComponent implements OnInit {
    bgDetails: any;
    transactionsHistory: Array<any> = [];
    fileDocuments: any = [];
    type: any;
    constructor(
        public dialogRef: MatDialogRef<DashboardTradeFinanceDetailsPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private tradeSandBox: TradeFinanceSandbox
    ) {}

    pendingWith: any[] = [];
    ngOnInit(): void {
        if (this.data.data.pendingHistory?.length > 0) {
            this.pendingWith = this.data.data.pendingHistory || [];
        }
        this.bgDetails = this.data.data.requestData;
        this.type = this.data.type;
        this.fileDocuments = this.bgDetails.documents ? this.bgDetails.documents : [];
        this.getHistory();
    }

    getHistory() {
        if (this.type === 'BG') {
            let bgID = this.bgDetails?.ammended === 'Y' ? this.bgDetails?.parentBg : this.bgDetails?.bgApplicationId;
            this.tradeSandBox.getBgApproveHistory(bgID).subscribe((res: any) => {
                this.transactionsHistory = res.data;
            });
        } else {
            let refNo =
                this.bgDetails?.isAmendRequest === 'Y'
                    ? this.bgDetails.parentLC
                        ? this.bgDetails.parentLC
                        : this.bgDetails.txnRefNo
                    : this.bgDetails.applnId
                    ? this.bgDetails.applnId
                    : this.bgDetails.txnRefNo;
            this.tradeSandBox.getLcHistory(refNo).subscribe((res: any) => {
                let index = 0;
                res.data.forEach((value: any) => {
                    if (value.isAmendRequest) {
                        value.request_type = 'LC Amendment ' + index;
                    } else {
                        value.request_type = 'New LC Request';
                    }
                    index++;
                });

                this.transactionsHistory = res.data;
            });
        }
    }

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.tradeSandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    getFileName(document: any) {
        const fileName: any = [];
        document.forEach((data: any) => {
            fileName.push(data.customerFileName);
        });
        return fileName;
    }
}
