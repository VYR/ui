import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankGuaranteeComponent } from './components/bank-guarantee/bank-guarantee.component';
import { BgDraftsComponent } from './components/bg-drafts/bg-drafts.component';
import { BcListComponent } from './components/bc-list/bc-list.component';
import { BgStatusComponent } from './components/bg-status/bg-status.component';
import { ExportLcComponent } from './components/export-lc/export-lc.component';
import { LcDocumentsArrivalNoticeComponent } from './components/lc-documents-arrival-notice/lc-documents-arrival-notice.component';
import { LcDraftsComponent } from './components/lc-drafts/lc-drafts.component';
import { LcStatusComponent } from './components/lc-status/lc-status.component';
import { TradeFinanceComponent } from './trade-finance.component';
import { RequestNewLcComponent } from './components/request-new-lc/request-new-lc.component';
import { TfLandingComponent } from './components/tf-landing/tf-landing.component';

const routes: Routes = [
    {
        path: '',
        component: TradeFinanceComponent,
        children: [
            {
                path: 'landing',
                component: TfLandingComponent
            },
            {
                path: 'import-lc',
                component: RequestNewLcComponent,
            },
            {
                path: 'bg-drafts',
                component: BgDraftsComponent,
            },
            {
                path: 'bank-guarantee',
                component: BankGuaranteeComponent,
            },
            {
                path: 'lc-status',
                component: LcStatusComponent,
            },
            {
                path: 'lc-documents-arrival-notice',
                component: LcDocumentsArrivalNoticeComponent,
            },
            {
                path: 'lc-drafts',
                component: LcDraftsComponent,
            },
            {
                path: 'export-lc',
                component: ExportLcComponent,
            },
            {
                path: 'collection-advicing',
                component: BcListComponent,
            },
            {
                path: 'bg-status',
                component: BgStatusComponent,
            },
            {
                path: '',
                redirectTo: 'landing',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TradeFinanceRoutingModule { }
