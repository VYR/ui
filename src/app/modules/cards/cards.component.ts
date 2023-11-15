import { Component } from '@angular/core';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
    public cardsMenu: Array<any> = [
        {
            uuid: '',
            name: 'All cards',
            path: 'cards-list',
        },
        {
            uuid: 'CREDIT_CARDS',
            name: 'Credit cards',
            path: 'credit-cards',
        },
        {
            uuid: 'DEBIT_CARDS',
            name: 'Aamaly Debit cards',
            path: 'debit-cards',
        },
    ];
}
