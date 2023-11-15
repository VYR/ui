import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerServiceDeskComponent } from './customer-service-desk.component';
import { csdDashboardComponent } from './components/csd-dashboard/csd-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerServiceDeskComponent,
        children: [
            {
                path: 'csd-dashboard',
                component: csdDashboardComponent,
            },
            {
                path: '',
                redirectTo: 'csd-dashboard',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerServiceDeskRoutingModule {}
