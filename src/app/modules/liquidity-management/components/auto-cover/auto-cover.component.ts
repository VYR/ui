import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CIBTableConfig, CIBTableQuery } from '../../../../cib-components/cib-table/models/config.model';
import { LiquidityManagementSandbox } from '../../liquidity-management.sandbox';
import { LiquidityConfirmationComponent } from '../liquidity-confirmation/liquidity-confirmation.component';

@Component({
    selector: 'app-auto-cover',
    templateUrl: './auto-cover.component.html',
    styleUrls: ['./auto-cover.component.scss'],
})
export class AutoCoverComponent implements OnInit {
    autoCoverForm: FormGroup = new FormGroup({});

    coverAccounts: any[] = [];
    txnAccounts: any[] = [];
    tempFromAccountList: any[] = [];
    accountList: any[] = [];
    autoCoverAccountList: any[] = [];
    invalidTransactionAcc: any[] = [];
    autoCoverCategory: any[] = [];
    autoCoverFromCategory: any[] = [];

    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'linkedAccountList',
            displayName: 'Cover Account',
            sortable: true,
        },
        {
            key: 'accountList',
            displayName: 'Transaction Account',
            sortable: true,
        },
    ];

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };

    constructor(
        private _formBuilder: FormBuilder,
        private lmSandbox: LiquidityManagementSandbox,
        private dialogService: CibDialogService
    ) {}

    ngOnInit(): void {
        this.autoCoverForm = this._formBuilder.group({
            linkedAccountList: [null, Validators.required],
            accountList: [null, Validators.required],
        });
        const initialData = this.lmSandbox.initialData;

        this.lmSandbox.getAutocoverAccountList().subscribe((res: any) => {
            this.accountList = initialData.accounts.data.accounts;
            this.autoCoverAccountList = this.processData(res.data);
            this.autoCoverCategory = initialData.catList.data.autoCover;
            this.autoCoverFromCategory = initialData.catList.data.autoCoverFrom;

            this.updateCoverandFromAccountList();

            this.tableConfig = {
                columns: this.cols,
                data: this.autoCoverAccountList,
                selection: false,
                totalRecords: this.autoCoverAccountList.length,
                clientPagination: true,
            };
        });
    }

    updateCoverandFromAccountList() {
        let autoCovrAccFilter: any[] = [];
        let txnAccFilter: any[] = [];
        this.coverAccounts = [];
        this.txnAccounts = [];

        this.autoCoverAccountList.forEach((acl) => {
            autoCovrAccFilter = autoCovrAccFilter.concat(acl.accountList);
            txnAccFilter = txnAccFilter.concat(acl.accountList).concat(acl.linkedAccountList);
            // temporary fix to check if the account is invalid in t24
            this.invalidTransactionAcc = this.invalidTransactionAcc.concat(acl.cancelledAccountList);
        });

        this.coverAccounts = this._parseAccount(this.autoCoverCategory, autoCovrAccFilter);
        this.tempFromAccountList = this._parseAccount(this.autoCoverFromCategory, txnAccFilter);
    }

    private _parseAccount(category: any, accFilter: any) {
        const accounts = this.accountList.filter((list) => {
            if (category.indexOf(list.category.transactionRef) !== -1 && accFilter.indexOf(list.account_no) === -1) {
                list['accountNumber'] = list?.accountNumber || list?.account_no;
                list['description'] = list?.description || list?.category.description;
                list['balance'] = list?.available_bal || 0;
                return true;
            } else {
                return false;
            }
        });
        return accounts;
    }

    coverAccChange(selectedCoverAcc: any) {
        this.txnAccounts = this.tempFromAccountList;
        this.txnAccounts = this.txnAccounts.filter(function (list) {
            return selectedCoverAcc.account_no !== list.account_no && selectedCoverAcc.currency === list.currency;
        });
        this.autoCoverForm.get('accountList')?.reset();
    }

    lazyLoad(query: CIBTableQuery) {
        this.queryParams = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            sortKey: query.sortKey,
            sortDirection: query.sortDirection,
        };

        if (this.queryParams.sortKey && this.queryParams.sortDirection) {
            this.autoCoverAccountList = this.autoCoverAccountList.sort((a, b) => {
                if (this.queryParams.sortDirection === 'ASC') {
                    return a[this.queryParams.sortKey] - b[this.queryParams.sortKey];
                } else {
                    return b[this.queryParams.sortKey] - a[this.queryParams.sortKey];
                }
            });

            this.tableConfig = {
                columns: this.cols,
                data: this.autoCoverAccountList,
                selection: false,
                totalRecords: this.autoCoverAccountList.length,
                clientPagination: true,
            };
        }
    }

    processData(data: any) {
        data.forEach((accounts: any) => {
            ['accountList', 'linkedAccountList'].forEach((type: string) => {
                accounts[type] = (accounts[type] && accounts[type].join(',')) || '';
            });
        });
        return data;
    }

    submitAutoCover() {
        let data = {
            header: '<div>Setup Auto Cover</div>',
            body: '<div>In case of any existing Auto Cover setup for the selected Transaction Account(s), the earlier Cover Account would be overridden. Please confirm.</div>',
        };
        let dialogRef = this.dialogService.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                const formValue = this.autoCoverForm.getRawValue();
                const payload = {
                    linkedAccountList: formValue.linkedAccountList?.accountNumber?.split(','),
                    accountList: formValue.accountList.map((account: any) => account.accountNumber),
                    action: 'VERIFY',
                    validateOTPRequest: {},
                };
                this.submitForm('VERIFY', payload);
            }
        });
    }

    submitForm(action: string, payload: any) {
        this.lmSandbox.createAutocoverAccount(payload, action).subscribe((res) => {
            if (action === 'VERIFY') {
                this.getConsent(payload);
            } else {
                this.autoCoverForm.reset();
                this.txnAccounts = [];
            }
        });
    }

    getConsent(payload: any) {
        let data = {
            headerName: 'REQUEST SUMMARY',
            isOtpNeeded: true,
            fields: payload,
        };

        const ref = this.dialogService.openDrawer(data.headerName, LiquidityConfirmationComponent, data);
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                this.submitForm('CONFIRM', res?.data);
            }
        });
    }
}
