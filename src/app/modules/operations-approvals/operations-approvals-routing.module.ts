import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BgInquiryComponent } from './bg-inquiry/bg-inquiry.component';

import { LcInquiryComponent } from './lc-inquiry/lc-inquiry.component';
import { OperationsApprovalsComponent } from './operations-approvals.component';
import { ServiceRequestComponent } from './service-request/service-request.component';

const routes: Routes = [
    {
        path: '',
        component: OperationsApprovalsComponent,
        children: [
            {
                path: 'lc-inquiry',
                component: LcInquiryComponent,
            },
            {
                path: 'bg-inquiry',
                component: BgInquiryComponent,
            },
            {
                path: 'service-requests',
                component: ServiceRequestComponent,
            },
            {
                path: '',
                redirectTo: 'lc-inquiry',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OperationsApprovalsRoutingModule {}
