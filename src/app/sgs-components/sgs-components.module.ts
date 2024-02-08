import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SgsOtpComponent } from './sgs-otp/sgs-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { HorizontalMenuComponent } from './horizontal-menu/horizontal-menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MasterContainerComponent } from './master-container/master-container.component';
import { LabelValueComponent } from './lable-value/label-value.component';
import { SgsTableComponent } from './sgs-table/sgs-table.component';
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
import { SgsCardComponent } from './sgs-card/sgs-card.component';
import { SgsFilterMenuComponent } from './sgs-filter-menu/sgs-filter-menu.component';
import { SgsPieChartComponent } from './sgs-pie-chart/sgs-pie-chart.component';
import { SgsDrawerLayoutComponent } from './sgs-drawer-layout/sgs-drawer-layout.component';
import { CUSTOM_DATE_FORMATS } from '../shared/enums/custom-date-format';
import { SgsDatePickerComponent } from './sgs-date-picker/sgs-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SgsNotificationComponent } from './sgs-notification/sgs-notification.component';
import { SgsBarChartComponent } from './sgs-bar-chart/sgs-bar-chart.component';
import { FromAccountComponent } from './from-account/from-account.component';
import { ToAccountComponent } from './to-account/to-account.component';
import { MatSelectModule } from '@angular/material/select';
import { AccountSelectComponent } from './account-select/account-select.component';
import { AccountMultiselectComponent } from './account-multiselect/account-multiselect.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { SgsLegendCardComponent } from './sgs-legend-card/sgs-legend-card.component';
import { SgsInputChipComponent } from './sgs-input-chip/sgs-input-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { NotEntitledComponent } from './not-entitled/not-entitled.component';
import { SelectCheckAllComponent } from './select-check-all/select-check-all.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SgsToggleGroupComponent } from './sgs-toggle-group/sgs-toggle-group.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SgsInputMatcherComponent } from './sgs-input-matcher/sgs-input-matcher.component';
@NgModule({
    declarations: [
        SgsOtpComponent,
        HorizontalMenuComponent,
        MasterContainerComponent,
        LabelValueComponent,
        SgsTableComponent,
        OutletContainerComponent,
        ConfirmationDialogComponent,
        SgsCardComponent,
        SgsFilterMenuComponent,
        SgsPieChartComponent,
        SgsDrawerLayoutComponent,
        SgsDatePickerComponent,
        SgsNotificationComponent,
        SgsBarChartComponent,
        FromAccountComponent,
        ToAccountComponent,
        AccountSelectComponent,
        AccountMultiselectComponent,
        InvoiceDetailComponent,
        SgsLegendCardComponent,
        SgsInputChipComponent,
        NotEntitledComponent,
        SelectCheckAllComponent,
        FileUploadComponent,
        SgsToggleGroupComponent,
        SgsInputMatcherComponent,
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
        SgsOtpComponent,
        HorizontalMenuComponent,
        MasterContainerComponent,
        LabelValueComponent,
        SgsTableComponent,
        OutletContainerComponent,
        SgsCardComponent,
        SgsFilterMenuComponent,
        SgsPieChartComponent,
        SgsDrawerLayoutComponent,
        SgsDatePickerComponent,
        SgsNotificationComponent,
        SgsBarChartComponent,
        FromAccountComponent,
        ToAccountComponent,
        AccountSelectComponent,
        SgsLegendCardComponent,
        SgsInputChipComponent,
        AccountMultiselectComponent,
        NotEntitledComponent,
        SelectCheckAllComponent,
        FileUploadComponent,
        SgsToggleGroupComponent,
        SgsInputMatcherComponent,
    ],
    providers: [CacheService, { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
})
export class SgsComponentsModule {}
