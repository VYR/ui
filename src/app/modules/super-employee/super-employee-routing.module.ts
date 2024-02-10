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
                path: 'schemes',
                loadChildren: () => import('./components/scheme-names/scheme-names.module').then((m) => m.SchemeNamesModule),
            },
            {
                path: 'employee',
                component:EmployeeListComponent
            },
            {
                path: 'promoters',
                component:PromotersListComponent
            },
            {
                path: 'scheme-members-list',
                loadChildren: () => import('./components/scheme-members-list/scheme-members-list.module').then((m) => m.SchemeMembersListModule),
            },
            {
                path: '',
                redirectTo: 'schemes',
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
