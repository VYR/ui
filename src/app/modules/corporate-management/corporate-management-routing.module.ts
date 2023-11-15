import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CorporateManagementComponent } from './corporate-management.component';
import { CorporateGroupComponent } from './components/corporate-group/corporate-group.component';
import { TemplateMappingComponent } from './components/template-mapping/template-mapping.component';
import { PositivePayRegistrationComponent } from './components/positive-pay-registration/positive-pay-registration.component';
import { HostToHostComponent } from './components/host-to-host/host-to-host.component';
import { CorporateComponent } from './components/corporate/corporate.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { DelinkToDeviceComponent } from './components/delink-to-device/delink-to-device.component';

const routes: Routes = [
    {
        path: '',
        component: CorporateManagementComponent,
        children: [
            {
                path: 'delink-to-device',
                component: DelinkToDeviceComponent,
            },
            {
                path: 'host-to-host',
                component: HostToHostComponent,
            },
            {
                path: 'positive-pay-registration',
                component: PositivePayRegistrationComponent,
            },
            {
                path: 'template-mapping',
                component: TemplateMappingComponent,
            },
            {
                path: 'corporate-groups',
                component: CorporateGroupComponent,
            },
            {
                path: 'corporate',
                component: CorporateComponent,
            },
            {
                path: 'transaction-history',
                component: TransactionHistoryComponent,
            },
            {
                path: '',
                redirectTo: 'corporate',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CorporateManagementRoutingModule {}
