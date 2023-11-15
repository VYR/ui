import { Component, OnInit } from '@angular/core';
import { CardsSandbox } from '../../cards.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CardPopupDetailsComponent } from '../card-popup-details/card-popup-details.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { Router } from '@angular/router';
import { CardDetails } from '../../model/cards.model';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    public paymentForm!: UntypedFormGroup;
    countryList: any = [];
    accounts: any = [];
    cardDetails: CardDetails = new CardDetails();
    curncy = '';
    constructor(
        private sandBox: CardsSandbox,
        public fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private router: Router
    ) {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
        });
        this.sandBox.accounts.subscribe((res: any) => {
            this.accounts = res || [];
        });
    }

    ngOnInit(): void {
        this.paymentForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
            amount: [null, [Validators.required]],
        });
    }

    public cancelPayment() {
        this.paymentForm.reset();
    }

    public makePayment() {
        const formData: any = this.paymentForm.value;
        this.verifyPayment(formData);
    }

    verifyPayment(formData: any) {
        let postParams = {
            accountId: formData.fromAccount.account_no,
            cardNumber: this.cardDetails.cardNumberUnmasked,
            amount: formData.amount,
            currency: this.curncy,
            action: 'VERIFY',
            validateOTPRequest: {},
        };
        this.sandBox.makeSingleCardPayment(postParams).subscribe((response: any) => {
            if (response.data) {
                this.openOtpPanel(postParams);
            }
        });
    }

    openOtpPanel(postParams: any) {
        const payLoad = {
            type: 'payment',
            details: {
                cardNumber: this.cardDetails.cardNumber,
                fromAccount: postParams.accountId,
                amount: postParams.amount,
                currency: postParams.currency,
            },
        };

        const ref = this.dialog.openDrawer('Payment Summary', CardPopupDetailsComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmPayment(postParams, result.otp);
            }
        });
    }

    confirmPayment(postParams: any, otp: any) {
        postParams['action'] = 'CONFIRM';
        (postParams['validateOTPRequest'] = {
            softTokenUser: false,
            otp: otp,
        }),
            this.sandBox.makeSingleCardPayment(postParams).subscribe((response: any) => {
                if (response.data) {
                    this.paymentForm.reset();
                }
            });
    }

    onAccountChange(acc: any) {
        this.curncy = acc.currency;
    }
}
