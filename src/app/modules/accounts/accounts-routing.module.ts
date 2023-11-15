import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { InvestmentsComponent } from './components/investments/investments.component';
import { OpenNewCDAccountComponent } from './components/open-new-cd-account/open-new-cd-account.component';
import { OpenNewFDAccountComponent } from './components/open-new-fd-account/open-new-fd-account.component';
import { RevolvingLimitsComponent } from './components/revolving-limits/revolving-limits.component';

const routes: Routes = [
    {
        path: '',
        component: AccountsComponent,
        children: [
            {
                path: 'transactional',
                loadChildren: () =>
                    import('./transactional-accounts/transactional-accounts.module').then(
                        (m) => m.TransactionalAccountsModule
                    ),
            },
            {
                path: 'deposits',
                component: InvestmentsComponent,
            },
            {
                path: 'revolving',
                component: RevolvingLimitsComponent,
            },
            {
                path: 'finance',
                loadChildren: () =>
                    import('./finance-accounts/finance-accounts.module').then((m) => m.FinanceAccountsModule),
            },
            {
                path: 'open-new-cd-account',
                component: OpenNewCDAccountComponent,
            },
            {
                path: 'open-new-fd-account',
                component: OpenNewFDAccountComponent,
            },
            {
                path: '',
                redirectTo: 'transactional',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountsRoutingModule {}
