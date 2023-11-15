import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { AccountsSandbox } from '../../accounts.sandbox';
import { UtilService } from 'src/app/utility/utility.service';

@Component({
    selector: 'app-revolving-limits',
    templateUrl: './revolving-limits.component.html',
    styleUrls: ['./revolving-limits.component.scss'],
})
export class RevolvingLimitsComponent implements OnInit {
    revolvingLimitsList: any = [];
    tableConfig!: CIBTableConfig;

    public cols = [
        {
            key: 'limitName',
            displayName: 'Type',
        },
        {
            key: 'limit_amount',
            displayName: 'Limit Amount',
            type: ColumnType.amount,
        },
        {
            key: 'available_amount',
            displayName: 'Available Amount',
            type: ColumnType.amount,
        },
        {
            key: 'total_outstanding',
            displayName: 'Outstanding Amount',
            type: ColumnType.amount,
        },
        {
            key: 'limit_reference',
            displayName: 'Limit Reference',
            type: ColumnType.amount,
        },
        {
            key: 'expiry_date',
            displayName: 'Expiry date',
        },
    ];

    constructor(private sandBox: AccountsSandbox, private utilService: UtilService) {}

    ngOnInit(): void {
        this.getRevolvingLimitsList();
    }

    public generateExcel() {
        this.utilService.exportAsExcelFile(this.revolvingLimitsList || [], 'REVOLING_LIMITS_EXTRACT');
        this.utilService.displayNotification('Excel generated successfully!', 'success');
    }

    public generatePdf() {
        this.sandBox.getRevolvingLimitsList('G', 'ACTIVE', 'pdf').subscribe((res: any) => {
            if (res.data?.length > 0) {
                this.utilService.downloadPdf(res.data, 'REVOLING_LIMITS_EXTRACT');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    public getRevolvingLimitsList() {
        this.sandBox.getRevolvingLimitsList('G', 'ACTIVE').subscribe((res: any) => {
            if (res.data) {
                this.revolvingLimitsList = res.data.filter((value: any) => {
                    if (value.limitName === 'R' && moment(value.expiry_date).diff(new Date(), 'days') > -1) {
                        value.expiry_date = moment(value.expiry_date).format('DD/MM/YYYY');
                        return true;
                    }
                    return false;
                });
            }

            this.tableConfig = {
                columns: this.cols,
                data: this.revolvingLimitsList,
                selection: false,
                totalRecords: this.revolvingLimitsList.length,
                clientPagination: true,
            };
        });
    }
}
