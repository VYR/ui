import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CardsSandbox } from '../cards.sandbox';
import { CardDetails } from '../model/cards.model';
import { CARD_TYPES } from 'src/app/shared/enums';

@Component({
    selector: 'app-debit-cards',
    templateUrl: './debit-cards.component.html',
    styleUrls: ['./debit-cards.component.scss'],
})
export class DebitCardsComponent implements OnDestroy {
    public cards: any[] = [];

    public cardbasedMenu: Array<any> = [
        {
            uuid: '',
            name: 'DETAILS',
            path: 'info',
            disable: false,
        },
        {
            uuid: 'CARDS_DEBIT_MAGNETIC_STRIP_INQUIRE',
            name: 'MAGSTRIPE',
            path: 'magstripe',
            disable: false,
        },
    ];
    public menu: Array<any> = [];
    selectedCard: CardDetails = new CardDetails();
    app_routes: any = APP_ROUTES;
    showAamaliCardHistory: boolean = false;
    resetMenuItem: any = {
        uuid: 'DEBIT_CARD_PIN_RESET',
        name: 'RESET PIN',
        path: 'reset-pin',
        disable: false,
    };

    constructor(private sandBox: CardsSandbox, private router: Router, private route: ActivatedRoute) {
        this.route.data.subscribe((data: any) => {
            this.selectedCard.isDebit = data?.isDebit || false;
        });
        this.sandBox.getDebitCardList().subscribe((res: any) => {
            this.cards = res || [];
            if (this.cards.length > 0) {
                this.setActiveCard(this.cards[0], 0);
            } else {
                this.selectedCard = new CardDetails();
                this.sandBox.setActiveCard(this.selectedCard, -1, CARD_TYPES.DEBIT);
            }
        });
        this.sandBox.selectedCard.subscribe((res: any) => {
            this.selectedCard = res;
            //Hide menu, if no card selected, on load
            if (this.selectedCard.position > -1) {
                let menu: Array<any> = [];
                if (this.selectedCard.allowAction) {
                    menu = [...this.cardbasedMenu];
                    menu.push(this.resetMenuItem);
                } else {
                    menu = this.cardbasedMenu;
                }
                const updatedMenu = this._restrictTabsAccess(this.selectedCard.cardStatus, menu);
                const activeMenu = updatedMenu.find((x) => !x.disable);
                if (activeMenu?.path) this.router.navigate([APP_ROUTES.DEBIT_CARDS + '/' + activeMenu.path]);
                this.menu = updatedMenu;
            } else this.menu = [];
        });
    }

    setActiveCard(card: any, index: number) {
        card.isDebit = true;
        this.sandBox.setActiveCard(card, index, CARD_TYPES.DEBIT);
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
                            item.disable = item.path === 'info' || item.path === 'reset-pin' ? false : true;
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
        this.sandBox.setActiveCard(new CardDetails(), -1, CARD_TYPES.DEBIT);
    }
}
