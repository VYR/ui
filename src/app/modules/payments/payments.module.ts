import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';

import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OordedooComponent } from './components/oordedoo/oordedoo.component';
import { KahramaaComponent } from './components/kahramaa/kahramaa.component';
import { DhareebaComponent } from './components/dhareeba/dhareeba.component';
import { PaymentsListComponent } from './components/payments-list/payments-list.component';
import { PaymentsSandbox } from './payments.sandbox';
import { MatRadioModule } from '@angular/material/radio';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { KahramaaViewBillComponent } from './components/kahramaa/kahramaa-view-bill/kahramaa-view-bill.component';
import { DhareebaDetailsComponent } from './components/dhareeba-details/dhareeba-details.component';
import { DeleteDhareebaRequestConfirmComponent } from './components/delete-dhareeba-request-confirm/delete-dhareeba-request-confirm.component';
import { PaymentOtpViewComponent } from './components/payment-otp-view/payment-otp-view.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        PaymentsComponent,
        OordedooComponent,
        KahramaaComponent,
        DhareebaComponent,
        PaymentsListComponent,
        KahramaaViewBillComponent,
        DhareebaDetailsComponent,
        DeleteDhareebaRequestConfirmComponent,
        PaymentOtpViewComponent,
    ],
    imports: [
        CommonModule,
        PaymentsRoutingModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
        PipesModule,
        MatRadioModule,
        PipesModule,
        DirectivesModule,
        MatCardModule,
    ],
    providers: [PaymentsSandbox],
})
export class PaymentsModule {}
