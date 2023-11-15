import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadComponent } from 'src/app/cib-components/file-upload/file-upload.component';
import { DECISION } from 'src/app/shared/enums/common';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';

@Component({
    selector: 'app-bg-view',
    templateUrl: './bg-status-view.component.html',
    styleUrls: ['./bg-status-view.component.scss'],
})
export class BgStatusViewComponent {
    transactions: Array<any> = [];
    transactionsHistory: Array<any> = [];
    allowedFileTypes = ['png', 'JPG', 'jpeg', 'PDF'];
    DECISION = DECISION;
    parentData: any;
    pageType: any = 'lc';
    applnId: any;
    showHistory: boolean = false;
    fileName: any = [];
    comments: any;
    fileErrMsg: string = '';
    fileSuccessMsg: string = '';

    fileDocuments: any = [];

    @ViewChild('fileUpload') fileUpload!: FileUploadComponent;
    status: any;
    sortedData: any;

    constructor(
        private sandBox: TradeFinanceSandbox,
        public dialogRef: MatDialogRef<BgStatusViewComponent>,
        private dialog: CibDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.parentData = this.data.data;
        this.status = this.data.status;
        this.getHistory();
    }

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    getFileName(document: any) {
        const fileName: any = [];
        document.forEach((data: any) => {
            fileName.push(data.customerFileName);
        });
        return fileName;
    }

    public getHistory() {
        let refNo = '';

        if (
            this.parentData.isAmmended != null &&
            this.parentData.isAmmended != 'undefined' &&
            this.parentData.isAmmended === 'Y'
        ) {
            refNo = this.parentData.parentBg ? this.parentData.parentBg : this.parentData.bgRefNo;
        } else {
            refNo = this.parentData.id ? this.parentData.id : this.parentData.bgRefNo;
        }

        this.sandBox.getBgHistory(refNo).subscribe((res: any) => {
            let index = 0;
            res.data.forEach((value: any) => {
                if (value.isAmmended) {
                    value.request_type = index === 0 ? 'BG Amendment ' + ++index : 'BG Amendment ' + index;
                } else {
                    value.request_type = 'New BG Request';
                }
                index++;
            });

            this.transactionsHistory = res.data;
            this.showHistory = true;
        });
    }
}
