import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceStatementComponent } from '../components/finance-statement/finance-statement.component';
import { FinanceComponent } from '../components/finance/finance.component';
import { FinanceAccountsComponent } from './finance-accounts.component';

const routes: Routes = [
    {
        path: '',
        component: FinanceAccountsComponent,
        children: [
            {
                path: 'finance-list',
                component: FinanceComponent,
            },
            {
                path: 'finance-statement',
                component: FinanceStatementComponent,
            },
            {
                path: '',
                redirectTo: 'finance-list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FinanceAccountsRoutingModule {}
