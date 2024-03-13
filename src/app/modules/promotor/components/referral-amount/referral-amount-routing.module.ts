import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ReferralAmountComponent } from './referral-amount.component';
import { OnGoingReferralComponent } from './components/on-going-referral/on-going-referral.component';
import { CompletedReferralComponent } from './components/completed-referral/completed-referral.component';
const routes: Routes = [
    {
        path: '',
        component:ReferralAmountComponent,
        children: [
            {
                path: 'on-going',
                component:OnGoingReferralComponent,
            },
            {
                path: 'completed',
                component:CompletedReferralComponent,
            },
            {
                path: '',
                redirectTo: 'on-going',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReferralAmountRoutingModule {}
