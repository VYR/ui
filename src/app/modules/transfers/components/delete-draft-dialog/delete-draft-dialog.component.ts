import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
@Component({
    selector: 'app-delete-draft-dialog',
    templateUrl: './delete-draft-dialog.component.html',
    styleUrls: ['./delete-draft-dialog.component.scss'],
})
export class DeleteDraftDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteDraftDialogComponent>,
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
