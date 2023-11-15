import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { DECISION } from 'src/app/shared/enums';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-bulk-upload-errors-dialog',
    templateUrl: './bulk-upload-errors-dialog.component.html',
    styleUrls: ['./bulk-upload-errors-dialog.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class BulkUploadErrorsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<BulkUploadErrorsDialogComponent>,
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
