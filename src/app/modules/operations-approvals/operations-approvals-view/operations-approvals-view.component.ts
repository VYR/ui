import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums/common';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';

@Component({
    selector: 'app-operations-approvals-view',
    templateUrl: './operations-approvals-view.component.html',
    styleUrls: ['./operations-approvals-view.component.scss'],
})
export class OperationsApprovalsViewComponent {
    transactions: Array<any> = [];
    DECISION = DECISION;
    parentData: any;
    constructor(
        private sandBox: OperationsApprovalsSandbox,
        public dialogRef: MatDialogRef<OperationsApprovalsViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    ngOnInit(): void {
        this.transactions = [];
        if (!this.data.fields) return;
        this.parentData = this.data.fields.data;
        let requestObject: any = {};
        const serviceRequestdata = this.parentData.data;
        requestObject = { ...serviceRequestdata };
        this.transactions.push(requestObject);
    }
}
