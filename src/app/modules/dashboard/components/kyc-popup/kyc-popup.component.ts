import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { BULK_UPLOAD_HEADER } from 'src/app/modules/transfers/constants/meta-data';

@Component({
    selector: 'app-kyc-popup',
    templateUrl: './kyc-popup.component.html',
    styleUrls: ['./kyc-popup.component.scss'],
})
export class kycPopupComponent {
    showStatus = false;
    DECISION = DECISION;
    constructor(
        public dialogRef: MatDialogRef<kycPopupComponent>,

        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {});
    }
}
