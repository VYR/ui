import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceDeskRoutingModule } from './customer-service-desk-routing.module';
import { CustomerServiceDeskComponent } from './customer-service-desk.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatInputModule } from '@angular/material/input';
import { CsdApprovalsActionComponent } from './components/csd-approvals-action/csd-approvals-action.component';
import { MatMenuModule } from '@angular/material/menu';
import { csdDashboardComponent } from './components/csd-dashboard/csd-dashboard.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [CustomerServiceDeskComponent, CsdApprovalsActionComponent, csdDashboardComponent],
    imports: [
        CommonModule,
        CustomerServiceDeskRoutingModule,
        CibComponentsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
    ],
})
export class CustomerServiceDeskModule {}
