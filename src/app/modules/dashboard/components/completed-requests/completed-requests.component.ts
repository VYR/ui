import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE, REQUEST_STATUS, ROLE_NAME } from 'src/app/shared/enums';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';

@Component({
    selector: 'app-completed-requests',
    templateUrl: './completed-requests.component.html',
    styleUrls: ['./completed-requests.component.scss'],
})
export class CompletedRequestsComponent {
    moduleTypes = [
        'ALL',
        'ACCOUNTS',
        'TRANSFER',
        'STO',
        'CARDS',
        'PAYMENT',
        'GENERAL_SERVICES',
        'CHEQUE_MANAGEMENT',
        'LIQUIDITY_MANAGEMENT',
        'TRADE_FINANCE',
    ];

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
            key: 'sgsRef',
            displayName: 'Request Id',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
        },
        {
            key: 'txnAmount',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'action',
            displayName: 'User Action',
            type: ColumnType.status,
        },
        {
            key: 'currentState',
            displayName: 'Workflow Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'reason',
            displayName: 'Reason',
        },
    ];

    searchForm!: UntypedFormGroup;
    config: SGSTableConfig = new SGSTableConfig();
    query: any;
    role!: ROLE_NAME;
    constructor(
        private router: Router,
        private dialog: SgsDialogService,
        public fb: UntypedFormBuilder,
        private sandbox: DashboardSandbox
    ) {
        this.config.pageSize = 10;
        this.searchForm = this.fb.group({
            id: [null],
            type: ['ALL'],
        });
        const role = this.sandbox.userContext.role.name.toUpperCase();
        this.searchForm.valueChanges.subscribe((res: any) => {
            this.onSearch(this.searchForm.value);
        });
    }

    lazyLoad(query: SGSTableQuery) {
        this.query = query;
        this.sandbox
            .getRequestList(query, REQUEST_STATUS.COMPLETED, REQUEST_LIST_TYPE.APPROVER_COMPLETED)
            .subscribe((res: any) => {
                res.data.map((record: any) => {
                    record.requestAction = record.requestAction.sort((a: any, b: any) => {
                        if (a.note?.note === b.note?.note) {
                            return 0;
                        }
                        if (!a.note?.note) {
                            return 1;
                        }
                        if (!b.note?.note) {
                            return -1;
                        }
                        return a.note?.note < b.note?.note ? 1 : -1;
                    });
                    if (record.requestAction && record.requestAction[0]) {
                        record.reason = record.requestAction[0].note ? record.requestAction[0].note.note : '';
                        record.action = record.requestAction[0].action ? record.requestAction[0].action.name : '';
                    }
                });
                const config = {
                    columns: this.columns,
                    data: res.data,
                    selection: false,
                    totalRecords: res.totalRecords || 0,
                    pageSizeOptions: [5, 10, 25],
                };
                this.config = config;
            });
    }

    onSearch(form: any) {
        this.query.searchByID = (form.id || '').trim();
        this.query.searchByType = form.type;
        this.lazyLoad(this.query);
    }

    back() {}
    onSelect(data: any) {}

    onClickCell(event: any) {
        if (event.key === 'delete') {
            this.deleteRequest(event);
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

    deleteRequest(event: any) {
        const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandbox.deleteRequest(result.data).subscribe((res) => {
                    this.onSearch(this.config);
                });
            }
        });
    }
}
