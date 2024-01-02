import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DECISION } from 'src/app/shared/enums';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { ApproverRequestsComponent } from '../approver-requests/approver-requests.component';

@Component({
    selector: 'app-approver-requests-module-wise',
    templateUrl: './approver-requests-module-wise.component.html',
    styleUrls: ['./approver-requests-module-wise.component.scss'],
})
export class ApproverRequestsModuleWiseComponent implements OnInit {
    modules: any = [];
    DECISION = DECISION;
    constructor(private router: Router, private dialog: SgsDialogService, private sandbox: DashboardSandbox) {}
    @ViewChildren('requests') requests!: QueryList<ApproverRequestsComponent>;
    selected: any = {};
    selectedRequests = [];
    durationList: any = ['All', 'Last 3 months'];
    ngOnInit(): void {
        this.sandbox.getRequestCount().subscribe((res: any) => {
            if (res.data && res.data.length) {
                const index = res.data.findIndex((x: any) => x.uuid === 'ALL');
                this.modules = res.data;
                this.modules.map((module: any) => {
                    module.selectedDuration = 'Last 3 months';
                    return module;
                });
                this.modules.splice(index, 1);
            }
        });
    }

    onSelect(data: any[], module: any) {
        this.selected[module] = data;
        let reqs: any = [];
        for (let i in this.selected) {
            reqs = reqs.concat(this.selected[i]);
        }
        this.selectedRequests = reqs;
    }

    onUpdateCount(count: any[], index: any) {
        this.modules[index]['count'] = count;
    }
    actOnSelected(decision: DECISION, mode: DECISION) {
        this.requests.first.triggerAction(decision, mode, this.selectedRequests);
    }

    onActionEnd() {
        this.router.navigate([APP_ROUTES.DASHBOARD]);
    }
}
