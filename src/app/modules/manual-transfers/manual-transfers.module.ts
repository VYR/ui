import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualTransfersRoutingModule } from './manual-transfers-routing.module';
import { ManualTransfersComponent } from './manual-transfers.component';
import { ManualTransfersSandbox } from './manual-transfers.sandbox';
import { ManualTransferListComponent } from './components/manual-transfer-list/manual-transfer-list.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CreateManualTransferComponent } from './components/create-manual-transfer/create-manual-transfer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPerviewComponent } from './components/mat-perview/mat-perview.component';

@NgModule({
    declarations: [
        ManualTransfersComponent,
        ManualTransferListComponent,
        CreateManualTransferComponent,
        MatPerviewComponent,
    ],
    imports: [
        CommonModule,
        PipesModule,
        DirectivesModule,
        ManualTransfersRoutingModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
    ],
    providers: [ManualTransfersSandbox],
})
export class ManualTransfersModule {}
