import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DhareebaComponent } from './components/dhareeba/dhareeba.component';
import { KahramaaComponent } from './components/kahramaa/kahramaa.component';
import { OordedooComponent } from './components/oordedoo/oordedoo.component';
import { PaymentsListComponent } from './components/payments-list/payments-list.component';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentsComponent,
        children: [
            {
                path: 'ooredoo',
                component: OordedooComponent,
            },
            {
                path: 'kahramaa',
                component: KahramaaComponent,
            },
            {
                path: 'dhareeba',
                component: DhareebaComponent,
            },
            {
                path: 'payments',
                component: PaymentsListComponent,
            },
            {
                path: '',
                redirectTo: 'payments',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PaymentsRoutingModule {}
