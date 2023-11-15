import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-card-popup-details',
    templateUrl: './card-popup-details.component.html',
    styleUrls: ['./card-popup-details.component.scss'],
})
export class CardPopupDetailsComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CardPopupDetailsComponent>) {}

    onConfirm() {
        this.dialogRef.close({ decision: 'CONFIRM', otp: this.otp });
    }

    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }
}
