import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAdminApproverDashboardComponent } from './bank-admin-approver-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: BankAdminApproverDashboardComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BankAdminApproverDashboardRoutingModule {}
