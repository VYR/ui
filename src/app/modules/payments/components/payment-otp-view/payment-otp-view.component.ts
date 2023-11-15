import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-payment-otp-view',
    templateUrl: './payment-otp-view.component.html',
    styleUrls: ['./payment-otp-view.component.scss'],
})
export class PaymentOtpViewComponent {
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;

    constructor(public dialogRef: MatDialogRef<PaymentOtpViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

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
}
