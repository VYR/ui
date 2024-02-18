import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { SuperEmployeesListComponent } from './components/super-employees-list/super-employees-list.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { PromotersListComponent } from './components/promoters-list/promoters-list.component';
import { SettingsComponent } from './components/settings/settings.component';
const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'schemes',
                loadChildren: () => import('./components/schemes/schemes.module').then((m) => m.SchemesModule),
            },
            {
                path: 'super-employees-list',
                component:SuperEmployeesListComponent
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
                path: 'settings',
                component:SettingsComponent
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
export class AdminRoutingModule {}
