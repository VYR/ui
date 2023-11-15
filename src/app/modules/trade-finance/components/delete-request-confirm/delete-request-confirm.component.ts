import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';

@Component({
    selector: 'app-delete-request-confirm',
    templateUrl: './delete-request-confirm.component.html',
    styleUrls: ['./delete-request-confirm.component.scss'],
})
export class DeleteRequestConfirmComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteRequestConfirmComponent>,
        private sandBox: TradeFinanceSandbox,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    DECISION = DECISION;
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

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
