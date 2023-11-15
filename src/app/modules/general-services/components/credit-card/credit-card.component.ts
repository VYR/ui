import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-credit-card',
    templateUrl: './credit-card.component.html',
    styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
    accounts: any = [];
    isRequestSuccess: boolean = false;
    cardTypeList = ['MasterCard - Revolve'];
    statusData: any = { statusTitle: 'Credit Card Request Status', requestType: 'creditCard' }; //Notification Data
    creditCardRequestForm!: UntypedFormGroup;
    module: any;
    constructor(
        private sandBox: GeneralServicesSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService
    ) {}

    ngOnInit(): void {
        this.sandBox.getAccountListFiltered(['QAR'], ['Current Account']).subscribe((accounts: Array<any>) => {
            this.accounts = accounts || [];
        });
        this.creditCardRequestForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
            embossingName: [null, [Validators.required]],
            contactNumber: [null, [Validators.required]],
            creditLimit: [null, [Validators.required]],
            cardType: [null, [Validators.required]],
        });
        this.module = SERVICE_REQUEST_TYPES[7];
    }

    processCreditCardRequest() {
        let formData: any = this.creditCardRequestForm.value;
        this.confirmRequest(formData, 'VERIFY');
    }
    openPopup(isOTPReceived: boolean, formData: any) {
        const payLoad = {
            details: {
                data: {
                    requestType: '18',
                    accountNo: formData.fromAccount.account_no,
                    embossingName: formData.embossingName,
                    cardType: formData.cardType,
                    mobileNo: formData.contactNumber,
                    limit: formData.creditLimit,
                    currency: formData.fromAccount.currency,
                    isOTPEnabled: true,
                },
            },
        };

        const ref = this.dialog.openDrawer('Credit Card Request Summary', GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmRequest(formData, 'CONFIRM', isOTPReceived, result.data.otp);
            }
        });
    }
    public confirmRequest(formData: any, action: any, isOTPReceived = false, otp = '') {
        let payload = {
            request: {
                accountNumber: formData.fromAccount.account_no,
                mobileNumber: formData.contactNumber,
                embossingName: formData.embossingName,
                limit: formData.creditLimit,
                cardType: formData.cardType,
                currency: formData.fromAccount.currency,
            },
            action: action,
            validateOTPRequest: isOTPReceived ? { softTokenUser: false, otp: otp } : {},
        };
        this.sandBox.sendCreditCardRequest(payload).subscribe((res: any) => {
            if (res) {
                if (action === 'VERIFY') {
                    let isOTPReceived = true;
                    this.openPopup(isOTPReceived, formData);
                } else {
                    if (res.data) {
                        this.isRequestSuccess = true;
                        this.statusData.requestType = '18';
                        this.statusData.accountNo = formData.fromAccount.account_no;
                        this.statusData.cardType = formData.cardType;
                        this.statusData.embossingName = formData.embossingName;
                        this.statusData.mobileNo = formData.contactNumber;
                        this.statusData.limit = formData.creditLimit;
                        this.statusData.currency = formData.fromAccount.currency;
                        this.statusData.statusMessage = res.data.requestId
                            ? 'Your Request has been sent for approval. Request ID #: ' + res.data.requestId
                            : 'Your Request has been created successfully. Request ID #' + res.data;
                    }
                }
            }
        });
    }
}
