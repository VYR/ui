import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-detail-view',
    templateUrl: './detail-view.component.html',
    styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent {
    otpConfig: any;
    otp: string = '';
    notes: string = '';
    isOtpFilled: boolean = false;

    constructor(public dialogRef: MatDialogRef<DetailViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }

    onConfirm() {
        this.dialogRef.close({ event: 'confirm', data: { otp: this.otp, notes: this.notes } });
    }
}
