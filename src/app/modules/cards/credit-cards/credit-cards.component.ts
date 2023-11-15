import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CardsSandbox } from '../cards.sandbox';
import { CardDetails } from '../model/cards.model';
import { CARD_TYPES } from 'src/app/shared/enums';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-credit-cards',
    templateUrl: './credit-cards.component.html',
    styleUrls: ['./credit-cards.component.scss'],
})
export class CreditCardsComponent implements OnInit, OnDestroy {
    public cards: any = [];

    public cardbasedMenu: Array<any> = [
        {
            uuid: '',
            name: 'DETAILS',
            path: 'card-info',
            disable: false,
        },
        {
            uuid: 'PAYMENT_CREDIT_CARD',
            name: 'PAYMENT',
            path: 'payment',
            disable: false,
        },
        {
            uuid: 'CARDS_TRANSACTION_HISTORY',
            name: 'TRANSACTIONS',
            path: 'transactions',
            disable: false,
        },
        {
            uuid: 'CARDS_CREDIT_MAGNETIC_STRIP_INQUIRE',
            name: 'MAGSTRIPE',
            path: 'magstripe',
            disable: false,
        },
    ];
    public menu: Array<any> = [];
    selectedCard: CardDetails = new CardDetails();
    app_routes: any = APP_ROUTES;
    isBulkPayment: boolean = false;
    routeSubs!: Subscription;

    constructor(private sandBox: CardsSandbox, private router: Router, private route: Router) {
        this.sandBox.getCardsList(CARD_TYPES.CREDIT).subscribe((res: any) => {
            this.cards = res || [];
            if (this.cards.length > 0) {
                this.setActiveCard(this.cards[0], 0);
            } else {
                this.sandBox.setActiveCard(new CardDetails(), -1, CARD_TYPES.DEBIT);
            }
        });
        this.sandBox.selectedCard.subscribe((res: any) => {
            this.selectedCard = res;
            this.menu = this._restrictTabsAccess(this.selectedCard.cardStatus, this.cardbasedMenu);
            const activeMenu = this.menu.find((x) => !x.disable);
            if (activeMenu.path) this.router.navigate([APP_ROUTES.CREDIT_CARDS + '/' + activeMenu.path]);
        });
    }

    ngOnInit(): void {
        this.routeSubs = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === APP_ROUTES.CREDIT_CARDS + '/card-due') {
                    this.isBulkPayment = true;
                } else {
                    this.isBulkPayment = false;
                }
            }
        });
    }

    setActiveCard(card: any, index: number) {
        this.sandBox.setActiveCard(card, index, CARD_TYPES.CREDIT);
    }

    private _restrictTabsAccess(status: any, menu: Array<any>) {
        menu.map(() => {
            if (status) {
                switch (status.toLowerCase()) {
                    //NOTE: needs buisness confirmation
                    case 'active':
                        menu.map((item: any) => {
                            item.disable = false;
                            return item;
                        });
                        break;
                    case 'blocked':
                        menu.map((item: any) => {
                            item.disable = item.path === 'magstripe' ? true : false;
                            return item;
                        });
                        break;

                    case 'payment overdue':
                        menu.map((item: any) => {
                            item.disable = item.path === 'magstripe' ? true : false;
                            return item;
                        });
                        break;

                    case 'new':
                        menu.map((item: any) => {
                            item.disable = item.path === 'card-info' ? false : true;
                            return item;
                        });
                        break;
                    default:
                        break;
                }
            }
        });
        return menu;
    }

    ngOnDestroy() {
        this.sandBox.setActiveCard(new CardDetails(), -1, CARD_TYPES.CREDIT);
        this.routeSubs.unsubscribe();
    }
}
