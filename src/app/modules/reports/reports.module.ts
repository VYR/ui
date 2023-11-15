import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SearchTransfersComponent } from './components/search-transfers/search-transfers.component';
import { SearchBulkTransferComponent } from './components/search-bulk-transfer/search-bulk-transfer.component';
import { SearchFutureDatedTransferComponent } from './components/search-future-dated-transfer/search-future-dated-transfer.component';
import { SearchPositivePayComponent } from './components/search-positive-pay/search-positive-pay.component';
import { SearchDividendPayComponent } from './components/search-dividend-pay/search-dividend-pay.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ReportsSandbox } from './reports.sandbox';
import { CdFdSearchComponent } from './components/cd-fd-search/cd-fd-search.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { BulkDataTableComponent } from './components/bulk-data-table/bulk-data-table.component';
import { PositivePayHistoryComponent } from './components/positive-pay-history/positive-pay-history.component';
import { AutoHistoryComponent } from './components/auto-history/auto-history.component';
import { SweepHistoryComponent } from './components/sweep-history/sweep-history.component';
import { SwiftCopiesComponent } from './components/swift-copies/swift-copies.component';
import { SearchSalaryPostingComponent } from './components/search-salary-posting/search-salary-posting.component';
import { SalaryPostingDataTableComponent } from './components/salary-posting-data-table/salary-posting-data-table.component';
import { GeneralServicesModule } from '../general-services/general-services.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
    declarations: [
        ReportsComponent,
        SearchTransfersComponent,
        SearchBulkTransferComponent,
        SearchFutureDatedTransferComponent,
        SearchPositivePayComponent,
        SearchDividendPayComponent,
        CdFdSearchComponent,
        PaymentDetailsComponent,
        DetailViewComponent,
        BulkDataTableComponent,
        PositivePayHistoryComponent,
        AutoHistoryComponent,
        SweepHistoryComponent,
        SwiftCopiesComponent,
        SearchSalaryPostingComponent,
        SalaryPostingDataTableComponent,
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        FlexLayoutModule,
        MatTooltipModule,
        PipesModule,
        MatRadioModule,
        DirectivesModule,
        MatCardModule,
        GeneralServicesModule,
    ],
    providers: [ReportsSandbox],
})
export class ReportsModule {}
