import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE, REQUEST_STATUS, ROLE_NAME } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DashboardTradeFinanceDetailsPopupComponent } from '../dashboard-trade-finance-details-popup/dashboard-trade-finance-details-popup.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { DashboardSalaryPostingDetailsPopupComponent } from '../dashboard-salary-posting-details-popup/dashboard-salary-posting-details-popup.component';

@Component({
    selector: 'app-my-completed-requests',
    templateUrl: './my-completed-requests.component.html',
    styleUrls: ['./my-completed-requests.component.scss'],
})
export class MyCompletedRequestsComponent {
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
            sortable: true,
        },
        {
            key: 'reason',
            displayName: 'Reason',
        },
    ];

    searchForm!: UntypedFormGroup;
    config: CIBTableConfig = new CIBTableConfig();
    query: any;
    role!: ROLE_NAME;
    constructor(
        private router: Router,
        private dialog: CibDialogService,
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

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.sandbox
            .getRequestList(query, REQUEST_STATUS.COMPLETED, REQUEST_LIST_TYPE.MAKER_COMPLETED)
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
                event.data.requestType === 'TRADEFINANCE_IMPORT_LC_SUBMIT' ||
                event.data.requestType === 'TRADEFINANCE_LC_AMEND_SUBMIT'
            ) {
                let payload = {
                    type: 'LC',
                    data: event.data,
                };
                const header = 'Reference No: ' + (event.data.requestData.applnId || event.data.requestData.lcRefNo);
                if (event.data.requestData) {
                    const ref = this.dialog.openOverlayPanel(
                        header,
                        DashboardTradeFinanceDetailsPopupComponent,
                        payload
                    );
                    ref.afterClosed().subscribe((res: any) => {});
                }
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
                    const ref = this.dialog.openOverlayPanel(
                        header,
                        DashboardTradeFinanceDetailsPopupComponent,
                        payload
                    );
                    ref.afterClosed().subscribe((res: any) => {});
                }
            } else {
                const ref = this.dialog.openDrawer('REQUEST SUMMARY', DashboardRequestDetailsComponent, {
                    mode: DECISION.VIEW,
                    data: [event.data],
                });
                ref.afterClosed().subscribe();
            }
        }
    }

    deleteRequest(event: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, event.data);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandbox.deleteRequest(result.data).subscribe((res) => {
                    this.onSearch(this.config);
                });
            }
        });
    }
}
