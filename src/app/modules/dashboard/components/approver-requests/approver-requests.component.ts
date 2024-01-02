import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ColumnType, SGSTableConfig } from 'src/app/sgs-components/sgs-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE, REQUEST_STATUS } from 'src/app/shared/enums';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DEALERS_TABLE_COLUMNS } from 'src/app/modules/home/components/save-gold-scheme/constants/meta-data';

@Component({
    selector: 'app-approver-requests',
    templateUrl: './approver-requests.component.html',
    styleUrls: ['./approver-requests.component.scss'],
})
export class ApproverRequestsComponent implements OnChanges {
    @Input() type!: string;
    @Output() _onSelect = new EventEmitter<Array<any>>();
    @Output() _onActionEnd = new EventEmitter<any>();
    @Output() _onUpdateCount = new EventEmitter<any>();
    DECISION = DECISION;
    selectedRequests: Array<any> = [];
    query: any;
    @Input() durationType!: any;
    constructor(private dialog: SgsDialogService, private sandbox: DashboardSandbox) {}
    config!: SGSTableConfig;
    ngOnChanges() {
        console.log(this.durationType);
        if (this.query) {
            this.lazyLoad(this.query);
        }
    }
    lazyLoad(query: any) {
        console.log(this.durationType);
        query.searchByType = this.type;
        query.fetchAll = this.durationType === 'All';
        if (!query.fetchAll && !query.dateRange) {
            query.fetchAll = false;
        }
        // this.sandbox
        //     .getRequestList(query, REQUEST_STATUS.PENDING, REQUEST_LIST_TYPE.ACTION_PENDING)
        //     .subscribe((res) => {
            const res={data:[
                {
                    created:new Date(),
                    userId:'SGS387465',
                    name:'Yellamandarao Vemula',
                    schemeType:'Individual',
                    txnAmount:2365476,
                    currentState:'Approved'

                },
                {
                    created:new Date(),
                    userId:'SGS387465',
                    name:'Yellamandarao Vemula',
                    schemeType:'Individual',
                    txnAmount:2365476,
                    currentState:'Approved'

                }
            ],totalRecords:10};
                this.selectedRequests = [];
                let options = [5, 10, 25];
                if (res.totalRecords > 25) options.push(res.totalRecords);
                const config = {
                    columns: DEALERS_TABLE_COLUMNS,
                    data: res.data,
                    selection: true,
                    totalRecords: res.totalRecords || 0,
                    pageSizeOptions: options,
                };
                this._onUpdateCount.emit(res.totalRecords || 0);
                this.config = config;
                this.query = query;
        //     });
    }

    onSelect(event: any) {
        this.selectedRequests = event;
        this._onSelect.emit(event);
    }

    onClickCell(event: any) {
        if (event.key === 'approve') {
            this.triggerAction(DECISION.VERIFY, DECISION.APPROVE, [event.data]);
        } else if (event.key === 'reject') {
            this.triggerAction(DECISION.VERIFY, DECISION.REJECT, [event.data]);
        } else {
            if (event.data.currentState === 'Awaiting Approval') {
                this.sandbox.getPendingReqHistory({ refNo: event.data.sgsRef }).subscribe((res: any) => {
                    event.data['pendingHistory'] = res.data;
                    this.openSummary(event);
                });
            } else {
                this.openSummary(event);
            }
        }
    }

    openSummary(event: any) {
       
    }

    actOnSelected(decision: DECISION, mode: DECISION) {
        this.triggerAction(decision, mode, this.selectedRequests);
    }

    triggerAction(decision: DECISION, mode: DECISION, requests: any[], notes?: string, otp?: string) {
        const req: any = {
            actionId: this.prepareActionIds(mode, requests),
            action: decision,
            notes: notes,
        };
        if (otp) {
            req.validateOTPRequest = { softTokenUser: false, otp: otp };
        }
        this.sandbox.actOnRequest(req, decision, mode).subscribe((res) => {
            if (decision === DECISION.VERIFY) {
                const ref = this.dialog.openDrawer('REQUEST SUMMARY', DashboardRequestDetailsComponent, {
                    mode: mode,
                    data: requests,
                });
                ref.afterClosed().subscribe((res) => {
                    if (decision === DECISION.VERIFY) {
                        if (res.data === DECISION.APPROVE || res.data === DECISION.REJECT) {
                            this.triggerAction(DECISION.CONFIRM, mode, requests, res.notes, res.otp);
                        }
                    }
                });
            } else {
                this._onActionEnd.emit(true);
                this.lazyLoad(this.query);
            }
        });
    }

    public prepareActionIds(mode: any, requests: any[]) {
        const ids: Array<number> = [];
        requests.forEach((x: any) => {
            if (x.requestAction && x.requestAction.length) {
                const index = x.requestAction.findIndex((action: any) => action.action.name === mode);
                if (index !== -1) ids.push(x.requestAction[index].id);
            }
        });
        return ids;
    }
}
