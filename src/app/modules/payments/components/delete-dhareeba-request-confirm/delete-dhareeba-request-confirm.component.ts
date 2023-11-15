import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-delete-dhareeba-request-confirm',
    templateUrl: './delete-dhareeba-request-confirm.component.html',
    styleUrls: ['./delete-dhareeba-request-confirm.component.scss'],
})
export class DeleteDhareebaRequestConfirmComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteDhareebaRequestConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public tinNumber: any
    ) {}
    DECISION = DECISION;

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.tinNumber,
        });
    }
}
