import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardInfoComponent } from '../components/card-info/card-info.component';
import { MagstripeComponent } from '../components/magstripe/magstripe.component';
import { TransactionsComponent } from '../components/transactions/transactions.component';
import { DebitCardsComponent } from './debit-cards.component';
import { ResetPinComponent } from '../components/reset-pin/reset-pin.component';

const routes: Routes = [
    {
        path: '',
        component: DebitCardsComponent,
        children: [
            {
                path: '',
                component: CardInfoComponent,
            },
            {
                path: 'info',
                component: CardInfoComponent,
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
                path: 'reset-pin',
                component: ResetPinComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DebitCardsRoutingModule {}
