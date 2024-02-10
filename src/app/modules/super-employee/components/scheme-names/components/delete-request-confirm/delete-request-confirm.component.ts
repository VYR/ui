import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-delete-request-confirm',
    templateUrl: './delete-request-confirm.component.html',
    styleUrls: ['./delete-request-confirm.component.scss'],
})
export class DeleteRequestConfirmComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteRequestConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    DECISION = DECISION;

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
