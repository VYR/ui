import { Component, OnInit } from '@angular/core';
import { AccountsSandbox } from '../../accounts.sandbox';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
    accountList: any = [];
    filteredAccountList: any = [];
    filteredAccountListByType: any = [];
    activeIndex: number = 0;
    showsearch = false;
    selectedCurrency: string = 'all';
    filteractiveAccountIndex: number = 0;
    transactionalAccountTypeAndCode: any = [];
    accountTypes: any = [
        'ALL',
        'SAVING',
        'CURRENT',
        'VOSTRO',
        'CALL',
        'SHADOW',
        'MARGIN',
        'CORPORATE',
        'MUDARABA DRAWDOWN',
    ];
    currenciesList: any = [];
    accNo: any = '';
    constructor(public sandBox: AccountsSandbox, private router: Router) {
        const state: any = this.router.getCurrentNavigation()?.extras.state;
        this.accNo = state?.accNo || '';
    }

    ngOnInit(): void {
        this.getCategoryCodesAccounts();
        this.getAccountsList();
    }

    public showSearch() {
        this.showsearch = !this.showsearch;
    }

    public getAccountsList() {
        this.sandBox.getAccountsList('CMB_ACCOUNT').subscribe((res: any) => {
            if (res.data.accounts) {
                this.accountList = res.data.accounts;
                this.filteredAccountList = this.filteredAccountListByType = this.accountList.filter((item: any) => {
                    if (this.currenciesList.indexOf(item.currency) === -1) {
                        this.currenciesList.push(item.currency);
                    }
                    return true;
                });
                this.sandBox.selectedAccount = res.data.accounts[0];
                const index = this.accountList.findIndex((x: any) => x.account_no === this.accNo);
                this.activeIndex = index === -1 ? 0 : index;
                this.sandBox.selectedAccount = this.accountList[this.activeIndex];
            }
        });
    }

    public getCategoryCodesAccounts() {
        this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
            if (res.data) {
                this.transactionalAccountTypeAndCode = res.CMB_ACCOUNTS;
                this.sandBox.transactionAndPaymentAccountsCodes = res.data.transactionAccounts || [];
            }
        });
    }

    public filterAccountByType(filterType: string) {
        this.selectedCurrency = 'all';
        this.currenciesList = [];
        if (filterType == 'ALL') {
            this.accountList = this.filteredAccountList.filter((item: any) => {
                if (this.currenciesList.indexOf(item.currency) === -1) {
                    this.currenciesList.push(item.currency);
                }
                return true;
            });
        } else {
            this.accountList = this.filteredAccountList.filter((item: any) => {
                if (this.transactionalAccountTypeAndCode[filterType].indexOf(item.category.transactionRef) != -1) {
                    if (this.currenciesList.indexOf(item.currency) === -1) {
                        this.currenciesList.push(item.currency);
                    }
                    return true;
                }
                return false;
            });
        }
        this.filteredAccountListByType = this.accountList;
    }

    public filterListByCurrency(filterType: any) {
        if (filterType.value === 'all') {
            this.accountList = this.filteredAccountListByType;
        } else {
            this.accountList = this.filteredAccountListByType.filter(
                (item: any) => item.currency.toLowerCase().indexOf(filterType.value.toLowerCase()) > -1
            );
        }
    }
}
