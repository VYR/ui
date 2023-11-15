import { Component } from '@angular/core';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { PaymentsSandbox } from '../../payments.sandbox';
import { DeleteDhareebaRequestConfirmComponent } from '../delete-dhareeba-request-confirm/delete-dhareeba-request-confirm.component';
import { PaymentOtpViewComponent } from '../payment-otp-view/payment-otp-view.component';

@Component({
    selector: 'app-dhareeba',
    templateUrl: './dhareeba.component.html',
    styleUrls: ['./dhareeba.component.scss'],
})
export class DhareebaComponent {
    tableConfig!: CIBTableConfig;
    DECISION = DECISION;
    tinSummary: any = [];
    selectedTin: any;
    // tinNumber: any = '';
    billList: any = [];
    otp: any;
    dhareebaData: any;
    tinControlOpend: boolean = false;

    public cols = [
        {
            key: 'tinNumber',
            displayName: 'TIN NUMBER',
            sortable: true,
        },

        {
            key: DECISION.VIEW,
            displayName: 'VIEW BILL',
            type: ColumnType.icon,
            icon: 'la-eye',
            UUID: 'PAYMENT_VIEW_DHAREEBA_BILL',
        },
        {
            key: DECISION.DELETE,
            displayName: 'DELETE',
            type: ColumnType.icon,
            icon: 'la-trash',
            UUID: 'PAYMENT_DELETE_DHAREEBA_TIN_NUMBER',
        },
    ];

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    constructor(private sandBox: PaymentsSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getDhareenaTinList(this.queryParams);
    }

    checkForAction(data: any) {
        return true;
    }

    public getDhareenaTinList(queryParams: any) {
        this.sandBox.getDhareenaTinList(queryParams).subscribe((res: any) => {
            this.dhareebaData = res.data;
            this.loadDataTable(res.data);
        });
    }

    public getDhareenaBillList(tin: any) {
        this.sandBox.getDhareenaBillList(tin).subscribe((res: any) => {
            this.billList = res.data.billItems;
        });
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            columns: this.cols,
            data,
            selection: false,
            totalRecords: data.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            const sortedData = this.dhareebaData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(sortedData);
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        this.tinControlOpend = false;
        if (event.key === DECISION.DELETE) {
            const ref = this.dialog.openDialog(
                CibDialogType.small,
                DeleteDhareebaRequestConfirmComponent,
                event.data.tinNumber
            );
            ref.afterClosed().subscribe((res) => {
                if (res.decision === DECISION.CONFIRM) {
                    this.actOnRequest(DECISION.DELETE, event.data.tinNumber, DECISION.VERIFY);
                }
            });
        } else if (event.key === DECISION.VIEW) {
            this.selectedTin = event.data.tinNumber;
            this.getDhareenaBillList(event.data.tinNumber);
        }
    }

    actOnRequest(from: string, tinNumber: any, action: any) {
        const payload = {
            tinNumber,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };
        const event = from == DECISION.ADD ? this.sandBox.addTinNumber(payload) : this.sandBox.deleteTinNumber(payload);
        event.subscribe((res: any) => {
            if (action === DECISION.VERIFY) {
                this.openSidePanel(tinNumber, from);
            } else {
                if (res.status === DECISION.SUCCESS) {
                    if (from == DECISION.ADD) {
                        this.tableConfig.data.unshift({ tinNumber });
                    } else {
                        const index = this.tableConfig.data.findIndex((x: any) => x.tinNumber === tinNumber);
                        if (index !== -1) {
                            this.tableConfig.data.splice(index, 1);
                        }
                    }
                    this.tableConfig = {
                        ...this.tableConfig,
                    };
                    this.selectedTin = null;
                }
            }
        });
    }

    openSidePanel(tinNo: any, actionItem: any) {
        const fieldInfo = [{ fieldName: 'Tin Number', fieldValue: tinNo }];
        const data = {
            headerName: 'Confirm Tin Number',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === DECISION.CONFIRM.toLowerCase()) {
                this.otp = result.data;
                this.actOnRequest(actionItem, tinNo, DECISION.CONFIRM);
            }
        });
    }
}
