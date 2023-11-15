import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-single-multiple-transfer-preview',
    templateUrl: './single-multiple-transfer-preview.component.html',
    styleUrls: ['./single-multiple-transfer-preview.component.scss'],
})
export class SingleMultipleTransferPreviewComponent {
    otp: string = '';
    DECISION = DECISION;
    isDisclaimerChecked: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<SingleMultipleTransferPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    validateSubmit(): boolean {
        return !(this.otp.length === 6 && this.isDisclaimerChecked);
    }

    checkboxValueEvent(isChecked: boolean) {
        this.isDisclaimerChecked = isChecked;
    }
}
