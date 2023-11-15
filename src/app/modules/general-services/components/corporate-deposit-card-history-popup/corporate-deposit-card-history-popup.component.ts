import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-corporate-deposit-card-history-popup',
    templateUrl: './corporate-deposit-card-history-popup.component.html',
    styleUrls: ['./corporate-deposit-card-history-popup.component.scss'],
})
export class CorporateDepositCardHistoryPopupComponent {
    DECISION = DECISION;

    constructor(
        public dialogRef: MatDialogRef<CorporateDepositCardHistoryPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
