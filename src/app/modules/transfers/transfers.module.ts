import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { TransfersRoutingModule } from './transfers-routing.module';
import { TransfersComponent } from './transfers.component';
import { SingleMultipleTransfersComponent } from './components/single-multiple-transfers/single-multiple-transfers.component';

import { DraftsComponent } from './drafts/drafts.component';
import { TransferDraftsComponent } from './components/transfer-drafts/transfer-drafts.component';
import { BulkTransferDraftsComponent } from './components/bulk-transfer-drafts/bulk-transfer-drafts.component';
import { MultipleDebitBulkUploadComponent } from './components/multiple-debit-bulk-upload/multiple-debit-bulk-upload.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DeleteDraftDialogComponent } from './components/delete-draft-dialog/delete-draft-dialog.component';
import { ExchangeRatePopupComponent } from './components/exchange-rate-popup/exchange-rate-popup.component';
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component';

import { DatePipe } from '@angular/common';
import { BulkUploadSummaryComponent } from './components/bulk-upload-summary/bulk-upload-summary.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MultipleTransferDraftsComponent } from './components/multiple-transfer-drafts/multiple-transfer-drafts.component';
import { SupportingDocCurrencyDialogComponent } from './components/supporting-doc-currency-dialog/supporting-doc-currency-dialog.component';
import { BulkUploadErrorsDialogComponent } from './components/bulk-upload-errors-dialog/bulk-upload-errors-dialog.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TransferHeaderInfoComponent } from './components/transfer-header-info/transfer-header-info.component';
import { SingleMultipleTransferPreviewComponent } from './components/single-multiple-transfer-preview/single-multiple-transfer-preview.component';
import { TransferInfoComponent } from './components/transfer-info/transfer-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalaryPostingComponent } from './components/salary-posting/salary-posting.component';
import { SalaryPostingSummaryComponent } from './components/salary-posting/components/salary-posting-summary/salary-posting-summary.component';
import { SalaryPostingErrorDialogComponent } from './components/salary-posting/components/salary-posting-error-dialog/salary-posting-error-dialog.component';
@NgModule({
    declarations: [
        TransfersComponent,
        SingleMultipleTransfersComponent,
        DraftsComponent,
        TransferDraftsComponent,
        BulkTransferDraftsComponent,
        MultipleDebitBulkUploadComponent,
        DeleteDraftDialogComponent,
        ExchangeRatePopupComponent,
        BulkUploadComponent,
        BulkUploadSummaryComponent,
        MultipleTransferDraftsComponent,
        SupportingDocCurrencyDialogComponent,
        BulkUploadErrorsDialogComponent,
        TransferHeaderInfoComponent,
        SingleMultipleTransferPreviewComponent,
        TransferInfoComponent,
        SalaryPostingComponent,
        SalaryPostingSummaryComponent,
        SalaryPostingErrorDialogComponent,
    ],
    imports: [
        CommonModule,
        MatSlideToggleModule,
        TransfersRoutingModule,
        CibComponentsModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatTabsModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        PipesModule,
        DirectivesModule,
        MatTooltipModule,
    ],
    providers: [DatePipe, CurrencyPipe],
})
export class TransfersModule {}
