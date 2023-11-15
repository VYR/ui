import { Component, OnInit, ViewChild } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { ManualTransfersSandbox } from '../../manual-transfers.sandbox';
import { Router } from '@angular/router';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { UtilService } from 'src/app/utility';
import { MatPerviewComponent } from '../mat-perview/mat-perview.component';

@Component({
    selector: 'app-manual-transfer-list',
    templateUrl: './manual-transfer-list.component.html',
    styleUrls: ['./manual-transfer-list.component.scss'],
})
export class ManualTransferListComponent implements OnInit {
    @ViewChild('menuTrigger') trigger: any;
    tableConfig!: CIBTableConfig;
    query: any;
    manualTransferList: any = [];
    public cols = [
        {
            key: 'createdDate',
            displayName: 'CREATED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'transactionId',
            displayName: 'REF NO.',
            sortable: true,
        },
        {
            key: 'transferType',
            displayName: 'TRANSFER TYPE',
            sortable: true,
        },
        {
            key: 'fromAccount',
            displayName: 'FROM ACCOUNT',
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'TO ACCOUNT',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'refID',
            displayName: 'FT REF. / REASON',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'preview',
            displayName: 'PREVIEW',
            type: ColumnType.icon,
            icon: 'la-file-pdf',
            callBackFn: this.checkForPreviewAction,
            minWidth: 3,
        },
        {
            key: 'retry',
            displayName: 'RETRY',
            type: ColumnType.icon,
            icon: 'la-redo-alt',
            callBackFn: this.checkForRetryAction,
            minWidth: 3,
            UUID: 'TRANSFER_SIMPLE_CREATE',
        },
        {
            key: 'delete',
            displayName: 'DELETE',
            type: ColumnType.icon,
            icon: 'la-trash-alt',
            callBackFn: this.checkForDeleteAction,
            minWidth: 3,
            UUID: 'TRANSFER_SIMPLE_UPDATE',
        },
    ];

    public filterCsdForm!: FormGroup;

    filterPipe = new CIBDefinition();

    constructor(
        private sandBox: ManualTransfersSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private fb: FormBuilder,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.filterCsdForm = this.fb.group({
            trnRef: ['', Validators.required],
        });
        this.getManualTransferList();
    }

    onClickCell(event: any) {
        if (event.key === 'delete') this.deleteTranferRequest(event.data);
        if (event.key === 'retry') {
            this.sandBox.setManualTransferData(event.data);
            this.router.navigate(['home/manual-transfers/create-manual-transfer']);
        }
        if (event.key === 'preview') {
            let data = {
                data: event.data,
            };
            const header = 'Reference: ' + event.data.transactionId;
            const dialogRef = this.dialog.openOverlayPanel(header, MatPerviewComponent, data, CibDialogType.large);
        }
    }

    checkForPreviewAction(data: any) {
        return ['SUCCESS', 'FAILED', 'REJECTED'].indexOf(data.status) === -1;
    }

    checkForRetryAction(data: any) {
        return data.status === 'REJECTED';
    }

    checkForDeleteAction(data: any) {
        return data.status === 'PENDING' || data.status === 'REJECTED';
    }

    lazyLoad(event: any) {
        if (event.sortKey) {
            this.manualTransferList = this.manualTransferList.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.manualTransferList);
        }
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }

    deleteTranferRequest(transfer: any) {
        const request = {
            groupId: transfer.transactionId,
            action: 'delete',
            rejectReason: '',
            simpleTransferBeanList: [{}],
        };
        this.sandBox.deleteManualTransfer(request).subscribe((res: any) => {
            this.utilService.displayNotification('Manual Transfer deleted successfully', 'success');
            this.getManualTransferList();
        });
    }

    closeMatmenu() {
        this.filterCsdForm.controls['trnRef'].reset();
        this.trigger.closeMenu();
    }

    filterInquiry() {
        const listData = this.manualTransferList.filter(
            (t: any) => t.transactionId === this.filterCsdForm.controls['trnRef'].value
        );
        this.closeMatmenu();
        this.loadDataTable(listData);
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public getManualTransferList() {
        this.manualTransferList = [];
        this.sandBox.getManualTransferList().subscribe((res: any) => {
            if (res.data) {
                res.data.forEach((data: any) => {
                    let manualTransferData: any = {};
                    manualTransferData = data?.requestData?.simpleTransferBeanList[0];
                    manualTransferData['createdDate'] = data?.createdDate;
                    (manualTransferData['transferType'] = this.filterPipe.transform(
                        manualTransferData.payeeType,
                        'PAYEE'
                    )),
                        (manualTransferData['status'] = data?.approvedByCsd);
                    if (data.status) {
                        manualTransferData['status'] = data?.status;
                    }
                    if (data.ftRef) {
                        manualTransferData['refID'] = data.ftRef;
                    }
                    manualTransferData['transactionId'] = data?.transferGroupId.replace(
                        'SIMPLE_TRANSFER_CIB_GROUP_ID',
                        ''
                    );
                    this.manualTransferList.push(manualTransferData);
                });

                let config = {
                    columns: this.cols,
                    data: this.manualTransferList,
                    selection: false,
                    totalRecords: this.manualTransferList.length,
                    clientPagination: true,
                };
                this.tableConfig = config;
            }
        });
    }
}
