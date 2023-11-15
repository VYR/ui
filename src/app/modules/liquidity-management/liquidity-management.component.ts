import { Component, OnInit } from '@angular/core';
import { LiquidityManagementSandbox } from './liquidity-management.sandbox';

@Component({
    selector: 'app-liquidity-management',
    templateUrl: './liquidity-management.component.html',
    styleUrls: ['./liquidity-management.component.scss'],
})
export class LiquidityManagementComponent implements OnInit {
    loaded: boolean = false;
    constructor(private lmSandbox: LiquidityManagementSandbox) {}

    ngOnInit(): void {
        this.lmSandbox.initData().subscribe((res: any) => {
            this.lmSandbox.initialData = { accounts: res.accs, catList: res.catList };
            this.loaded = true;
        });
    }

    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Auto Cover',
            path: 'auto-cover',
        },
        {
            uuid: '',
            name: 'Sweep Balance',
            path: 'sweep-balance',
        },
    ];
}
