import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperEmployeeComponent } from './super-employee.component';
import { PromotersListComponent } from './components/promoters-list/promoters-list.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
const routes: Routes = [
    {
        path: '',
        component:  SuperEmployeeComponent,
        children:  [
            {
                path: 'employee',
                component:EmployeeListComponent
            },
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
                redirectTo: 'employee',
                pathMatch: 'full',
            }
             
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SuperEmployeeRoutingModule {}
