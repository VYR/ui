import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { CorporateManagementRoutingModule } from './corporate-management-routing.module';
import { TemplateMappingComponent } from './components/template-mapping/template-mapping.component';
import { HostToHostComponent } from './components/host-to-host/host-to-host.component';
import { CorporateManagementComponent } from './corporate-management.component';
import { CorporateGroupComponent } from './components/corporate-group/corporate-group.component';
import { CorporateComponent } from './components/corporate/corporate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CorporateDetailsComponent } from './components/corporate-details/corporate-details.component';
import { CorporateGroupDetailsComponent } from './components/corporate-group-details/corporate-group-details.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PositivePayRegistrationComponent } from './components/positive-pay-registration/positive-pay-registration.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { H2hFileHistoryComponent } from './components/h2h-file-history/h2h-file-history.component';
import { RegisterH2hComponent } from './components/register-h2h/register-h2h.component';
import { BulkDataTableComponent } from './components/bulk-data-table/bulk-data-table.component';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { DelinkToDeviceComponent } from './components/delink-to-device/delink-to-device.component';
@NgModule({
    declarations: [
        CorporateGroupDetailsComponent,
        CorporateDetailsComponent,
        CorporateComponent,
        CorporateManagementComponent,
        CorporateGroupComponent,
        TemplateMappingComponent,
        HostToHostComponent,
        PositivePayRegistrationComponent,
        H2hFileHistoryComponent,
        RegisterH2hComponent,
        BulkDataTableComponent,
        TransactionHistoryComponent,
        DelinkToDeviceComponent,
    ],
    imports: [
        CommonModule,
        CorporateManagementRoutingModule,
        CibComponentsModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatSlideToggleModule,
        FlexLayoutModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatCheckboxModule,
        PipesModule,
        DirectivesModule,
        MatTooltipModule,
        MatRadioModule,
    ],
})
export class CorporateManagementModule {}
