import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-bulk-upload-summary',
    templateUrl: './bulk-upload-summary.component.html',
    styleUrls: ['./bulk-upload-summary.component.scss'],
})
export class BulkUploadSummaryComponent {
    otp: string = '';
    isOtpFilled: boolean = false;
    isDisclaimerChecked: boolean = true;
    constructor(
        public dialogRef: MatDialogRef<BulkUploadSummaryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }

    onConfirm() {
        this.dialogRef.close({ event: 'confirm', otp: this.otp });
    }

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }

    validateSubmit(): boolean {
        return !(this.isOtpFilled && this.isDisclaimerChecked);
    }

    checkboxValueEvent(isChecked: boolean) {
        this.isDisclaimerChecked = isChecked;
    }
}
