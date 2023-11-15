import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from '../components/account-list/account-list.component';
import { AccountSummaryComponent } from '../components/account-summary/account-summary.component';
import { TransactionalAccountsComponent } from './transactional-accounts.component';

const routes: Routes = [
    {
        path: '',
        component: TransactionalAccountsComponent,
        children: [
            {
                path: 'account-list',
                component: AccountListComponent,
            },
            {
                path: 'account-summary',
                component: AccountSummaryComponent,
            },
            {
                path: '',
                redirectTo: 'account-list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransactionalAccountsRoutingModule {}
