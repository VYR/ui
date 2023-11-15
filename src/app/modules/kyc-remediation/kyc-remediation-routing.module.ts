import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KycRemediationComponent } from './kyc-remediation.component';

const routes: Routes = [
    {
        path: '',
        component: KycRemediationComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KycRemediationRoutingModule {}
