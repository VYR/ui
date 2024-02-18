import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { PromotersListComponent } from './components/promoters-list/promoters-list.component';
const routes: Routes = [
    {
        path: '',
        component:  EmployeeComponent,
        children:  [
            {
                path: 'promoters',
                component:PromotersListComponent
            },
            {
                path: 'referral-amount',
                loadChildren: () => import('./components/referral-amount/referral-amount.module').then((m) => m.ReferralAmountModule),
            },
            {
                path: '',
                redirectTo: 'promoters',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeRoutingModule {}
