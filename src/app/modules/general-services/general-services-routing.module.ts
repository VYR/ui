import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralServicesComponent } from './general-services.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { ChequeBookComponent } from './components/cheque-book/cheque-book.component';
import { EStatementComponent } from './components/e-statement/e-statement.component';
import { BalanceConfirmationComponent } from './components/balance-confirmation/balance-confirmation.component';
import { ChequeImageComponent } from './components/cheque-image/cheque-image.component';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CorporateDepositCardComponent } from './components/corporate-deposit-card/corporate-deposit-card.component';
import { AamaliDebitCardComponent } from './components/aamali-debit-card/aamali-debit-card.component';

const routes: Routes = [
    {
        path: '',
        component: GeneralServicesComponent,
        children: [
            {
                path: 'list',
                component: ServicesListComponent,
            },
            {
                path: 'cheque-book',
                component: ChequeBookComponent,
            },
            {
                path: 'e-statement',
                component: EStatementComponent,
            },
            {
                path: 'balance-confirmation',
                component: BalanceConfirmationComponent,
            },
            {
                path: 'cheque-image',
                component: ChequeImageComponent,
            },
            {
                path: 'user-status',
                component: UserStatusComponent,
            },
            {
                path: 'credit-card',
                component: CreditCardComponent,
            },
            {
                path: 'cheque-image',
                component: ChequeImageComponent,
            },
            {
                path: 'corporate-deposit-card',
                component: CorporateDepositCardComponent,
            },
            {
                path: 'aamali-debit-card',
                component: AamaliDebitCardComponent,
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneralServicesRoutingModule {}
