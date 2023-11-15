import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieChartConfig } from 'src/app/cib-components/cib-pie-chart/models/pie-chart.model';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
    networth: any = {};
    hasAssets!: boolean;
    hasLiabilities!: boolean;
    constructor(private router: Router, private dialog: CibDialogService, private sandbox: DashboardSandbox) {}
    tableConfig!: CIBTableConfig;
    minHeight: number = 0;
    config: PieChartConfig = {
        id: 'PORTFOLIO_OVERVIEW',
        data: [
            { name: 'Assets', value: 0, percentage: 0, color: '#2BC431' },
            { name: 'Liabilities', value: 0, percentage: 0, color: '#EA0000' },
        ],
    };

    ngOnInit() {
        this.sandbox.getNetwoth().subscribe((res) => {
            this.networth = res;
            this.config.total = this.getValue(res.total[2].total);
            this.config.totalLabel = res.total[2].label;
            [0, 1].forEach((x: number) => {
                this.config.data[x] = {
                    ...this.config.data[x],
                    value: this.getValue(res.total[x].total),
                    percentage: Number(
                        (
                            (this.getValue(res.total[x].total) /
                                (this.getValue(res.total[0].total) + this.getValue(res.total[1].total))) *
                            100
                        ).toFixed(2)
                    ),
                };
            });
            this.hasAssets = !this.networth.assets.every((x: any) => x.show === false);
            this.hasLiabilities = !this.networth.liabilities.every((x: any) => x.show === false);
        });
    }

    getValue(value: any) {
        return Number(value.toString().replaceAll(',', ''));
    }
}
