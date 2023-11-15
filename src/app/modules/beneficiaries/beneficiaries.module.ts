import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariesRoutingModule } from './beneficiaries-routing.module';
import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiaryFormComponent } from './components/beneficiary-form/beneficiary-form.component';
import { BeneficiariesSandbox } from './beneficiaries.sandbox';
import { BeneficiaryListComponent } from './components/beneficiary-list/beneficiary-list.component';
import { CibComponentsModule } from 'src/app/cib-components/cib-components.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { BeneficiaryDetailsComponent } from './components/beneficiary-details/beneficiary-details.component';
import { BeneficiaryAddComponent } from './components/beneficiary-add/beneficiary-add.component';
import { BeneficiaryEditComponent } from './components/beneficiary-edit/beneficiary-edit.component';
import { BeneficiaryDialogDetailsComponent } from './components/beneficiary-dialog-details/beneficiary-dialog-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        BeneficiariesComponent,
        BeneficiaryDetailsComponent,
        BeneficiaryFormComponent,
        BeneficiaryListComponent,
        BeneficiaryAddComponent,
        BeneficiaryEditComponent,
        BeneficiaryDialogDetailsComponent,
    ],
    imports: [
        CommonModule,
        PipesModule,
        DirectivesModule,
        BeneficiariesRoutingModule,
        CibComponentsModule,
        MatMenuModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTooltipModule,
    ],
    providers: [BeneficiariesSandbox],
})
export class BeneficiariesModule {}
