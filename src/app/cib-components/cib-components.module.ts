import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CibOtpComponent } from './cib-otp/cib-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { HorizontalMenuComponent } from './horizontal-menu/horizontal-menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MasterContainerComponent } from './master-container/master-container.component';
import { LabelValueComponent } from './lable-value/label-value.component';
import { CibTableComponent } from './cib-table/cib-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../shared/directives/directives.module';
import { CacheService } from '../cache/cache.service';
import { OutletContainerComponent } from './outlet-container/outlet-container.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { CibCardComponent } from './cib-card/cib-card.component';
import { CibFilterMenuComponent } from './cib-filter-menu/cib-filter-menu.component';
import { CibPieChartComponent } from './cib-pie-chart/cib-pie-chart.component';
import { CibDrawerLayoutComponent } from './cib-drawer-layout/cib-drawer-layout.component';
import { CUSTOM_DATE_FORMATS } from '../shared/enums/custom-date-format';
import { CibDatePickerComponent } from './cib-date-picker/cib-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CibNotificationComponent } from './cib-notification/cib-notification.component';
import { CibBarChartComponent } from './cib-bar-chart/cib-bar-chart.component';
import { FromAccountComponent } from './from-account/from-account.component';
import { ToAccountComponent } from './to-account/to-account.component';
import { CibFxDisclaimerComponent } from './cib-fx-disclaimer/cib-fx-disclaimer.component';
import { MatSelectModule } from '@angular/material/select';
import { AccountSelectComponent } from './account-select/account-select.component';
import { AccountMultiselectComponent } from './account-multiselect/account-multiselect.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { CibLegendCardComponent } from './cib-legend-card/cib-legend-card.component';
import { CibInputChipComponent } from './cib-input-chip/cib-input-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { NotEntitledComponent } from './not-entitled/not-entitled.component';
import { SelectCheckAllComponent } from './select-check-all/select-check-all.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CibToggleGroupComponent } from './cib-toggle-group/cib-toggle-group.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CibInputMatcherComponent } from './cib-input-matcher/cib-input-matcher.component';
@NgModule({
    declarations: [
        FooterComponent,
        CibOtpComponent,
        HorizontalMenuComponent,
        MasterContainerComponent,
        LabelValueComponent,
        CibTableComponent,
        OutletContainerComponent,
        ConfirmationDialogComponent,
        CibCardComponent,
        CibFilterMenuComponent,
        CibPieChartComponent,
        CibDrawerLayoutComponent,
        CibDatePickerComponent,
        CibNotificationComponent,
        CibFxDisclaimerComponent,
        CibBarChartComponent,
        FromAccountComponent,
        ToAccountComponent,
        AccountSelectComponent,
        AccountMultiselectComponent,
        InvoiceDetailComponent,
        CibLegendCardComponent,
        CibInputChipComponent,
        NotEntitledComponent,
        SelectCheckAllComponent,
        FileUploadComponent,
        CibToggleGroupComponent,
        CibInputMatcherComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatDialogModule,
        MatListModule,
        MatToolbarModule,
        NgOtpInputModule,
        MatButtonModule,
        MatIconModule,
        MatRippleModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatCardModule,
        MatCheckboxModule,
        RouterModule,
        DirectivesModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
        MomentDateModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatSelectModule,
        MatChipsModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatTooltipModule,
    ],
    exports: [
        FooterComponent,
        CibOtpComponent,
        HorizontalMenuComponent,
        MasterContainerComponent,
        LabelValueComponent,
        CibTableComponent,
        OutletContainerComponent,
        CibCardComponent,
        CibFilterMenuComponent,
        CibPieChartComponent,
        CibDrawerLayoutComponent,
        CibDatePickerComponent,
        CibNotificationComponent,
        CibBarChartComponent,
        CibFxDisclaimerComponent,
        FromAccountComponent,
        ToAccountComponent,
        AccountSelectComponent,
        CibLegendCardComponent,
        CibInputChipComponent,
        AccountMultiselectComponent,
        NotEntitledComponent,
        SelectCheckAllComponent,
        FileUploadComponent,
        CibToggleGroupComponent,
        CibInputMatcherComponent,
    ],
    providers: [CacheService, { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
})
export class CibComponentsModule {}
