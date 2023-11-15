import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../general-services/general-services.sandbox';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    constructor(private sandBox: GeneralServicesSandbox) {}

    ngOnInit(): void {
        this.sandBox.getDataOnPageLoad().subscribe();
    }

    public menu: Array<any> = [
        {
            uuid: 'TRANSFER_HISTORY',
            name: 'Single/Multiple Transfer(s)',
            path: 'search-transfers',
        },
        {
            uuid: 'BULK_TRANSFER_HISTORY',
            name: 'Bulk Transfers',
            path: 'search-bulk-transfer',
        },
        {
            uuid: 'FETCH_STO',
            name: 'Future Dated Transfers',
            path: 'search-future-dated-transfers',
        },
        {
            uuid: 'SEARCH_POSITIVE_PAY',
            name: 'Positive Pay',
            path: 'search-positive-pay',
        },
        {
            uuid: 'DIVIDEND_PAY',
            name: 'Dividend Pay',
            path: 'search-dividend-pay',
        },
        {
            uuid: 'ACCOUNTS_HISTORY',
            name: 'CD and FD History',
            path: 'search-cd-fd',
        },
        {
            uuid: 'POSITIVE_PAY_DATA_HISTORY',
            name: 'Positive Pay History',
            path: 'search-positive-pay-history',
        },
        {
            uuid: 'AUTO_COVER_HISTORY',
            name: 'Auto Cover History',
            path: 'search-auto-history',
        },
        {
            uuid: 'AUTO_SWEEP_HISTORY',
            name: 'Sweep History',
            path: 'search-sweep-history',
        },
        {
            uuid: 'GENERATE_SWIFT_COPY',
            name: 'Swift Copies',
            path: 'swift-copies',
        },
        {
            uuid: 'SALARY_POSTING_LISTING',
            name: 'Salary Posting',
            path: 'search-salary-posting',
        },
    ];
}
