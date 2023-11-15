import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CibComponentsModule } from '../../cib-components/cib-components.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PipesModule } from '../../shared/pipes/pipes.module';

import { LiquidityManagementComponent } from './liquidity-management.component';
import { RouterModule } from '@angular/router';
import { LiquidityManagementRoutingModule } from './liquidity-management-routing.module';
import { AutoCoverComponent } from './components/auto-cover/auto-cover.component';
import { SweepBalanceComponent } from './components/sweep-balance/sweep-balance.component';
import { LiquidityConfirmationComponent } from './components/liquidity-confirmation/liquidity-confirmation.component';

@NgModule({
    declarations: [
        LiquidityManagementComponent,
        AutoCoverComponent,
        SweepBalanceComponent,
        LiquidityConfirmationComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        PipesModule,
        DirectivesModule,
        CibComponentsModule,
        LiquidityManagementRoutingModule,
    ],
})
export class LiquidityManagementModule {}
