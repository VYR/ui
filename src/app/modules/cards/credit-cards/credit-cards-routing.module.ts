import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDueComponent } from '../components/card-due/card-due.component';
import { CardInfoComponent } from '../components/card-info/card-info.component';
import { MagstripeComponent } from '../components/magstripe/magstripe.component';
import { PaymentComponent } from '../components/payment/payment.component';
import { TransactionsComponent } from '../components/transactions/transactions.component';
import { CreditCardsComponent } from './credit-cards.component';

const routes: Routes = [
    {
        path: '',
        component: CreditCardsComponent,
        children: [
            {
                path: 'card-due',
                component: CardDueComponent,
            },
            {
                path: 'card-info',
                component: CardInfoComponent,
            },
            {
                path: 'payment',
                component: PaymentComponent,
            },
            {
                path: 'transactions',
                component: TransactionsComponent,
            },
            {
                path: 'magstripe',
                component: MagstripeComponent,
            },
            {
                path: '',
                redirectTo: 'card-due',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreditCardsRoutingModule {}
