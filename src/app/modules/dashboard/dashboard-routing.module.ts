import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedOverviewComponent } from './components/completed-overview/completed-overview.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { OverviewComponent } from './components/overview/overview.component';
import { PendingRequestsComponent } from './components/pending-requests/pending-requests.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'overview',
                component: OverviewComponent,
            },
            {
                path: 'detailed',
                component: DetailViewComponent,
                children: [
                    {
                        path: 'pending',
                        component: PendingRequestsComponent,
                    },
                    {
                        path: 'completed',
                        component: CompletedOverviewComponent,
                    },
                    {
                        path: '',
                        redirectTo: 'pending',
                        pathMatch: 'full',
                    },
                ],
            },
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
