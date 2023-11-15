import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SALARY_POSTING_COLUMNS } from '../../../../../../shared/enums/common';

@Component({
    selector: 'app-salary-posting-summary',
    templateUrl: './salary-posting-summary.component.html',
    styleUrls: ['./salary-posting-summary.component.scss'],
})
export class SalaryPostingSummaryComponent implements OnInit {
    otpConfig: any;
    otp: string = '';
    fields: any;
    SALARY_POSTING_COLUMNS = SALARY_POSTING_COLUMNS;
    constructor(
        public dialogRef: MatDialogRef<SalaryPostingSummaryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        console.log(this.data);
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
