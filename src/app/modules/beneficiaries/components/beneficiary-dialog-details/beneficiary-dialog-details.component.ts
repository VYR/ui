import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-beneficiary-dialog-details',
    templateUrl: './beneficiary-dialog-details.component.html',
    styleUrls: ['./beneficiary-dialog-details.component.scss'],
})
export class BeneficiaryDialogDetailsComponent {
    isConfirmDisabled: boolean = true;
    otp: string = '';
    constructor(
        public dialogRef: MatDialogRef<BeneficiaryDialogDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onConfirm() {
        this.dialogRef.close({ event: 'confirm', data: this.otp });
    }

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }

    onOtpValueEnter(otp: string) {
        this.isConfirmDisabled = true;
        if (otp.length > 5) {
            this.otp = otp;
            this.isConfirmDisabled = false;
        }
    }
}
