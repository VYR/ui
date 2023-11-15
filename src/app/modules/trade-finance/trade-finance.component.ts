import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { TradeFinanceSandbox } from './trade-finance.sandbox';

@Component({
    selector: 'app-trade-finance',
    templateUrl: './trade-finance.component.html',
    styleUrls: ['./trade-finance.component.scss'],
})
export class TradeFinanceComponent implements OnInit, OnDestroy {
    menu: any = [];
    landing: any = {
        uuid: '',
        name: '',
        path: 'landing',
        icon: 'las la-home',
    };
    constructor(private sandbox: TradeFinanceSandbox, private router: Router) {}

    ngOnInit(): void {
        this.sandbox.moduleSelected.subscribe((data: any) => {
            if (!data) return;
            if (!data.selected) {
                this.router.navigate([`${APP_ROUTES.TRADE_FINANCE}/landing`]);
            } else {
                this.menu = data.selected.path === 'landing' ? [this.landing] : [this.landing, ...data.menu];
                this.router.navigate([`${APP_ROUTES.TRADE_FINANCE}/${data.selected.path}`]);
            }
        });
    }

    ngOnDestroy(): void {
        this.sandbox.moduleSelected.next(null);
    }
}
