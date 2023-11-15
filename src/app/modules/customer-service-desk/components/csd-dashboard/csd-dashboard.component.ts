import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CsdUser } from 'src/app/shared/models/csdUser.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { CustomerServiceDeskSandbox } from '../../customer-service-desk.sandbox';
import { CsdApprovalsActionComponent } from '../csd-approvals-action/csd-approvals-action.component';

@Component({
    selector: 'app-csd-dashboard',
    templateUrl: './csd-dashboard.component.html',
    styleUrls: ['./csd-dashboard.component.scss'],
})
export class csdDashboardComponent implements OnInit {
    @ViewChild('menuTrigger') trigger: any;
    tableConfig!: CIBTableConfig;
    query: any;
    adminRequests: any;
    selectedStatus: any;
    public filterCsdForm!: FormGroup;
    csdAprroveList: any;
    public cols = [
        {
            key: 'createdDate',
            displayName: 'CREATED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'transferGroupId',
            displayName: 'REFERENCE NO.',
        },
        {
            key: 'fromAccount',
            displayName: 'FROM ACCOUNT',
        },
        {
            key: 'currency',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'TO ACCOUNT',
        },
        {
            key: 'payeeType',
            displayName: 'TRANSFER TYPE',
        },
        {
            key: 'approvedByCsd',
            type: ColumnType.status,
            displayName: 'STATUS',
            sortable: true,
        },
        {
            key: 'reject',
            displayName: 'REJECT',
            type: ColumnType.reject,
            callBackFn: this.checkForAction,
        },
        {
            key: 'approve',
            displayName: 'APPROVE',
            type: ColumnType.approve,
            callBackFn: this.checkForAction,
        },
    ];
    constructor(
        private sandBox: CustomerServiceDeskSandbox,
        private dialog: CibDialogService,
        private fb: FormBuilder
    ) {}
    filterPipe = new CIBDefinition();
    ngOnInit(): void {
        this.filterCsdForm = this.fb.group({
            trnRef: ['', Validators.required],
        });
        this.csdRequests();
    }

    onClickCell(event: any) {
        if (event.key === 'approve' || event.key === 'reject') {
            this.onActionClick(event.key, event);
        }
    }

    checkForAction(data: any) {
        return data.approvedByCsd === 'PENDING';
    }

    onActionClick(action: any, event: any) {
        let data = {
            headerName: 'Request Summary',
            fields: event,
            type: action,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, CsdApprovalsActionComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            this.csdRequests();
        });
    }

    filterInquiry() {
        const listData = this.csdAprroveList.filter(
            (t: any) => t.transferGroupId === this.filterCsdForm.controls['trnRef'].value
        );
        this.closeMatmenu();
        this.loadDataTable(listData);
    }

    closeMatmenu() {
        this.filterCsdForm.controls['trnRef'].reset();
        this.trigger.closeMenu();
    }

    public csdRequests() {
        this.sandBox.csdRequestTypeList().subscribe((res: any) => {
            if (res.data) {
                const csdData: any = [];
                res.data.forEach((data: any) => {
                    let csdList = new CsdUser();
                    csdList = { ...data?.requestData?.simpleTransferBeanList[0] };
                    csdList.payeeType = this.filterPipe.transform(
                        data?.requestData?.simpleTransferBeanList[0].payeeType,
                        'PAYEE'
                    );
                    csdList.approvedByCsd = data?.approvedByCsd;
                    csdList.createdDate = data?.createdDate;
                    csdList.fullData = data?.requestData?.simpleTransferBeanList[0];
                    csdList.transferGroupId = data?.transferGroupId.replace('SIMPLE_TRANSFER_CIB_GROUP_ID', '');
                    csdList.id = data?.transferGroupId;
                    csdData.push(csdList);
                });

                this.loadDataTable(csdData);
            }
        });
    }

    loadDataTable(data: any) {
        this.csdAprroveList = data;
        this.tableConfig = {
            columns: this.cols,
            data,
            selection: false,
            totalRecords: data.length,
            clientPagination: true,
        };
    }
}
