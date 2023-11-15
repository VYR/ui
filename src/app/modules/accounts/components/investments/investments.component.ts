import { Component, OnInit } from '@angular/core';
import { AccountsSandbox } from '../../accounts.sandbox';

@Component({
    selector: 'app-investments',
    templateUrl: './investments.component.html',
    styleUrls: ['./investments.component.scss'],
})
export class InvestmentsComponent implements OnInit {
    investmentList: any = [];
    accountTypes: any = [
        'ALL',
        'FIXED DEPOSIT',
        'CERTIFICATE OF DEPOSIT',
        'ABSOLUTE MUDARABA DEPOSIT',
        'SUKUK',
        'HEMAYA',
    ];
    showsearch = false;
    selectedCurrency: string = 'all';
    currenciesList: any = [];
    filteractiveAccountIndex: number = 0;
    activeIndex: number = 0;
    transactionalAccountTypeAndCode: any = [];
    filteredAccountList: any = [];
    filteredAccountListByType: any = [];
    constructor(private sandBox: AccountsSandbox) {}

    ngOnInit(): void {
        this.getInvestmentList();
        this.getCategoryCodesAccounts();
    }

    public getInvestmentList() {
        this.sandBox.getAccountsList('CMB_DEPOSIT').subscribe((res: any) => {
            if (res.data.accounts) {
                this.investmentList = res.data.accounts;
                this.filteredAccountList = this.filteredAccountListByType = this.investmentList.filter((item: any) => {
                    if (this.currenciesList.indexOf(item.currency) === -1) {
                        this.currenciesList.push(item.currency);
                    }
                    return true;
                });
            }
        });
    }

    public showSearch() {
        this.showsearch = !this.showsearch;
    }

    public filterAccountByType(filterType: string) {
        this.selectedCurrency = 'all';
        this.currenciesList = [];
        if (filterType == 'ALL') {
            this.investmentList = this.filteredAccountList.filter((item: any) => {
                if (this.currenciesList.indexOf(item.currency) === -1) {
                    this.currenciesList.push(item.currency);
                }
                return true;
            });
        } else {
            this.investmentList = this.filteredAccountList.filter((item: any) => {
                if (this.transactionalAccountTypeAndCode[filterType].indexOf(item.category.transactionRef) != -1) {
                    if (this.currenciesList.indexOf(item.currency) === -1) {
                        this.currenciesList.push(item.currency);
                    }
                    return true;
                }
                return false;
            });
        }
    }

    public filterListByCurrency(filterType: any) {
        if (filterType.value === 'all') {
            this.investmentList = this.filteredAccountListByType;
        } else {
            this.investmentList = this.filteredAccountListByType.filter(
                (item: any) => item.currency.toLowerCase().indexOf(filterType.value.toLowerCase()) > -1
            );
        }
    }

    public getCategoryCodesAccounts() {
        this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
            if (res.data) {
                this.transactionalAccountTypeAndCode = res.CMB_DEPOSITS;
            }
        });
    }
}
