import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeManagementComponent } from './cheque-management.component';
import { PdcComponent } from './pdc/pdc.component';
import { PositivePayComponent } from './positive-pay/positive-pay.component';

const routes: Routes = [
    {
        path: '',
        component: ChequeManagementComponent,
        children: [
            {
                path: 'pdc',
                component: PdcComponent,
            },
            {
                path: 'positive-pay',
                component: PositivePayComponent,
            },
            {
                path: '',
                redirectTo: 'pdc',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChequeManagementRoutingModule {}
