import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotorComponent } from './promotor.component';
const routes: Routes = [
    {
        path: '',
        component: PromotorComponent,
        children: [
            {
                path: 'scheme-members-list',
                loadChildren: () => import('./components/scheme-members-list/scheme-members-list.module').then((m) => m.SchemeMembersListModule),
            },
            {
                path: 'referral-amount',
                loadChildren: () => import('./components/referral-amount/referral-amount.module').then((m) => m.ReferralAmountModule),
            },
            {
                path: '',
                redirectTo: 'scheme-members-list',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PromoterRoutingModule {}
