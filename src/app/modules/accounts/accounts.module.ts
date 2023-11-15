import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { AccountListComponent } from './components/account-list/account-list.component';
import { InvestmentsComponent } from './components/investments/investments.component';
import { OpenNewCDAccountComponent } from './components/open-new-cd-account/open-new-cd-account.component';
import { OpenNewFDAccountComponent } from './components/open-new-fd-account/open-new-fd-account.component';
import { MatMenuModule } from '@angular/material/menu';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { MatButtonModule } from '@angular/material/button';
import { InvestmentDetailsComponent } from './components/investment-details/investment-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AccountSummaryComponent } from './components/account-summary/account-summary.component';
import { RevolvingLimitsComponent } from './components/revolving-limits/revolving-limits.component';
import { MatRadioModule } from '@angular/material/radio';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NewAccountViewComponent } from './components/new-account-view/new-account-view.component';
import { AccountTransationsDetailsComponent } from './components/account-transactions-details/account-transactions-details.component';
import { FinanceComponent } from './components/finance/finance.component';
import { FinanceDetailsComponent } from './components/finance-details/finance-details.component';
import { FinanceStatementComponent } from './components/finance-statement/finance-statement.component';
import { FinanceAccountsComponent } from './finance-accounts/finance-accounts.component';
import { AuthenticationSandbox } from '../authentication/authentication.sandbox';

@NgModule({
    declarations: [
        AccountsComponent,
        AccountListComponent,
        InvestmentsComponent,
        OpenNewCDAccountComponent,
        OpenNewFDAccountComponent,
        AccountDetailsComponent,
        InvestmentDetailsComponent,
        AccountSummaryComponent,
        RevolvingLimitsComponent,
        NewAccountViewComponent,
        AccountTransationsDetailsComponent,
        FinanceComponent,
        FinanceDetailsComponent,
        FinanceStatementComponent,
        FinanceAccountsComponent,
    ],
    imports: [
        CommonModule,
        AccountsRoutingModule,
        MatMenuModule,
        CibComponentsModule,
        MatButtonModule,
        FlexLayoutModule,
        MatDatepickerModule,
        MatInputModule,
        FormsModule,
        PipesModule,
        DirectivesModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatToolbarModule,
    ],
})
export class AccountsModule {}
