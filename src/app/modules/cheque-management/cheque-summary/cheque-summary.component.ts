import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-cheque-summary',
    templateUrl: './cheque-summary.component.html',
    styleUrls: ['./cheque-summary.component.scss'],
})
export class ChequeSummaryComponent implements OnInit {
    otpConfig: any;
    otp: string = '';
    fields: any;

    constructor(public dialogRef: MatDialogRef<ChequeSummaryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.fields = this.data.fields;
    }

    onConfirm() {
        this.fields['action'] = 'CONFIRM';
        this.fields['validateOTPRequest'] = this.otp ? { softTokenUser: false, otp: this.otp } : {};

        this.dialogRef.close({ event: 'confirm', data: this.fields });
    }

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }
}
