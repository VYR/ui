import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, CIBTableQuery, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { UtilService } from 'src/app/utility/utility.service';
import { AccountsSandbox } from '../../accounts.sandbox';

@Component({
    selector: 'app-finance-statement',
    templateUrl: './finance-statement.component.html',
    styleUrls: ['./finance-statement.component.scss'],
})
export class FinanceStatementComponent implements OnInit {
    financeDetails: any = {};
    ldScheduleData: any = [];
    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'startDate',
            displayName: 'DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'repayment',
            displayName: 'REPAYMENT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'commission',
            displayName: 'COMMISSION',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'fee',
            displayName: 'FEE',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'charges',
            displayName: 'CHARGES',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'outStanding',
            displayName: 'OUTSTANDING',
            type: ColumnType.amount,
            sortable: true,
        },
    ];
    currency = 'QAR' + ' ';
    constructor(public sandBox: AccountsSandbox, private router: Router, private utilService: UtilService) {}

    ngOnInit(): void {
        this.getFinanceStatements();
    }

    lazyLoad(event: any) {
        if (event.sortKey) {
            this.ldScheduleData = this.ldScheduleData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.tableConfig = {
                columns: this.cols,
                data: this.ldScheduleData,
                selection: false,
                totalRecords: this.ldScheduleData.length,
                clientPagination: true,
            };
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    getFinanceStatements() {
        const queryParams = { account: this.sandBox.selectedAccount?.account_no };
        this.sandBox.getFinanceStatements(queryParams).subscribe((res: any) => {
            if (res.data) {
                this.financeDetails = res.data;
                this.ldScheduleData = res.data.ldSchedule || [];
                this.tableConfig = {
                    columns: this.cols,
                    data: this.ldScheduleData,
                    selection: false,
                    totalRecords: this.ldScheduleData,
                    clientPagination: true,
                };
            }
        });
    }

    goBack() {
        this.router.navigate(['home/accounts/finance/finance-list']);
    }

    public generateExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.ldScheduleData),
            'FINANCE_ACCOUNT_TRANSACTIONS'
        );
        this.utilService.displayNotification('Excel Generated successfully !', 'success');
    }

    formatDataForExcel(ldSchedule: any) {
        const temp: any = [];
        ldSchedule.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['Date'] = ele.startDate;
            tempObject['Repayment'] = ele.repayment;
            tempObject['Commission'] = ele.commission;
            tempObject['Fee'] = ele.fee;
            tempObject['Charges'] = ele.charges;
            tempObject['Outstanding'] = ele.outStanding ? ele.outStanding : 0;
            temp.push(tempObject);
        });
        return temp;
    }

    public generatePdf() {
        const queryParams = { account: this.sandBox.selectedAccount?.account_no, downloadtype: 'pdf' };
        this.sandBox.getFinanceStatements(queryParams).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'FINANCE_ACCOUNT_TRANSACTIONS');
                this.utilService.displayNotification('PDF Generated successfully !', 'success');
            }
        });
    }
}
