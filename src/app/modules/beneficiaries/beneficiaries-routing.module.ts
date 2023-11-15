import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiaryFormComponent } from './components/beneficiary-form/beneficiary-form.component';
import { BeneficiaryListComponent } from './components/beneficiary-list/beneficiary-list.component';

const routes: Routes = [
    {
        path: '',
        component: BeneficiariesComponent,
        children: [
            {
                path: 'beneficiary-list',
                component: BeneficiaryListComponent,
            },
            {
                path: 'add-beneficiary',
                component: BeneficiaryFormComponent,
            },
            {
                path: '',
                redirectTo: 'beneficiary-list',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BeneficiariesRoutingModule {}
