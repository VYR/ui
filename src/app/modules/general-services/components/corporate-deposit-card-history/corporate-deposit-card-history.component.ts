import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { CorporateDepositCardHistoryPopupComponent } from '../corporate-deposit-card-history-popup/corporate-deposit-card-history-popup.component';

@Component({
    selector: 'app-corporate-deposit-card-history',
    templateUrl: './corporate-deposit-card-history.component.html',
    styleUrls: ['./corporate-deposit-card-history.component.scss'],
})
export class CorporateDepositCardHistoryComponent {
    @Output() closeHistory = new EventEmitter<string>();
    depositCardRequestList: any = [];
    columns = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'id',
            displayName: 'Request Id',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'accountNo',
            displayName: 'Account Number',
            sortable: true,
        },
        {
            key: 'companyName',
            displayName: 'Company Name',
            sortable: true,
        },
        {
            key: 'commRegNo',
            displayName: 'CR Number',
            sortable: true,
        },
        {
            key: 'companyAddress',
            displayName: 'Company Address',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
    ];
    config: CIBTableConfig = new CIBTableConfig();
    constructor(private sandBox: GeneralServicesSandbox, private dialog: CibDialogService) {}

    goBack() {
        this.closeHistory.emit();
    }

    ngOnInit(): void {
        this.sandBox._getDepositCardHistory().subscribe((res: any) => {
            let metaDataList = res.data.externalCardRequestsMetaDtoList;
            let masterData = res.data.externalCardRequestsMasterDtoList;
            metaDataList.forEach((data: any) => {
                let depositReq: any = {};
                depositReq = data;
                depositReq.accountNo = data.linkCurrentAcc || data.linkSavingAcc;
                let address: String[] = [];
                if (depositReq.addrLine1) address.push('Building No:' + ' ' + depositReq.addrLine1);
                if (depositReq.addrLine2) address.push('Street No:' + ' ' + depositReq.addrLine2);
                if (depositReq.addrLine3) address.push('Zone No:' + ' ' + depositReq.addrLine3);
                if (depositReq.poBox) address.push('PO Box: ' + depositReq.poBox);
                depositReq.companyAddress = address.join(', ');
                depositReq.cards = masterData.filter((cards: any) => cards.parentId === data.id);
                this.depositCardRequestList.push(depositReq);
            });
            this.loadDataTable();
        });
    }

    loadDataTable() {
        this.config = {
            columns: this.columns,
            data: this.depositCardRequestList,
            selection: false,
            totalRecords: this.depositCardRequestList.length || 0,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.depositCardRequestList = this.depositCardRequestList.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        const ref = this.dialog.openDialog(
            CibDialogType.medium,
            CorporateDepositCardHistoryPopupComponent,
            event.data.cards
        );
        ref.afterClosed().subscribe((res: any) => {});
    }
}
