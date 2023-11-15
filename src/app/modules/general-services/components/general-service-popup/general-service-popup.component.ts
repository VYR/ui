import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { GeneralServicesSandbox } from '../../general-services.sandbox';

@Component({
    selector: 'app-general-service-popup',
    templateUrl: './general-service-popup.component.html',
    styleUrls: ['./general-service-popup.component.scss'],
})
export class GeneralServicePopupComponent {
    DECISION = DECISION;
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;
    transaction: any = {};

    constructor(
        private sandBox: GeneralServicesSandbox,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<GeneralServicePopupComponent>
    ) {}

    ngOnInit() {
        this.transaction = this.data?.details?.data || {};
    }

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

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    getRequestType(type: any) {
        let reqType = '';
        switch (type) {
            case '1':
                reqType = 'Cheque Book Request';
                break;
            case '6':
                reqType = 'Balance Confirmation Request';
                break;
            case '7':
                reqType = 'E-Statement Request';
                break;
            case '18':
                reqType = 'Credit Card Request';
                break;
            case '19':
                reqType = 'Activate / Deactivate User';
                break;
            case '21':
                reqType = 'Request for Finance';
                break;
        }
        return reqType;
    }
}
