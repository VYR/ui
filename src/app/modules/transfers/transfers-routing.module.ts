import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultipleDebitBulkUploadComponent } from './components/multiple-debit-bulk-upload/multiple-debit-bulk-upload.component';
import { SingleMultipleTransfersComponent } from './components/single-multiple-transfers/single-multiple-transfers.component';
import { SalaryPostingComponent } from './components/salary-posting/salary-posting.component';
import { TransfersComponent } from './transfers.component';

const routes: Routes = [
    {
        path: '',
        component: TransfersComponent,
        children: [
            {
                path: 'single-multiple-transers',
                component: SingleMultipleTransfersComponent,
            },
            {
                path: 'multiple-debit-bulk',
                component: MultipleDebitBulkUploadComponent,
            },
            {
                path: 'drafts',
                loadChildren: () => import('./drafts/drafts.module').then((m) => m.DraftsModule),
            },
            {
                path: 'salary-posting',
                component: SalaryPostingComponent,
            },
            {
                path: '',
                redirectTo: 'single-multiple-transers',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransfersRoutingModule {}
