import { AfterViewInit, Component } from '@angular/core';
import { PieChartConfig } from 'src/app/cib-components/cib-pie-chart/models/pie-chart.model';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';

@Component({
    selector: 'app-queue-status',
    templateUrl: './queue-status.component.html',
    styleUrls: ['./queue-status.component.scss'],
})
export class QueueStatusComponent implements AfterViewInit {
    // config: PieChartConfig = {
    //     id: 'REQUEST_OVERVIEW',
    //     total: 0,
    //     data: [
    //         { id: 'approvedCount', name: 'Paid', value: 0, percentage: 0, color: '#2BC431' },
    //         { id: 'rejectedCount', name: 'Dropped', value: 0, percentage: 0, color: '#EA0000' },
    //         { id: 'pendingCount', name: 'Pending', value: 0, percentage: 0, color: '#E17F25' },
    //     ],
    // };
    config: PieChartConfig = {
        id: 'PORTFOLIO_OVERVIEW',
        data: [
            { name: 'Paid', value: 0, percentage: 0, color: '#2BC431' },
            { name: 'Dropped', value: 0, percentage: 0, color: '#EA0000' },
            { name: 'Pending', value: 0, percentage: 0, color: '#E17F25' },
        ],
    };
    modules = [];
    props = ['approvedCount', 'pendingCount', 'rejectedCount'];
    barConfig: any = [];
    filterPipe = new CIBDefinition();
    constructor(private sandbox: DashboardSandbox) {}

    ngAfterViewInit(): void {
       // this.sandbox.getMakerRequestCount().subscribe((res: any) => {
        const res1:any={data:{requestCount:[
            {
                uuid:'Individual',
                pendingCount:200,
                approvedCount:20,
                rejectedCount:156
            },
            {
                uuid:'Group',
                pendingCount:200,
                approvedCount:20,
                rejectedCount:156
            },
            {
                uuid:'ALL',
                pendingCount:123,
                approvedCount:58,
                rejectedCount:86,
                total:23
            }
        ]}};
            if (!res1.data.requestCount) return;
            this.modules = res1.data.requestCount;
            this.modules.forEach((module: any) => {
                let total = 0;
                this.props.forEach((x) => {
                    if (module[x]) {
                        total = total + module[x];
                    }
                });
                module.total = total;

                this.barConfig.push({
                    key: module.uuid,
                    name: module.uuid,
                    requests: [
                        {
                            key: 'PENDING',
                            name: 'Pending',
                            count: module.pendingCount,
                        },
                        {
                            key: 'APPROVED',
                            name: 'Approved',
                            count: module.approvedCount,
                        },
                        {
                            key: 'REJECTED',
                            name: 'Rejected',
                            count: module.rejectedCount,
                        },
                    ],
                });
            });

            const index = this.modules.findIndex((x: any) => x.uuid === 'ALL');
            // if (index !== -1) {
            //     const all = this.modules[index];
            //     this.config.data.forEach((x: any) => {
            //         x.percentage = all[x.id] ? Math.round((all[x.id] / all['total']) * 100) : 0;
            //         x.value = all[x.id];
            //     });
            //     this.config.total = all['total'];
            // }
            const res={
                total:[{label:'a',total:"20"},{label:'b',total:"20"},{label:'Total',total:"20"}],
                assets:[],
                liabilities:[]
            };
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
        //});
    }
    
    getValue(value: any) {
        return Number(value.toString().replaceAll(',', ''));
    }
}
