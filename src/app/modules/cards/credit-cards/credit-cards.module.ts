import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditCardsRoutingModule } from './credit-cards-routing.module';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CreditCardsComponent } from './credit-cards.component';
import { CardsSandbox } from '../cards.sandbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
    declarations: [CreditCardsComponent],
    imports: [
        CommonModule,
        PipesModule,
        DirectivesModule,
        CreditCardsRoutingModule,
        CibComponentsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    providers: [CardsSandbox],
})
export class CreditCardsModule {}
