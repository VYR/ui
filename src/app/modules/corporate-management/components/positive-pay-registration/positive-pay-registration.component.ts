import { Component } from '@angular/core';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';
import { UtilService } from 'src/app/utility';

@Component({
    selector: 'app-positive-pay-registration',
    templateUrl: './positive-pay-registration.component.html',
    styleUrls: ['./positive-pay-registration.component.scss'],
})
export class PositivePayRegistrationComponent {
    postivePayAccounts: any = [];
    showAccountList: boolean = false;
    sortedData: any = [];
    selectedAccount: any;
    constructor(private sandBox: CorporateManagementSandbox, private utilService: UtilService) {}

    accountList: any = [];
    rimInput: any;
    tableConfig!: CIBTableConfig;

    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'account_no' };

    query: CIBTableQuery = this.params;

    public cols = [
        {
            key: 'account_no',
            displayName: 'Account Number',
            sortable: true,
        },
        {
            key: 'desc',
            displayName: 'Account Type',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'current_balance',
            displayName: 'Current Balance',
            type: ColumnType.amount,
            sortable: true,
        },
    ];

    enableSearch(): boolean {
        if (this.rimInput && this.rimInput.toString().length > 0) return false;
        return true;
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.sortedData,
            selection: false,
            totalRecords: this.sortedData.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.sortedData = this.postivePayAccounts.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    addRIM() {
        let payload = {
            accountNumber: this.selectedAccount.account_no,
            rim: this.rimInput,
        };
        this.sandBox.registerPositivePay(payload).subscribe((res: any) => {
            if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED')
                this.utilService.displayNotification(
                    'Your Request has been sent for approval. Request ID: #' + res.data.requestId,
                    'success'
                );
        });
    }

    searchRIM() {
        this.accountList = [];
        this.postivePayAccounts = [];
        this.showAccountList = false;
        this.sandBox.getPositivePayPerRim(this.rimInput).subscribe((res: any) => {
            if (res.data?.positivePayAccount) {
                res.data.positivePayAccount.forEach((element: any) => {
                    element.account.desc = element.account.category?.description;
                    if (!element.positivePayAccount) {
                        this.showAccountList = true;
                        this.accountList.push(element.account);
                    } else this.postivePayAccounts.push(element.account);
                });
            }
            let config = {
                columns: this.cols,
                data: this.postivePayAccounts,
                selection: false,
                totalRecords: this.postivePayAccounts.length,
                clientPagination: true,
            };
            this.tableConfig = config;
        });
    }
}
