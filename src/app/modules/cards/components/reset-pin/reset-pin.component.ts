import { Component, OnInit } from '@angular/core';
import { CardsSandbox } from '../../cards.sandbox';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { UtilService } from 'src/app/utility/utility.service';
import { CardDetails } from '../../model/cards.model';
import { CardPopupDetailsComponent } from '../../components/card-popup-details/card-popup-details.component';
@Component({
    selector: 'app-reset-pin',
    templateUrl: './reset-pin.component.html',
    styleUrls: ['./reset-pin.component.scss'],
})
export class ResetPinComponent implements OnInit {
    cardDetails: CardDetails = new CardDetails();
    DECISION = DECISION;
    isClearData: boolean = false;
    isValidForm: boolean = false;
    inputStatus: any = { value: '', status: false };
    constructor(private sandBox: CardsSandbox, private dialog: CibDialogService, private utilService: UtilService) {}

    ngOnInit(): void {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
        });
    }

    sentRequest() {
        let payLoad: any = {};
        payLoad = {
            debitCardPinResetRequest: {
                cardNumber: this.cardDetails.cardNumberUnmasked,
                type: 'Dr',
                pin: this.inputStatus.value,
                confirmedPin: this.inputStatus.value,
                expiry: '',
            },
            action: DECISION.VERIFY,
            validateOTPRequest: {},
        };
        this.processRequest(DECISION.VERIFY, payLoad);
    }

    processRequest(decision: any, payLoad: any) {
        this.sandBox.resetCardPIN(payLoad).subscribe((response: any) => {
            if (response.data) {
                if (decision === DECISION.VERIFY) {
                    payLoad.action = DECISION.CONFIRM;
                    const isOTPReceived: boolean = response.data?.tokenSent;
                    this.openPopUp(payLoad, isOTPReceived);
                } else {
                    this.isClearData = true;
                    this.utilService.displayNotification('PIN has been reset successfully!', 'success');
                }
            }
        });
    }

    openPopUp(payLoad: any, isOTPReceived: boolean) {
        let data = { type: 'resetPIN', details: payLoad.debitCardPinResetRequest };
        const ref = this.dialog.openDrawer('RESET PIN Request Summary', CardPopupDetailsComponent, data);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                payLoad.validateOTPRequest = { tokenSent: isOTPReceived, otp: result.otp };
                this.processRequest(result.decision, payLoad);
            }
        });
    }

    onInputMatched(inputStatus: any) {
        this.inputStatus = inputStatus;
        this.isValidForm = this.inputStatus.status;
    }
}
