import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./modules/public-access/public-access.module').then((m) => m.PublicAccessModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: 'super-employee',
        loadChildren: () => import('./modules/super-employee/super-employee.module').then((m) => m.SuperEmployeeModule),
    },
    {
        path: 'employee',
        loadChildren: () => import('./modules/employee/employee.module').then((m) => m.EmployeeModule),
    },
    {
        path: 'promoter',
        loadChildren: () => import('./modules/promotor/promotor.module').then((m) => m.PromotorModule),
    },
    {
        path: 'scheme-member',
        loadChildren: () => import('./modules/scheme-member/scheme-member.module').then((m) => m.SchemeMemberModule),
    },
    {
        path: 'service-unavailable',
        loadChildren: () =>
            import('./modules/service-unavailable/service-unavailable.module').then((m) => m.ServiceUnavailableModule),
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
