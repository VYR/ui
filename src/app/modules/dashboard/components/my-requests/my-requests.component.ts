import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { DECISION, REQUEST_LIST_TYPE } from 'src/app/shared/enums';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DashboardSandbox } from '../../dashboard.sandbox';
import { DashboardRequestDetailsPopupComponent } from '../dashboard-request-details-popup/dashboard-request-details-popup.component';
import { DashboardRequestDetailsComponent } from '../dashboard-request-details/dashboard-request-details.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SCHEME_TABLE_COLUMNS, USER_TABLE_COLUMNS } from 'src/app/modules/home/components/save-gold-scheme/constants/meta-data';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.scss'],
})
export class MyRequestsComponent implements OnChanges {
    @Input() duration: any;
    @Input() status: any;
    @Input() durationType!: any;
    query!: any;

    constructor(private router: Router, private dialog: SgsDialogService, private sandbox: DashboardSandbox) {}
    config!: SGSTableConfig;
    ngOnChanges() {
        if (this.query) {
            this.config = new SGSTableConfig();
            this.query = new SGSTableQuery();
            this.getRequests();
        }
    }
    lazyLoad(query: SGSTableQuery) {
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
                columns: SCHEME_TABLE_COLUMNS,
                data: res.data,
                selection: false,
                showPagination:true,
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
                    this.getRequests();
                });
            }
        });
    }
}
