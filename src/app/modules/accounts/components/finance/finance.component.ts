import { Component, OnInit } from '@angular/core';
import { AccountsSandbox } from '../../accounts.sandbox';
import * as moment from 'moment';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
    financeList: any = [];
    accountTypes: any = ['ALL', 'MUSAWAMA', 'IJARA', 'ISTISNA', 'MURABAHA', 'MUDARABAH', 'WAKALA'];
    filteractiveAccountIndex: number = 0;
    activeIndex: number = 0;
    transactionalAccountTypeAndCode: any = [];
    filteredAccountList: any = [];
    constructor(public sandBox: AccountsSandbox) {}

    ngOnInit(): void {
        this.getFinanceList();
        this.getCategoryCodesAccounts();
    }

    public getFinanceList() {
        this.sandBox.getAccountsList('CMB_FINANCE').subscribe((res: any) => {
            if (res.data.accounts) {
                this.financeList = this.customizeFinanceResponse(res.data.accounts);
                this.filteredAccountList = this.financeList;
            }
        });
    }

    public getCategoryCodesAccounts() {
        this.sandBox.getCategoryCodesAccounts().subscribe((res: any) => {
            if (res.data) {
                this.transactionalAccountTypeAndCode = res.CMB_FINANCE;
            }
        });
    }

    public filterAccountByType(filterType: any) {
        if (filterType == 'ALL') this.financeList = this.filteredAccountList;
        else {
            this.financeList = this.filteredAccountList.filter((item: any) => {
                return this.transactionalAccountTypeAndCode[filterType].indexOf(item.category.transactionRef) != -1;
            });
        }
    }

    public customizeFinanceResponse(accountsResponse: any) {
        accountsResponse.forEach((account: any) => {
            if (account.amount_pd === undefined || account.amount_pd === null) {
                account.amount_pd = 0.0;
            }
            if (account.current_balance === undefined || account.current_balance === null) {
                account.current_balance = 0.0;
            }
            if (account.instl_remain === undefined || account.instl_remain === null) {
                account.instl_remain = 0.0;
            }
            if (account.instl_paid === undefined || account.instl_paid === null) {
                account.instl_paid = 0.0;
            }
            if (account.charity_amt === undefined || account.charity_amt === null) {
                account.charity_amt = 0.0;
            }
            account.total_installments = Number(account.instl_paid) + Number(account.instl_remain);
            if (account.pd_date !== undefined && account.pd_date != null) {
                account.pastdue_ageing = this.differenceBetweenDates(account.pd_date) + ' days';
            } else {
                account.pastdue_ageing = 0 + ' days';
            }
            account.total_pd_required = Number(account.amount_pd) + Number(account.charity_amt);
            account.create_date = moment(account.create_date, 'YYYYMMDD').format('DD-MMM-YYYY');
            if (account.last_pymt_dt != null && account.last_pymt_dt != '')
                account.last_pymt_dt = moment(account.last_pymt_dt, 'YYYYMMDD').format('DD-MMM-YYYY');
            if (account.mat_date != null && account.mat_date != '')
                account.mat_date = moment(account.mat_date, 'YYYYMMDD').format('DD-MMM-YYYY');
            if (account.next_pymt_date != null && account.next_pymt_date != '')
                account.next_pymt_date = moment(account.next_pymt_date, 'YYYYMMDD').format('DD-MMM-YYYY');
        });
        return accountsResponse;
    }

    differenceBetweenDates(startDate: any) {
        let given = moment(startDate, 'YYYY-MM-DD');
        let current = moment().startOf('day');
        return moment.duration(current.diff(given)).asDays();
    }
}
