import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';

@Component({
    selector: 'app-corporate-deposit-card-request-confirmation',
    templateUrl: './corporate-deposit-card-request-confirmation.component.html',
    styleUrls: ['./corporate-deposit-card-request-confirmation.component.scss'],
})
export class CorporateDepositCardRequestConfirmationComponent {
    DECISION = DECISION;
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CorporateDepositCardRequestConfirmationComponent>
    ) {}

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }
    action(action: DECISION) {
        this.data = { ...this.data, ...{ otp: this.otp } };
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}
