import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { ReportsSandbox } from '../../reports.sandbox';

@Component({
    selector: 'app-search-future-dated-transfer',
    templateUrl: './search-future-dated-transfer.component.html',
    styleUrls: ['./search-future-dated-transfer.component.scss'],
})
export class SearchFutureDatedTransferComponent implements OnInit {
    stoList: any = [];
    tableConfig!: CIBTableConfig;
    showPaymentDetails = false;
    paymentDetails!: any;

    public cols = [
        {
            key: 'createdOn',
            displayName: 'CREATED DATE',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'parentFDP',
            displayName: 'REFRENCE ID',
            type: ColumnType.link,
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'payeeType',
            displayName: 'TYPE',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'fromAccount',
            displayName: 'FROM ACCOUNT',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'TO ACCOUNT',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'benefCurrency',
            displayName: 'CURRENCY',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'frequencySet',
            displayName: 'FREQUENCY',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'occurence',
            displayName: 'OCCURANCE',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'nextExecDate',
            displayName: 'NEXT EXECUTION DATE',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'purposeCustRef',
            displayName: 'CUSTOMER REFERENCE',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'delete',
            displayName: '',
            type: ColumnType.icon,
            icon: 'la-trash-alt',
            callBackFn: this.checkForAction,
        },
    ];

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'createdOn',
    };
    queryParams!: any;
    filterPipe = new CIBDefinition();
    constructor(private sandBox: ReportsSandbox, private router: Router, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getSTOList();
    }

    checkForAction(data: any) {
        if (data.status === 'PENDING') return true;
        else return false;
    }

    public getSTOList() {
        this.sandBox.getSTOList(this.query).subscribe((res: any) => {
            if (res.data) {
                this.stoList = res.data.content;
                res.data.content.forEach((resp: any) => {
                    resp.frequencySet = resp.fdpType === '1' ? 'ONE-TIME' : resp.frequencySet;
                    resp.payeeType = this.filterPipe.transform(resp.payeeType, 'PAYEE');
                });

                let config = {
                    columns: this.cols,
                    data: res.data.content,
                    selection: false,
                    totalRecords: res.data.totalElements,
                };

                this.tableConfig = config;
            }
        });
    }

    generateExcel() {
        this.queryParams = {
            pageSize: 10000,
            pageIndex: 0,
        };
        this.sandBox.getSTOListExcel(this.queryParams);
    }

    generatePdf() {
        this.queryParams = {
            pageSize: 10000,
            pageIndex: 0,
            downloadtype: 'pdf',
        };
        this.sandBox.getSTOList(this.queryParams).subscribe((res: any) => {});
    }

    onClose(event: boolean) {
        if (event) this.showPaymentDetails = false;
    }

    onClickCell(event: any) {
        if (event.key === 'parentFDP') {
            this.paymentDetails = event.data;
            this.showPaymentDetails = true;
        }
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Standing Order</div>',
                body: '<div>Do you want to delete this Standing Order ?</div>',
            };

            const ref = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            ref.afterClosed().subscribe((res) => {
                if (res.event === 'confirm') {
                    this.deleteFDP(event.data);
                }
            });
        }
    }

    deleteFDP(selectedRow: any) {
        const payload = {
            action: 'CLEARALL',
            parentFDPId: selectedRow.parentFDP,
        };

        this.sandBox.deleteFdp(payload).subscribe((res: any) => {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate([APP_ROUTES.SEARCH_STO]);
            });
        });
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.getSTOList();
    }
}
