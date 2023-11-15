import { Component, OnInit } from '@angular/core';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-cards-list',
    templateUrl: './cards-list.component.html',
    styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent {
    cardMenus: any[] = [
        {
            name: 'Credit cards',
            path: APP_ROUTES.CREDIT_CARDS,
            icon: 'las la-credit-card',
            uuid: 'CREDIT_CARDS',
        },
        {
            name: 'Aamaly Debit cards',
            path: APP_ROUTES.DEBIT_CARDS,
            icon: 'las la-credit-card',
            uuid: 'DEBIT_CARDS',
        },
    ];
}
