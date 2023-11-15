import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralServicesRoutingModule } from './general-services-routing.module';
import { GeneralServicesComponent } from './general-services.component';
import { GeneralServicesSandbox } from './general-services.sandbox';

import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChequeBookComponent } from './components/cheque-book/cheque-book.component';
import { EStatementComponent } from './components/e-statement/e-statement.component';
import { BalanceConfirmationComponent } from './components/balance-confirmation/balance-confirmation.component';
import { ChequeImageComponent } from './components/cheque-image/cheque-image.component';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CorporateDepositCardComponent } from './components/corporate-deposit-card/corporate-deposit-card.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { GeneralServicePopupComponent } from './components/general-service-popup/general-service-popup.component';
import { RequestsListTableComponent } from './components/requests-list-table/requests-list-table.component';
import { RequestStatusComponent } from './components/request-status/request-status.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CorporateDepositCardRequestConfirmationComponent } from './components/corporate-deposit-card-request-confirmation/corporate-deposit-card-request-confirmation.component';
import { CorporateDepositCardRequestSuccessComponent } from './components/corporate-deposit-card-request-success/corporate-deposit-card-request-success.component';
import { CorporateDepositCardHistoryComponent } from './components/corporate-deposit-card-history/corporate-deposit-card-history.component';
import { CorporateDepositCardHistoryPopupComponent } from './components/corporate-deposit-card-history-popup/corporate-deposit-card-history-popup.component';
import { AamaliDebitCardComponent } from './components/aamali-debit-card/aamali-debit-card.component';
import { AamaliDebitCardHistoryComponent } from './components/aamali-debit-card-history/aamali-debit-card-history.component';
import { AamaliDebitCardHistoryPopupComponent } from './components/aamali-debit-card-history-popup/aamali-debit-card-history-popup.component';
import { AamaliDebitCardRequestConfirmationComponent } from './components/aamali-debit-card-request-confirmation/aamali-debit-card-request-confirmation.component';
import { AamaliDebitCardRequestSuccessComponent } from './components/aamali-debit-card-request-success/aamali-debit-card-request-success.component';
import { PreviewComponent } from './components/preview/preview.component';

@NgModule({
    declarations: [
        GeneralServicesComponent,
        ChequeBookComponent,
        EStatementComponent,
        BalanceConfirmationComponent,
        ChequeImageComponent,
        UserStatusComponent,
        CreditCardComponent,
        CorporateDepositCardComponent,
        ServicesListComponent,
        GeneralServicePopupComponent,
        RequestsListTableComponent,
        RequestStatusComponent,
        CorporateDepositCardRequestConfirmationComponent,
        CorporateDepositCardRequestSuccessComponent,
        CorporateDepositCardHistoryComponent,
        CorporateDepositCardHistoryPopupComponent,
        AamaliDebitCardComponent,
        AamaliDebitCardHistoryComponent,
        AamaliDebitCardHistoryPopupComponent,
        AamaliDebitCardRequestConfirmationComponent,
        AamaliDebitCardRequestSuccessComponent,
        PreviewComponent,
    ],
    imports: [
        CommonModule,
        GeneralServicesRoutingModule,
        PipesModule,
        DirectivesModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatTabsModule,
        MatTableModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonToggleModule,
    ],
    providers: [GeneralServicesSandbox],
    exports: [RequestsListTableComponent, RequestStatusComponent],
})
export class GeneralServicesModule {}
