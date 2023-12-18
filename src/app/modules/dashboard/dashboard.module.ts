import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { DashboardComponent } from './dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { DeleteRequestConfirmComponent } from './components/delete-request-confirm/delete-request-confirm.component';
import { DashboardRequestDetailsComponent } from './components/dashboard-request-details/dashboard-request-details.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CompletedOverviewComponent } from './components/completed-overview/completed-overview.component';
import { ApproverRequestsComponent } from './components/approver-requests/approver-requests.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MyRequestsComponent } from './components/my-requests/my-requests.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { PendingRequestsComponent } from './components/pending-requests/pending-requests.component';
import { CompletedRequestsComponent } from './components/completed-requests/completed-requests.component';
import { MyCompletedRequestsComponent } from './components/my-completed-requests/my-completed-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { QueueStatusComponent } from './components/queue-status/queue-status.component';
import { ApproverRequestsModuleWiseComponent } from './components/approver-requests-module-wise/approver-requests-module-wise.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DashboardRequestDetailsPopupComponent } from './components/dashboard-request-details-popup/dashboard-request-details-popup.component';
import { MatMenuModule } from '@angular/material/menu';
import { kycPopupComponent } from './components/kyc-popup/kyc-popup.component';
@NgModule({
    declarations: [
        DashboardComponent,
        PortfolioComponent,
        DeleteRequestConfirmComponent,
        DashboardRequestDetailsComponent,
        OverviewComponent,
        CompletedOverviewComponent,
        ApproverRequestsComponent,
        MyRequestsComponent,
        DetailViewComponent,
        PendingRequestsComponent,
        CompletedRequestsComponent,
        MyCompletedRequestsComponent,
        QueueStatusComponent,
        ApproverRequestsModuleWiseComponent,
        DashboardRequestDetailsPopupComponent,
        kycPopupComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FlexLayoutModule,
        CibComponentsModule,
        MatButtonModule,
        MatTabsModule,
        DirectivesModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule,
        MatSelectModule,
        MatInputModule,
        MatMenuModule,
    ],
    entryComponents: [DashboardRequestDetailsComponent],
})
export class DashboardModule {}
