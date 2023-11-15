import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-new-account-view',
    templateUrl: './new-account-view.component.html',
    styleUrls: ['./new-account-view.component.scss'],
})
export class NewAccountViewComponent {
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;

    constructor(public dialogRef: MatDialogRef<NewAccountViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }

    onConfirm() {
        this.dialogRef.close({ event: 'confirm', data: this.otp });
    }
    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }
}
