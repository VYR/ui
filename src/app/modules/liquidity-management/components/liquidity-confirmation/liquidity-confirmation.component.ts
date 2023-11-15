import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-liquidity-confirmation',
    templateUrl: './liquidity-confirmation.component.html',
    styleUrls: ['./liquidity-confirmation.component.scss'],
})
export class LiquidityConfirmationComponent implements OnInit {
    otpConfig: any;
    otp: string = '';
    fields: any;
    fromAccount: any;
    toAccount: any;
    amountCurrency: any;
    thAmount: any;

    constructor(
        public dialogRef: MatDialogRef<LiquidityConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

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
