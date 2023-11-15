import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { FutureDatedTransferSandbox } from '../future-dated-transfers.sandbox';

@Component({
    selector: 'app-ft-details',
    templateUrl: './ft-details.component.html',
    styleUrls: ['./ft-details.component.scss'],
})
export class FtDetailsComponent implements OnInit {
    dateTitle = 'Transfer Date';
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;
    isDisclaimerChecked: boolean = true;
    fields: any;

    constructor(
        public dialogRef: MatDialogRef<FtDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fdtSB: FutureDatedTransferSandbox
    ) {}

    ngOnInit(): void {
        this.fields = this.data.fields;
    }

    formatDate(date: any) {
        return moment(new Date(date)).format('DD-MMM-YY').toString();
    }

    validateSubmit(): boolean {
        return !(this.isOtpFilled && this.isDisclaimerChecked);
    }

    checkboxValueEvent(isChecked: boolean) {
        this.isDisclaimerChecked = isChecked;
    }

    onOtpValueEnter(otp: string) {
        if (otp.length > 5) {
            this.otp = otp;
            this.isOtpFilled = true;
        } else {
            this.isOtpFilled = false;
        }
    }

    onConfirm() {
        this.fields['action'] = 'CONFIRM';
        this.fields['validateOTPRequest'] = this.otp ? { softTokenUser: false, otp: this.otp } : {};
        this.fdtSB.verifySTO(this.fields, this.data.pathVar).subscribe((res) => {
            this.dialogRef.close({ event: 'confirm', data: res });
        });
    }

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }
}
