import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkTransferDraftsComponent } from '../components/bulk-transfer-drafts/bulk-transfer-drafts.component';
import { TransferDraftsComponent } from '../components/transfer-drafts/transfer-drafts.component';
import { DraftsComponent } from './drafts.component';
const routes: Routes = [
    {
        path: '',
        component: DraftsComponent,
        children: [
            {
                path: 'bulk-transfer-drafts',
                component: BulkTransferDraftsComponent,
            },
            {
                path: 'transfer-drafts',
                component: TransferDraftsComponent,
            },
            {
                path: '',
                redirectTo: 'transfer-drafts',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DraftsRoutingModule {}
