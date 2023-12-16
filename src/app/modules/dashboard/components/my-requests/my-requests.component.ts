import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DashboardSalaryPostingDetailsPopupComponent } from '../dashboard-salary-posting-details-popup/dashboard-salary-posting-details-popup.component';
import { DashboardTradeFinanceDetailsPopupComponent } from '../dashboard-trade-finance-details-popup/dashboard-trade-finance-details-popup.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.scss'],
})
export class MyRequestsComponent implements OnChanges {
    @Input() duration: any;
    @Input() status: any;
    @Input() durationType!: any;
    columns = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'userId',
            displayName: 'User Id',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'name',
            displayName: 'Name',
            type: ColumnType.label,
            sortable: true,
        },
        {
            key: 'schemeType',
            displayName: 'Scheme',
            type: ColumnType.label,
            sortable: true,
        },
        {
            key: 'txnAmount',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'currentState',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        }
    ];
    query!: any;

    constructor(private router: Router, private dialog: CibDialogService, private sandbox: DashboardSandbox) {}
    config!: CIBTableConfig;
    ngOnChanges() {
        if (this.query) {
            this.config = new CIBTableConfig();
            this.query = new CIBTableQuery();
            this.getRequests();
        }
    }
    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.query.dateRange = this.duration;
        this.getRequests();
    }

    checkForAction(data: any) {
        let completeActivityCount = 0;
        let requestAction = data.requestAction || [];
        requestAction.forEach((action: any) => {
            if (action.complete) {
                completeActivityCount++;
            }
        });
        return data.currentState === 'Awaiting Approval' && completeActivityCount === 0;
    }

    getRequests() {
        let query: any = { ...this.query };
        if (this.status === 'PENDING') {
            query.fetchAll = this.durationType === 'All';
        } else if (this.status === 'PENDING' && !query.dateRange) {
            query.fetchAll = false;
        }
        //this.sandbox.getRequestList(query, this.status, REQUEST_LIST_TYPE.MY_QUEUE).subscribe((res) => {
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
            const config = {
                columns: this.columns,
                data: res.data,
                selection: false,
                totalRecords: res.totalRecords || 0,
                pageSizeOptions: [5, 10, 25],
            };
            this.config = config;
       // });
    }

    onSelect(event: any) {}

    onClickCell(event: any) {
        console.log(event);
        if (event.key === 'delete') {
            this.deleteRequest(event);
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

    deleteRequest(event: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, event.data);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandbox.deleteRequest(result.data).subscribe((res) => {
                    this.getRequests();
                });
            }
        });
    }
}
