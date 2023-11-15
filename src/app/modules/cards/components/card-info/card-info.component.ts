import { Component, OnInit } from '@angular/core';
import { CardsSandbox } from '../../cards.sandbox';
import { CardDetails } from '../../model/cards.model';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CardBlockingDialogComponent } from '../card-blocking-dialog/card-blocking-dialog.component';
import { CARD_STATUS, DECISION } from 'src/app/shared/enums';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-card-info',
    templateUrl: './card-info.component.html',
    styleUrls: ['./card-info.component.scss'],
})
export class CardInfoComponent {
    cardDetails: CardDetails = new CardDetails();
    CARD_STATUS = CARD_STATUS;
    constructor(private sandBox: CardsSandbox, private dialog: CibDialogService, private router: Router) {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
            if (!this.cardDetails.isDebit) this.cardDetails.allowAction = true;
        });
    }

    public modifyCardStatus(status: CARD_STATUS) {
        let action = '';
        if (this.cardDetails.isDebit && this.cardDetails.cardStatus === CARD_STATUS.NEW) {
            action = DECISION.ACTIVATE;
        } else {
            action = status == CARD_STATUS.BLOCKED ? DECISION.ACTIVATE : DECISION.BLOCK;
        }
        const ref = this.dialog.openDialog(CibDialogType.small, CardBlockingDialogComponent, {
            type: 'cardStatus',
            action: action,
            cardNumber: this.cardDetails.cardNumberUnmasked,
            cardNumberMasked: this.cardDetails.cardNumber,
            cardType: this.cardDetails.cardName,
        });
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.sandBox.modifyCardStatus(result.data, this.cardDetails.isDebit).subscribe();
            }
        });
    }
    goToAccounts(accNo: any) {
        this.router.navigate([APP_ROUTES.ACC_LIST], { state: { accNo: accNo } });
    }
}
