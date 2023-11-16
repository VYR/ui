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
    config: PieChartConfig = {
        id: 'REQUEST_OVERVIEW',
        total: 0,
        data: [
            { id: 'approvedCount', name: 'Approved', value: 0, percentage: 0, color: '#2BC431' },
            { id: 'rejectedCount', name: 'Rejected', value: 0, percentage: 0, color: '#EA0000' },
            { id: 'pendingCount', name: 'Awaiting Approval', value: 0, percentage: 0, color: '#E17F25' },
        ],
    };
    modules = [];
    props = ['approvedCount', 'pendingCount', 'rejectedCount'];
    barConfig: any = [];
    filterPipe = new CIBDefinition();
    constructor(private sandbox: DashboardSandbox) {}

    ngAfterViewInit(): void {
       // this.sandbox.getMakerRequestCount().subscribe((res: any) => {
       /* const res:any={data:{requestCount:[{pendingCount:2}]}};
            if (!res.data.requestCount) return;
            this.modules = res.data.requestCount;
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
                    name: this.filterPipe.transform(module.uuid, 'UUID'),
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
            if (index !== -1) {
                const all = this.modules[index];
                this.config.data.forEach((x: any) => {
                    x.percentage = all[x.id] ? Math.round((all[x.id] / all['total']) * 100) : 0;
                    x.value = all[x.id];
                });
                this.config.total = all['total'];
            }*/
        //});
    }
}
