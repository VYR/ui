import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { BankAdminGroupManagementRoutingModule } from './bank-admin-group-management-routing.module';
import { BankAdminGroupManagementComponent } from './bank-admin-group-management.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { MappingsComponent } from './components/mappings/mappings.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BankAdminGroupManagementSandbox } from './bank-admin-group-management.sandbox';
import { GroupAdminDialogComponent } from './components/group-admin-dialog/group-admin-dialog.component';
@NgModule({
    declarations: [
        BankAdminGroupManagementComponent,
        SearchComponent,
        CreateComponent,
        MappingsComponent,
        MatrixComponent,
        GroupAdminDialogComponent,
    ],
    imports: [
        CommonModule,
        BankAdminGroupManagementRoutingModule,
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
    ],
    providers: [BankAdminGroupManagementSandbox],
})
export class BankAdminGroupManagementModule {}
