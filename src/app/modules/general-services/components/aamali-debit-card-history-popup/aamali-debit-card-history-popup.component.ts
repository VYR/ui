import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { CardsSandbox } from '../../../cards/cards.sandbox';

@Component({
    selector: 'app-aamali-debit-card-history-popup',
    templateUrl: './aamali-debit-card-history-popup.component.html',
    styleUrls: ['./aamali-debit-card-history-popup.component.scss'],
})
export class AamaliDebitCardHistoryPopupComponent implements OnInit {
    DECISION = DECISION;
    fileDocuments = [];
    constructor(
        public dialogRef: MatDialogRef<AamaliDebitCardHistoryPopupComponent>,
        private sandbox: CardsSandbox,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    ngOnInit(): void {
        this.fileDocuments = this.data?.documentUploadDetailsList || [];
    }
    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandbox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }
    getFileName(document: any) {
        const fileName: any = [];
        document.forEach((data: any) => {
            fileName.push(data.customerFileName);
        });
        return fileName;
    }
    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
