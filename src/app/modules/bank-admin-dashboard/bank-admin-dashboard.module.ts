import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAdminDashboardRoutingModule } from './bank-admin-dashboard-routing.module';
import { BankAdminDashboardComponent } from './bank-admin-dashboard.component';
import { MyQueueComponent } from './components/my-queue/my-queue.component';
import { ApplicationConfigComponent } from './components/application-config/application-config.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeatureConfigComponent } from './components/feature-config/feature-config.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { FeatureConfigAdminComponent } from './components/feature-config-admin/feature-config-admin.component';
import { FeatureConfigCorporateComponent } from './components/feature-config-corporate/feature-config-corporate.component';
@NgModule({
    declarations: [
        BankAdminDashboardComponent,
        MyQueueComponent,
        ApplicationConfigComponent,
        DetailViewComponent,
        FeatureConfigComponent,
        FeatureConfigAdminComponent,
        FeatureConfigCorporateComponent,
    ],
    imports: [
        CommonModule,
        BankAdminDashboardRoutingModule,
        CibComponentsModule,
        MatSelectModule,
        FlexLayoutModule,
        MatButtonModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatTabsModule,
    ],
})
export class BankAdminDashboardModule {}
