import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { FutureDatedTransfersRoutingModule } from './future-dated-transfers-routing.module';
import { FutureDatedTransfersComponent } from './future-dated-transfers.component';
import { CreateFutureTransfersComponent } from './create-future-transfers/create-future-transfers.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { FtDetailsComponent } from './ft-details/ft-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
    declarations: [FutureDatedTransfersComponent, CreateFutureTransfersComponent, FtDetailsComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatToolbarModule,
        MatCardModule,
        MatTabsModule,
        FutureDatedTransfersRoutingModule,
        CibComponentsModule,
        PipesModule,
        DirectivesModule,
    ],
})
export class FutureDatedTransfersModule {}
