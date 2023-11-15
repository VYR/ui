import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { ChequeManagementRoutingModule } from './cheque-management-routing.module';
import { ChequeManagementComponent } from './cheque-management.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { PositivePayComponent } from './positive-pay/positive-pay.component';
import { PdcComponent } from './pdc/pdc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ChequeSummaryComponent } from './cheque-summary/cheque-summary.component';
import { MatSelectModule } from '@angular/material/select';
import { ChequeDetailsComponent } from './cheque-details/cheque-details.component';

@NgModule({
    declarations: [
        ChequeManagementComponent,
        PositivePayComponent,
        PdcComponent,
        ChequeSummaryComponent,
        ChequeDetailsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        PipesModule,
        DirectivesModule,
        ChequeManagementRoutingModule,
        CibComponentsModule,
    ],
    providers: [DecimalPipe],
})
export class ChequeManagementModule {}
