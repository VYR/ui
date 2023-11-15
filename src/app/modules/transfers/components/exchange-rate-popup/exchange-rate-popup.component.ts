import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-exchange-rate-popup',
    templateUrl: './exchange-rate-popup.component.html',
    styleUrls: ['./exchange-rate-popup.component.scss'],
})
export class ExchangeRatePopupComponent {
    DECISION = DECISION;
    constructor(
        public dialogRef: MatDialogRef<ExchangeRatePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
