import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAdminApproverDashboardRoutingModule } from './bank-admin-approver-dashboard-routing.module';
import { BankAdminApproverDashboardComponent } from './bank-admin-approver-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [BankAdminApproverDashboardComponent, DashboardComponent, DetailViewComponent],
    imports: [
        CommonModule,
        BankAdminApproverDashboardRoutingModule,
        CibComponentsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        MatInputModule,
        MatTooltipModule,
    ],
})
export class BankAdminApproverDashboardModule {}
