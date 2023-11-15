import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitCardsComponent } from './debit-cards.component';
import { DebitCardsRoutingModule } from './debit-cards-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CardsSandbox } from '../cards.sandbox';

@NgModule({
    declarations: [DebitCardsComponent],
    imports: [
        CommonModule,
        DebitCardsRoutingModule,
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
        MatDatepickerModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonToggleModule,
    ],
    providers: [CardsSandbox],
})
export class DebitCardsModule {}
