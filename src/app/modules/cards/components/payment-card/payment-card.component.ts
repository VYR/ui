import { Component, OnInit, Input } from '@angular/core';
import { CardsSandbox } from '../../cards.sandbox';
import { CardDetails } from '../../model/cards.model';
@Component({
    selector: 'app-payment-card',
    templateUrl: './payment-card.component.html',
    styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {
    cardDetails: any;
    constructor(private sandBox: CardsSandbox) {}

    ngOnInit(): void {
        this.sandBox.selectedCard.subscribe((value: CardDetails) => {
            this.cardDetails = value;
        });
    }
}
