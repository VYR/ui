import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TradeFinanceRoutingModule } from './trade-finance-routing.module';
import { TradeFinanceComponent } from './trade-finance.component';
import { RequestNewLcComponent } from './components/request-new-lc/request-new-lc.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { LcStatusComponent } from './components/lc-status/lc-status.component';
import { LcListingComponent } from './components/lc-listing/lc-listing.component';
import { LcDocumentsArrivalNoticeComponent } from './components/lc-documents-arrival-notice/lc-documents-arrival-notice.component';
import { TradeFinanceSandbox } from './trade-finance.sandbox';
import { LcViewComponent } from './components/lc-view/lc-view.component';
import { LcDraftsComponent } from './components/lc-drafts/lc-drafts.component';
import { LcStatusViewComponent } from './components/lc-status-view/lc-status-view.component';
import { CommentsHistoryComponent } from './components/comments-history/comments-history.component';
import { DeleteRequestConfirmComponent } from './components/delete-request-confirm/delete-request-confirm.component';
import { ExportLcComponent } from './components/export-lc/export-lc.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { BcListComponent } from './components/bc-list/bc-list.component';
import { BgStatusComponent } from './components/bg-status/bg-status.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BgDraftsComponent } from './components/bg-drafts/bg-drafts.component';
import { BgDetailsComponent } from './components/bg-details/bg-details.component';
import { BankGuaranteeComponent } from './components/bank-guarantee/bank-guarantee.component';
import { BgStatusViewComponent } from './components/bg-status-view/bg-status-view.component';
import { TfLandingComponent } from './components/tf-landing/tf-landing.component';
import { LcPreviewComponent } from './components/lc-preview/lc-preview.component';
@NgModule({
    declarations: [
        TradeFinanceComponent,
        RequestNewLcComponent,
        LcStatusComponent,
        LcListingComponent,
        LcDocumentsArrivalNoticeComponent,
        LcViewComponent,
        LcDraftsComponent,
        LcStatusViewComponent,
        CommentsHistoryComponent,
        DeleteRequestConfirmComponent,
        ExportLcComponent,
        DetailViewComponent,
        BcListComponent,
        BgStatusComponent,
        BgDraftsComponent,
        BgDetailsComponent,
        BankGuaranteeComponent,
        BgStatusViewComponent,
        TfLandingComponent,
        LcPreviewComponent,
    ],
    imports: [
        CommonModule,
        TradeFinanceRoutingModule,
        CibComponentsModule,
        PipesModule,
        DirectivesModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
        MatTabsModule,
        MatTableModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatListModule,
    ],
    providers: [
        TradeFinanceSandbox,
        PipesModule,
        MatRadioModule,
        DirectivesModule,
        MatCardModule,
        MatDatepickerModule,
        MatTabsModule,
        MatChipsModule,
        DecimalPipe,
        MatCheckboxModule,
        MatButtonToggleModule,
    ],
})
export class TradeFinanceModule {}
