import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums/common';
import { CustomerServiceDeskSandbox } from '../../customer-service-desk.sandbox';

@Component({
    selector: 'app-csd-approvals-action',
    templateUrl: './csd-approvals-action.component.html',
    styleUrls: ['./csd-approvals-action.component.scss'],
})
export class CsdApprovalsActionComponent {
    transactions: Array<any> = [];
    DECISION = DECISION;
    parentData: any;
    comments: any;
    constructor(
        private sandBox: CustomerServiceDeskSandbox,
        public dialogRef: MatDialogRef<CsdApprovalsActionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.transactions = [];
        if (!this.data.fields) return;
        this.parentData = this.data.fields.data;
        let requestObject: any = {};
        const serviceRequestdata = this.parentData.data;
        requestObject = { ...serviceRequestdata };
        this.transactions.push(requestObject);
    }

    onAction(inputValue: any, commentValue: any) {
        let payload = {
            groupId: this.parentData.id,
            action: inputValue.toUpperCase(),
            rejectReason: commentValue ? commentValue : '',
            simpleTransferBeanList: [{}],
        };

        this.sandBox.actionCsdList(payload).subscribe((res: any) => {
            this.dialogRef.close();
        });
    }
}
