import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';
import { OperationsApprovalsViewComponent } from '../operations-approvals-view/operations-approvals-view.component';
import { OperationsApprovalsActionComponent } from '../operations-approvals-action/operations-approvals-action.component';

@Component({
    selector: 'app-my-operations-requests',
    templateUrl: './my-operations-requests.component.html',
    styleUrls: ['./my-operations-requests.component.scss'],
})
export class MyOperationsRequestsComponent {
    @Input() requestType: any;
    DECISION = DECISION;
    query: any;
    requestsTypeRimDetails: any;
    from: FormGroup = new FormGroup({});

    columns = [
        {
            key: 'requestDateTime',
            displayName: 'CREATION DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'updated',
            displayName: 'RECEIVED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'channel',
            displayName: 'CHANNEL',
            type: ColumnType.label,
            sortable: true,
        },
        {
            key: 'customerNo',
            displayName: 'Rim',
            type: ColumnType.label,
            sortable: true,
        },
        {
            key: 'requestId',
            displayName: 'SERVICE REQUEST ID',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'requestDescription',
            displayName: 'REQUEST DESCRIPTION',
            type: ColumnType.label,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            sortable: true,
        },

        {
            key: 'action',
            displayName: 'ACTION',
            type: ColumnType.icon,
            icon: 'la-edit',
            callBackFn: this.checkForAction,
        },
    ];

    constructor(
        private router: Router,
        private dialog: CibDialogService,
        private sandBox: OperationsApprovalsSandbox,
        private fb: FormBuilder
    ) {}
    config!: CIBTableConfig;

    lazyLoad(query: any) {
        const form = this.from.value;
        Object.getOwnPropertyNames(form).forEach((control: any) => {
            query[control] = form[control];
        });
        query.type = this.requestType;
        this.sandBox.getServiceRequestList(query).subscribe((res) => {
            const config = {
                columns: this.columns,
                data: res.data,
                selection: false,
                totalRecords: res.totalRecords || 0,
            };
            this.config = config;
            this.query = query;
        });
    }

    checkForAction(data: any) {
        return data.status !== 'REJECTED' && data.status !== 'COMPLETED';
    }

    getRequestsTypeByRim() {
        this.sandBox.getRequestsTypeByRim(this.requestType).subscribe((res: any) => {
            this.requestsTypeRimDetails = res.data;
        });
    }

    onClickCell(event: any) {
        if (event.key === 'action') {
            const payload = { type: 'serviceRequest', event: event.data };
            const dialogRef = this.dialog.openDialog(CibDialogType.medium, OperationsApprovalsActionComponent, payload);
            dialogRef.afterClosed().subscribe((result: any) => {
                let currentUrl = this.router.url;
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate([currentUrl]);
            });
        } else if (event.key === 'requestId') {
            this.openSidePanel(event);
        } else {
        }
    }

    openSidePanel(event: any) {
        let fieldInfo = { data: event, requestType: 'serviceRequest' };
        let data = {
            headerName: 'REQUEST SUMMARY',
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, OperationsApprovalsViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === DECISION.CONFIRM.toLocaleLowerCase()) {
            }
        });
    }

    subscribeFilter() {
        this.from.valueChanges.subscribe((res: any) => {
            this.query = { ...this.query, ...res };
            this.query.pageNumber = 0;
            this.lazyLoad(this.query);
        });
    }

    ngOnInit(): void {
        this.from = this.fb.group({
            rimNumber: ['ALL', []],
            status: ['ALL', []],
        });
        this.getRequestsTypeByRim();
        this.subscribeFilter();
    }
}
