import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { OperationsApprovalsRoutingModule } from './operations-approvals-routing.module';
import { OperationsApprovalsComponent } from './operations-approvals.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { LcInquiryComponent } from './lc-inquiry/lc-inquiry.component';
import { BgInquiryComponent } from './bg-inquiry/bg-inquiry.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { OperationsApprovalsSandbox } from './operations-approvals.sandbox';
import { MyOperationsRequestsComponent } from './my-operations-requests/my-operations-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperationsApprovalsViewComponent } from './operations-approvals-view/operations-approvals-view.component';
import { OperationsApprovalsActionComponent } from './operations-approvals-action/operations-approvals-action.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { DeleteRequestConfirmComponent } from './delete-request-confirm/delete-request-confirm.component';
import { OperationsCommentsHistoryComponent } from './operations-comments-history/operations-comments-history.component';
import { InquiryListingComponent } from './inquiry-listing/inquiry-listing.component';
import { LcViewComponent } from './lc-view/lc-view.component';
import { BgViewComponent } from './bg-view/bg-view.component';

@NgModule({
    declarations: [
        OperationsApprovalsComponent,
        LcInquiryComponent,
        BgInquiryComponent,
        ServiceRequestComponent,
        MyOperationsRequestsComponent,
        OperationsApprovalsViewComponent,
        OperationsApprovalsActionComponent,
        LcViewComponent,
        BgViewComponent,
        DeleteRequestConfirmComponent,
        OperationsCommentsHistoryComponent,
        InquiryListingComponent,
    ],
    imports: [
        CommonModule,
        OperationsApprovalsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatTabsModule,
        CibComponentsModule,
        PipesModule,
        DirectivesModule,
        MatMenuModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
    ],
    providers: [OperationsApprovalsSandbox, DecimalPipe],
})
export class OperationsApprovalsModule {}
