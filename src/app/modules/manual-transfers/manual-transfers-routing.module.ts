import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualTransfersComponent } from './manual-transfers.component';
import { CreateManualTransferComponent } from './components/create-manual-transfer/create-manual-transfer.component';
import { ManualTransferListComponent } from './components/manual-transfer-list/manual-transfer-list.component';

const routes: Routes = [
    {
        path: '',
        component: ManualTransfersComponent,
        children: [
            {
                path: 'manual-transfer-list',
                component: ManualTransferListComponent,
            },
            {
                path: 'create-manual-transfer',
                component: CreateManualTransferComponent,
            },
            {
                path: '',
                redirectTo: 'manual-transfer-list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManualTransfersRoutingModule {}
