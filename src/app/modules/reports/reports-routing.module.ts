import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { AutoHistoryComponent } from './components/auto-history/auto-history.component';
import { CdFdSearchComponent } from './components/cd-fd-search/cd-fd-search.component';
import { PositivePayHistoryComponent } from './components/positive-pay-history/positive-pay-history.component';
import { SearchBulkTransferComponent } from './components/search-bulk-transfer/search-bulk-transfer.component';
import { SearchDividendPayComponent } from './components/search-dividend-pay/search-dividend-pay.component';
import { SearchFutureDatedTransferComponent } from './components/search-future-dated-transfer/search-future-dated-transfer.component';
import { SearchPositivePayComponent } from './components/search-positive-pay/search-positive-pay.component';
import { SearchSalaryPostingComponent } from './components/search-salary-posting/search-salary-posting.component';
import { SearchTransfersComponent } from './components/search-transfers/search-transfers.component';
import { SweepHistoryComponent } from './components/sweep-history/sweep-history.component';
import { SwiftCopiesComponent } from './components/swift-copies/swift-copies.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'search-transfers',
                component: SearchTransfersComponent,
            },
            {
                path: 'search-bulk-transfer',
                component: SearchBulkTransferComponent,
            },
            {
                path: 'search-future-dated-transfers',
                component: SearchFutureDatedTransferComponent,
            },
            {
                path: 'search-positive-pay',
                component: SearchPositivePayComponent,
            },
            {
                path: 'search-dividend-pay',
                component: SearchDividendPayComponent,
            },
            {
                path: 'search-cd-fd',
                component: CdFdSearchComponent,
            },
            {
                path: 'search-positive-pay-history',
                component: PositivePayHistoryComponent,
            },
            {
                path: 'search-auto-history',
                component: AutoHistoryComponent,
            },
            {
                path: 'search-sweep-history',
                component: SweepHistoryComponent,
            },
            {
                path: 'swift-copies',
                component: SwiftCopiesComponent,
            },
            {
                path: 'search-salary-posting',
                component: SearchSalaryPostingComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                canActivate: [RoleGuard],
                children: [],
                data: {
                    routeInfo: [
                        {
                            uuid: 'TRANSFER_HISTORY',
                            path: '/home/reports/search-transfers',
                        },
                        {
                            uuid: 'BULK_TRANSFER_HISTORY',
                            path: '/home/reports/search-bulk-transfer',
                        },
                        {
                            uuid: 'FETCH_STO',
                            path: '/home/reports/search-future-dated-transfers',
                        },
                        {
                            uuid: 'SEARCH_POSITIVE_PAY',
                            path: '/home/reports/search-positive-pay',
                        },
                        {
                            uuid: 'DIVIDEND_PAY',
                            path: '/home/reports/search-dividend-pay',
                        },
                        {
                            uuid: 'ACCOUNTS_HISTORY',
                            path: '/home/reports/search-cd-fd',
                        },
                        {
                            uuid: 'POSITIVE_PAY_DATA_HISTORY',
                            path: '/home/reports/search-positive-pay-history',
                        },
                        {
                            uuid: 'AUTO_COVER_HISTORY',
                            path: '/home/reports/search-auto-history',
                        },
                        {
                            uuid: 'AUTO_SWEEP_HISTORY',
                            path: '/home/reports/search-sweep-history',
                        },
                        {
                            uuid: 'GENERATE_SWIFT_COPY',
                            path: '/home/reports/swift-copies',
                        },
                        {
                            uuid: 'SALARY_POSTING_LISTING',
                            path: '/home/reports/search-salary-posting',
                        },
                    ],
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}
