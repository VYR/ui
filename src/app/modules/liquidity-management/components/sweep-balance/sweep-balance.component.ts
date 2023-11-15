import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CIBTableConfig, CIBTableQuery, ColumnType } from '../../../../cib-components/cib-table/models/config.model';
import { LiquidityManagementSandbox } from '../../liquidity-management.sandbox';
import { LiquidityConfirmationComponent } from '../liquidity-confirmation/liquidity-confirmation.component';

@Component({
    selector: 'app-sweep-balance',
    templateUrl: './sweep-balance.component.html',
    styleUrls: ['./sweep-balance.component.scss'],
})
export class SweepBalanceComponent implements OnInit {
    sweepForm: FormGroup = new FormGroup({});

    accountList: any[] = [];
    registeredAccountList: any[] = [];
    tempFromAccountList: any[] = [];
    fromAccountList: any[] = [];
    toAccountList: any[] = [];
    sweepData: any[] = [];

    fromAccCategory: any[] = [];
    toAccCategory: any[] = [];
    oldAmount!: number;

    editForm = false;

    entitlement = {
        history: 'AUTO_SWEEP_HISTORY',
        registeredAccounts: 'AUTO_SWEEP_REGISTERED_ACCOUNT_LIST',
        create: 'AUTO_SWEEP',
        delete: 'AUTO_SWEEP_DELETE',
        update: 'AUTO_SWEEP_UPDATE',
    };

    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'fromAccount',
            displayName: 'From Account',
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'To Account',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'Threshold Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'edit',
            displayName: 'Edit',
            type: ColumnType.icon,
            icon: 'la-edit',
            UUID: this.entitlement.update,
        },
        {
            key: 'delete',
            displayName: 'Delete',
            type: ColumnType.icon,
            icon: 'la-trash',
            UUID: this.entitlement.delete,
        },
    ];

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };

    constructor(
        private _formBuilder: FormBuilder,
        private lmSandbox: LiquidityManagementSandbox,
        private dialogService: CibDialogService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.sweepForm = this._formBuilder.group({
            fromAccount: [null, Validators.required],
            toAccount: [null, Validators.required],
            currency: [null, Validators.required],
            amount: [null, Validators.required],
        });

        const initialData = this.lmSandbox.initialData;

        this.lmSandbox.getSweepAccountList().subscribe((res: any) => {
            this.accountList = initialData.accounts.data.accounts;
            this.registeredAccountList = res.data;
            this.fromAccCategory = initialData.catList.data.balanceSweepFrom;
            this.toAccCategory = initialData.catList.data.balanceSweepTo;

            this.updateFromAndToAccountList();

            this.tableConfig = {
                columns: this.cols,
                data: this.registeredAccountList,
                selection: false,
                totalRecords: this.registeredAccountList.length,
                clientPagination: true,
            };
        });
    }

    updateFromAndToAccountList() {
        let fromAccFilter: any[] = [];
        let toAccFilter: any[] = [];
        this.registeredAccountList.forEach((ral) => {
            fromAccFilter.push(ral.fromAccount);
            fromAccFilter.push(ral.toAccount);
            toAccFilter.push(ral.fromAccount);
        });
        this.fromAccountList = this._parseAccounts(this.accountList, fromAccFilter, this.fromAccCategory);
        this.tempFromAccountList = this._parseAccounts(this.accountList, toAccFilter, this.toAccCategory);
    }

    private _parseAccounts(accounts: any, filtered: any, categories: any) {
        return accounts.filter((list: any) => {
            if (categories.indexOf(list.category.transactionRef) !== -1 && filtered.indexOf(list.account_no) === -1) {
                list['accountNumber'] = list?.accountNumber || list?.account_no;
                list['description'] = list?.description || list?.category.description;
                list['balance'] = list?.available_bal || 0;
                return true;
            } else {
                return false;
            }
        });
    }

    fromAccChange(selectedAcc: any) {
        this.toAccountList = this.tempFromAccountList;
        this.toAccountList = this.toAccountList.filter((list) => {
            return selectedAcc.account_no !== list.account_no && selectedAcc.currency === list.currency;
        });

        this.sweepForm.get('currency')?.setValue(selectedAcc.currency);
        this.sweepForm.get('toAccount')?.reset();
    }

    lazyLoad(query: CIBTableQuery) {
        this.queryParams = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            sortKey: query.sortKey,
            sortDirection: query.sortDirection,
        };

        if (this.queryParams.sortKey && this.queryParams.sortDirection) {
            this.registeredAccountList = this.registeredAccountList.sort((a, b) => {
                if (this.queryParams.sortDirection === 'ASC') {
                    return a[this.queryParams.sortKey] - b[this.queryParams.sortKey];
                } else {
                    return b[this.queryParams.sortKey] - a[this.queryParams.sortKey];
                }
            });

            this.tableConfig = {
                columns: this.cols,
                data: this.registeredAccountList,
                selection: false,
                totalRecords: this.registeredAccountList.length,
                clientPagination: true,
            };
        }
    }

    addLocalTransfer() {
        if (this.addSweepData()) {
            this.sweepForm.reset();
        } else {
            this.lmSandbox.showErr('Duplicate sweep account cannot be present');
        }
    }

    addSweepData(): boolean {
        let added: boolean = false;
        const formValue = this.sweepForm.getRawValue();
        const fromAccount = formValue.fromAccount.account_no;
        const toAccount = formValue.toAccount.account_no;

        if (this.checkForTransferError(fromAccount, toAccount)) {
            let sweep: any = {};
            sweep.fromAccount = fromAccount;
            sweep.toAccount = toAccount;
            sweep.currency = formValue.fromAccount.currency;
            sweep.thresholdAmount = formValue.amount;
            this.sweepData.push(sweep);
            added = true;
        }
        return added;
    }

    checkForTransferError(fromAccount: any, toAccount: any) {
        let isNotDuplicate = true;
        this.sweepData.forEach((td) => {
            if (td.fromAccount === fromAccount || td.fromAccount === toAccount) {
                isNotDuplicate = false;
            }
        });
        return isNotDuplicate;
    }

    removeTransaction(indexPos: number) {
        this.sweepData.splice(indexPos, 1);
    }

    calTotal() {
        let totalAmount = 0;
        this.sweepData.forEach((td) => {
            totalAmount += parseFloat(td.thresholdAmount);
        });
        return totalAmount;
    }

    submitSweep() {
        if (this.sweepForm.valid) {
            if (this.addSweepData()) {
                this.sweepForm.reset();
            }
        }

        var data = {
            totalAmount: this.calTotal(),
            sweepData: this.sweepData,
            action: 'VERIFY',
            validateOTPRequest: {},
        };
        this.submitForm('VERIFY', data, 'CREATE');
    }

    updateSweep() {
        const formValue = this.sweepForm.getRawValue();
        const amount = formValue.amount;

        if (this.checkForUpdate(amount)) {
            const data = {
                sweepId: formValue.sweepId,
                fromAccount: formValue.fromAccount,
                toAccount: formValue.toAccount,
                thresholdAmount: formValue.amount,
                currency: formValue.currency,
                action: 'VERIFY',
                validateOTPRequest: {},
            };

            this.submitForm('VERIFY', data, 'UPDATE');
        }
    }

    deleteSweep(rowData: any) {
        let data = {
            header: '<div>Delete Sweep Account</div>',
            body: '<div>Would you like to delete this sweep account?</div>',
        };
        let dialogRef = this.dialogService.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                const payload = {
                    sweepId: rowData.sweepId,
                    fromAccount: rowData.fromAccount,
                    toAccount: rowData.toAccount,
                    thresholdAmount: rowData.amount,
                    currency: rowData.currency,
                    action: 'VERIFY',
                    validateOTPRequest: {},
                };
                this.submitForm('VERIFY', payload, 'DELETE');
            }
        });
    }

    submitForm(action: string, payload: any, operation: string) {
        this.lmSandbox.handleSweepActions(payload, operation, action)?.subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.getConsent(payload, operation);
            } else {
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/liquidity-management/sweep-balance']);
                });
            }
        });
    }

    getConsent(payload: any, operation: string) {
        let data: any = {};
        data = {
            headerName: 'SWEEP ACCOUNT SUMMARY',
            isOtpNeeded: true,
            fields: payload,
        };

        const ref = this.dialogService.openDrawer(data.headerName, LiquidityConfirmationComponent, data);
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                this.submitForm('CONFIRM', res?.data, operation);
            }
        });
    }

    onClickCell(event: any) {
        if (event.key === 'edit') {
            this.editForm = true;
            this.sweepForm.addControl('sweepId', new FormControl('', Validators.required));
            this.sweepForm.get('fromAccount')?.setValue(event.data.fromAccount);
            this.sweepForm.get('toAccount')?.setValue(event.data.toAccount);
            this.sweepForm.get('currency')?.setValue(event.data.currency);
            this.sweepForm.get('amount')?.setValue(event.data.amount);
            this.sweepForm.get('sweepId')?.setValue(event.data.sweepId);
            this.oldAmount = event.data.amount;
        } else if (event.key === 'delete') {
            this.deleteSweep(event.data);
        }
    }

    cancelEdit() {
        this.editForm = false;
        this.sweepForm.removeControl('sweepId');
        this.sweepForm.reset();
    }

    checkForUpdate(amount: number) {
        if ((amount !== null || amount !== '') && this.oldAmount != amount) {
            return true;
        } else {
            this.lmSandbox.showErr('Threshold amount is not modified');
            return false;
        }
    }
}
