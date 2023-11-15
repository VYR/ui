import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoCoverComponent } from './components/auto-cover/auto-cover.component';
import { SweepBalanceComponent } from './components/sweep-balance/sweep-balance.component';
import { LiquidityManagementComponent } from './liquidity-management.component';

const routes: Routes = [
    {
        path: '',
        component: LiquidityManagementComponent,
        children: [
            {
                path: 'auto-cover',
                component: AutoCoverComponent,
            },
            {
                path: 'sweep-balance',
                component: SweepBalanceComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'auto-cover',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LiquidityManagementRoutingModule {
    constructor() {}
}
