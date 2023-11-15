import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsListComponent } from './cards-list/cards-list.component';
import { CardsComponent } from './cards.component';

const routes: Routes = [
    {
        path: '',
        component: CardsComponent,
        children: [
            {
                path: 'debit-cards',
                loadChildren: () => import('./debit-cards/debit-cards.module').then((m) => m.DebitCardsModule),
                data: { isDebit: true },
            },
            {
                path: 'credit-cards',
                loadChildren: () => import('./credit-cards/credit-cards.module').then((m) => m.CreditCardsModule),
            },
            {
                path: 'cards-list',
                component: CardsListComponent,
            },
            {
                path: '',
                redirectTo: 'cards-list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CardsRoutingModule {}
