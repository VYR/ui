import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { USER_TYPE } from 'src/app/shared/enums';
import { RoleGuard } from 'src/app/shared/guards/role.guard';
import { HomeComponent } from './home.component';
import { SgsSchemesComponent } from './components/save-gold-scheme/sgs-schemes/sgs-schemes.component';
import { SgsReportsComponent } from './components/save-gold-scheme/sgs-reports/sgs-reports.component';
import { SgsProfileComponent } from './components/save-gold-scheme/sgs-profile/sgs-profile.component';
import { SgsUsersComponent } from './components/save-gold-scheme/sgs-users/sgs-users.component';
import { SgsDealersComponent } from './components/save-gold-scheme/sgs-dealers/sgs-dealers.component';
import { SgsRefferalsComponent } from './components/save-gold-scheme/sgs-refferals/sgs-refferals.component';
import { SgsSettingsComponent } from './components/save-gold-scheme/sgs-settings/sgs-settings.component';

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
                path: 'clients',
                component: SgsUsersComponent,
                canLoad: [RoleGuard],
            },
            {
                path: 'dealers',
                component: SgsDealersComponent,
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
            /*{
                path: 'accounts',
                loadChildren: () => import('../accounts/accounts.module').then((m) => m.AccountsModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'beneficiaries',
                loadChildren: () => import('../beneficiaries/beneficiaries.module').then((m) => m.BeneficiariesModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'transfers',
                loadChildren: () => import('../transfers/transfers.module').then((m) => m.TransfersModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'future-dated-transfers',
                loadChildren: () =>
                    import('../future-dated-transfers/future-dated-transfers.module').then(
                        (m) => m.FutureDatedTransfersModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'manual-transfers',
                loadChildren: () =>
                    import('../manual-transfers/manual-transfers.module').then((m) => m.ManualTransfersModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'payments',
                loadChildren: () => import('../payments/payments.module').then((m) => m.PaymentsModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'cards',
                loadChildren: () => import('../cards/cards.module').then((m) => m.CardsModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'trade-finance',
                loadChildren: () => import('../trade-finance/trade-finance.module').then((m) => m.TradeFinanceModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'cheque-management',
                loadChildren: () =>
                    import('../cheque-management/cheque-management.module').then((m) => m.ChequeManagementModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'liquidity-management',
                loadChildren: () =>
                    import('../liquidity-management/liquidity-management.module').then(
                        (m) => m.LiquidityManagementModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'user-management',
                loadChildren: () =>
                    import('../user-management/user-management.module').then((m) => m.UserManagementModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'admin',
                loadChildren: () =>
                    import('../bank-admin-dashboard/bank-admin-dashboard.module').then(
                        (m) => m.BankAdminDashboardModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'group-management',
                loadChildren: () =>
                    import('../bank-admin-group-management/bank-admin-group-management.module').then(
                        (m) => m.BankAdminGroupManagementModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'corporate-management',
                loadChildren: () =>
                    import('../corporate-management/corporate-management-module').then(
                        (m) => m.CorporateManagementModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'admin-approver',
                loadChildren: () =>
                    import('../bank-admin-approver-dashboard/bank-admin-approver-dashboard.module').then(
                        (m) => m.BankAdminApproverDashboardModule
                    ),
                canLoad: [RoleGuard],
            },

            {
                path: 'audit-trail',
                loadChildren: () => import('../audit-trail/audit-trail.module').then((m) => m.AuditTrailModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'csd',
                loadChildren: () =>
                    import('../customer-service-desk/customer-service-desk.module').then(
                        (m) => m.CustomerServiceDeskModule
                    ),
                canLoad: [RoleGuard],
            },
            {
                path: 'kyc-remediation',
                loadChildren: () =>
                    import('../kyc-remediation/kyc-remediation.module').then((m) => m.KycRemediationModule),
                canLoad: [RoleGuard],
            },
            {
                path: 'unauthorized-access/:module',
                loadChildren: () => import('../no-access/no-access.module').then((m) => m.NoAccessModule),
                data: {},
            },*/
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
