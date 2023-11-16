import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ColumnType, CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE, REQUEST_STATUS } from 'src/app/shared/enums';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DashboardSalaryPostingDetailsPopupComponent } from '../dashboard-salary-posting-details-popup/dashboard-salary-posting-details-popup.component';
import { DashboardTradeFinanceDetailsPopupComponent } from '../dashboard-trade-finance-details-popup/dashboard-trade-finance-details-popup.component';

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
    columns = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'requestDescription',
            displayName: 'Type',
            sortable: true,
        },
        {
            key: 'cibRef',
            displayName: 'Request Id',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            minWidth: 5,
        },
        {
            key: 'txnAmount',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'currentState',
            displayName: 'Workflow Status',
            type: ColumnType.status,
        },
        {
            key: 'reject',
            displayName: 'Reject',
            type: ColumnType.reject,
        },
        {
            key: 'approve',
            displayName: 'Approve',
            type: ColumnType.approve,
        },
    ];
    @Input() durationType!: any;
    constructor(private dialog: CibDialogService, private sandbox: DashboardSandbox) {}
    config!: CIBTableConfig;
    ngOnChanges() {
        console.log(this.durationType);
        if (this.query) {
            //this.lazyLoad(this.query);
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
        //         this.selectedRequests = [];
        //         let options = [5, 10, 25];
        //         if (res.totalRecords > 25) options.push(res.totalRecords);
        //         const config = {
        //             columns: this.columns,
        //             data: res.data,
        //             selection: true,
        //             totalRecords: res.totalRecords || 0,
        //             pageSizeOptions: options,
        //         };
        //         this._onUpdateCount.emit(res.totalRecords || 0);
        //         this.config = config;
        //         this.query = query;
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
                this.sandbox.getPendingReqHistory({ refNo: event.data.cibRef }).subscribe((res: any) => {
                    event.data['pendingHistory'] = res.data;
                    this.openSummary(event);
                });
            } else {
                this.openSummary(event);
            }
        }
    }

    openSummary(event: any) {
        if (event.data.requestType.includes('TRANSFER_BULK')) {
            const ref = this.dialog.openOverlayPanel(
                'BULK TRANSFER',
                DashboardRequestDetailsPopupComponent,
                event.data
            );
            ref.afterClosed().subscribe((res: any) => {});
        } else if (event.data.requestType.includes('BULK_TRANSFER_SALARY_POSTING')) {
            const ref = this.dialog.openOverlayPanel(
                'SALARY POSTING',
                DashboardSalaryPostingDetailsPopupComponent,
                event.data
            );
            ref.afterClosed().subscribe((res: any) => {});
        } else if (
            event.data.requestType === 'BANK_GUARANTEE_SUBMIT' ||
            event.data.requestType === 'BANK_GUARANTEE_AMMEND'
        ) {
            let payload = {
                type: 'BG',
                data: event.data,
            };
            const header = 'Reference No: ' + (event.data.requestData.bgApplicationId || event.data.id);
            if (event.data.requestData) {
                const ref = this.dialog.openOverlayPanel(header, DashboardTradeFinanceDetailsPopupComponent, payload);
                ref.afterClosed().subscribe((res: any) => {});
            }
        } else if (
            event.data.requestType === 'TRADEFINANCE_IMPORT_LC_SUBMIT' ||
            event.data.requestType === 'TRADEFINANCE_LC_AMEND_SUBMIT'
        ) {
            let payload = {
                type: 'LC',
                data: event.data,
            };
            const header = 'Reference No: ' + (event.data.requestData.applnId || event.data.requestData.lcRefNo);
            if (event.data.requestData) {
                const ref = this.dialog.openOverlayPanel(header, DashboardTradeFinanceDetailsPopupComponent, payload);
                ref.afterClosed().subscribe((res: any) => {});
            }
        } else {
            const ref = this.dialog.openDrawer('REQUEST SUMMARY', DashboardRequestDetailsComponent, {
                mode: DECISION.VIEW,
                data: [event.data],
            });
            ref.afterClosed().subscribe((res) => {});
        }
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
