import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFutureTransfersComponent } from './create-future-transfers/create-future-transfers.component';
import { FutureDatedTransfersComponent } from './future-dated-transfers.component';
import { NotEntitledComponent } from '../../cib-components/not-entitled/not-entitled.component';

const routes: Routes = [
    {
        path: '',
        component: FutureDatedTransfersComponent,
        children: [
            {
                path: 'create-sto',
                component: CreateFutureTransfersComponent,
            },
            {
                path: 'sto-authorized',
                component: NotEntitledComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'create-sto',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FutureDatedTransfersRoutingModule {}
