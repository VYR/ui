import { Component, OnInit } from '@angular/core';
import { TransferSandbox } from './transfers.sandbox';

@Component({
    selector: 'app-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.scss'],
})
export class TransfersComponent implements OnInit {
    public menu: Array<any> = [
        {
            uuid: 'TRANSFER_WITH_IN_ACCOUNT,TRANSFER_WITH_IN_QATAR,TRANSFER_INTERNATIONAL',
            name: 'Single/Multiple Transfers',
            path: 'single-multiple-transers',
        },
        {
            uuid: 'TRANSFER_BULK',
            name: 'Multiple Debit - Bulk Upload',
            path: 'multiple-debit-bulk',
        },
        {
            uuid: 'TRANSFER_VIEW_DRAFT',
            name: 'Drafts',
            path: 'drafts',
        },
        {
            uuid: 'BULK_TRANSFER_SALARY_POSTING',
            name: 'Salary Posting',
            path: 'salary-posting',
        },
    ];

    constructor(private sandbox: TransferSandbox) {}

    ngOnInit() {
        this.sandbox.fetchDataOnLoad().subscribe((res: any) => {});
    }
}
