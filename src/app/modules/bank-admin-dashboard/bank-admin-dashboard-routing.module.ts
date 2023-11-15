import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAdminDashboardComponent } from './bank-admin-dashboard.component';
import { ApplicationConfigComponent } from './components/application-config/application-config.component';
import { MyQueueComponent } from './components/my-queue/my-queue.component';
import { FeatureConfigComponent } from './components/feature-config/feature-config.component';

const routes: Routes = [
    {
        path: '',
        component: BankAdminDashboardComponent,
        children: [
            {
                path: 'my-queue',
                component: MyQueueComponent,
            },
            {
                path: 'app-config',
                component: ApplicationConfigComponent,
            },
            {
                path: 'feature-management',
                component: FeatureConfigComponent,
            },
            {
                path: '',
                redirectTo: 'my-queue',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BankAdminDashboardRoutingModule {}
