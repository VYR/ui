import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
@Component({
    selector: 'app-card-blocking-dialog',
    templateUrl: './card-blocking-dialog.component.html',
    styleUrls: ['./card-blocking-dialog.component.scss'],
})
export class CardBlockingDialogComponent {
    DECISION = DECISION;
    constructor(
        public dialogRef: MatDialogRef<CardBlockingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
