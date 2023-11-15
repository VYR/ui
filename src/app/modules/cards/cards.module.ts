import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';
import { PaymentComponent } from './components/payment/payment.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { MagstripeComponent } from './components/magstripe/magstripe.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { CardDueComponent } from './components/card-due/card-due.component';
import { CardBlockingDialogComponent } from './components/card-blocking-dialog/card-blocking-dialog.component';
import { CardPopupDetailsComponent } from './components/card-popup-details/card-popup-details.component';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatCardModule } from '@angular/material/card';
import { CardsListComponent } from './cards-list/cards-list.component';
import { ResetPinComponent } from './components/reset-pin/reset-pin.component';

@NgModule({
    declarations: [
        CardsComponent,
        PaymentComponent,
        TransactionsComponent,
        MagstripeComponent,
        PaymentCardComponent,
        CardDueComponent,
        CardBlockingDialogComponent,
        CardPopupDetailsComponent,
        CardInfoComponent,
        CardsListComponent,
        ResetPinComponent,
    ],
    imports: [
        CommonModule,
        CardsRoutingModule,
        CibComponentsModule,
        PipesModule,
        DirectivesModule,
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
        MatCardModule,
        MatDatepickerModule,
    ],
})
export class CardsModule {}
