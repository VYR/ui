import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { HomeComponent } from './home.component';
import { SgsSchemesComponent } from './components/save-gold-scheme/sgs-schemes/sgs-schemes.component';
import { SgsReportsComponent } from './components/save-gold-scheme/sgs-reports/sgs-reports.component';
import { SgsProfileComponent } from './components/save-gold-scheme/sgs-profile/sgs-profile.component';
import { SgsUsersComponent } from './components/save-gold-scheme/sgs-users/sgs-users.component';
import { SgsRefferalsComponent } from './components/save-gold-scheme/sgs-refferals/sgs-refferals.component';
import { SgsSettingsComponent } from './components/save-gold-scheme/sgs-settings/sgs-settings.component';
import { SgsSchemeTypesComponent } from './components/save-gold-scheme/sgs-scheme-types/sgs-scheme-types.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'scheme-members',
                component: SgsUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'scheme-types',
                component: SgsSchemeTypesComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'promoters',
                component: SgsUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'employees',
                component: SgsUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'users',
                component: SgsUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'schemes',
                component: SgsSchemesComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'profile',
                component: SgsProfileComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'reports',
                component: SgsReportsComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'referrals',
                component: SgsRefferalsComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'settings',                
                component: SgsSettingsComponent,
                canLoad: [RoleGuard],
            },           
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
