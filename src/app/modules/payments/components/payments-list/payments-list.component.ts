import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { PaymentsSandbox } from '../../payments.sandbox';

@Component({
    selector: 'app-payments-list',
    templateUrl: './payments-list.component.html',
    styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsListComponent implements OnInit {
    tableConfig!: CIBTableConfig;
    payments = [];
    paymentTypes: any = ['All', 'OOREDOO', 'KAHRAMAA', 'DHAREEBA'];
    selectedPaymentType = ['OOREDOO', 'KAHRAMAA', 'DHAREEBA'];
    public cols = [
        {
            key: 'created',
            displayName: 'DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'id',
            displayName: 'REF No.',
            sortable: true,
        },
        {
            key: 'description',
            displayName: 'DESCRIPTION',
            sortable: true,
        },
        {
            key: 'accountNumber',
            displayName: 'ACCOUNT No.',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            sortable: true,
            type: ColumnType.status,
        },
    ];
    sortedData: any;

    constructor(private sandBox: PaymentsSandbox, private router: Router) {}

    ngOnInit(): void {
        this.getPaymentsList();
        this.sandBox.getAccountsList().subscribe((res: any) => {});
    }

    public getPaymentsList() {
        this.sandBox.getPaymentsList(this.selectedPaymentType.toString()).subscribe((res: any) => {
            this.payments = res.data || [];
            this.payments.forEach((py: any) => {
                if (py.hasOwnProperty('ftRef')) {
                    py.id = py.ftRef;
                }
            });
            this.tableConfig = {
                columns: this.cols,
                data: this.payments,
                selection: false,
                totalRecords: this.payments.length,
                clientPagination: true,
            };
        });
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
            this.sortedData = this.payments.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public onTypeChange(type: any) {
        if (type === 'All') this.selectedPaymentType = ['OOREDOO', 'KAHRAMAA', 'DHAREEBA'];
        else this.selectedPaymentType = type;
        this.getPaymentsList();
    }

    onPaymentCardClick(type: string) {
        switch (type) {
            case 'ooredoo':
                this.router.navigate([APP_ROUTES.PAYMENTS_OOREDOO]);
                break;
            case 'kahramaa':
                this.router.navigate([APP_ROUTES.PAYMENTS_KAHRAMAA]);
                break;
            case 'dhareeba':
                this.router.navigate([APP_ROUTES.PAYMENTS_DHAREEBA]);
                break;
        }
    }
}
