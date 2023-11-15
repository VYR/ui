import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
    selector: 'app-bc-list',
    templateUrl: './bc-list.component.html',
    styleUrls: ['./bc-list.component.scss'],
})
export class BcListComponent {
    tableConfig!: CIBTableConfig;
    public filterForm!: FormGroup;
    public cols = [
        {
            key: 'lcRefNo',
            displayName: 'BC REFERENCE',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'txnRefNo',
            displayName: 'TF REFERENCE',
            sortable: true,
        },
        {
            key: 'lcBeneficiaryName',
            displayName: 'DRAWER NAME',
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
            key: 'lcTenor',
            displayName: 'TENOR',
            sortable: true,
        },
        {
            key: 'issueDate',
            displayName: 'ADVICED ON',
            sortable: true,
        },
    ];

    lcdocuments: any = [];

    constructor(private sandBox: TradeFinanceSandbox, private fb: FormBuilder, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            lcRefNo: [''],
            beneficiary: [''],
            lc_amount: [''],
        });
        this.getBcList();
    }

    diableFilterButton() {
        return Object.values(this.filterForm.value).every((x: any) => !x);
    }

    generateExcel() {
        this.sandBox.getBillOfCollection('excel').subscribe((response: any) => {});
    }

    public getBcList() {
        this.sandBox.getBillOfCollection().subscribe((response: any) => {
            if (response.data) {
                this.setBcList(response.data);
            }
        });
    }

    setBcList(response: any) {
        response.forEach((item: any) => {
            item.lcBeneficiaryName = item.lcAdvicingBankDetails?.lcBeneficiaryName;
            item.lcTenor = item.lcbasicDetails?.lcTenor;
            item.issueDate = item.issueDate;
        });
        this.lcdocuments = response;

        this.lazyLoad({ sortKey: 'issueDate', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.lcdocuments,
            selection: false,
            totalRecords: this.lcdocuments.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.lcdocuments = this.lcdocuments.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'lcRefNo') {
            let payload = {
                data: event.data,
                type: 'boc',
            };
            this.dialog.openOverlayPanel(event.data.lcRefNo, DetailViewComponent, payload);
        }
    }

    filterTable() {
        let payload = {
            lcRefNo: this.filterForm.controls['lcRefNo']?.value,
            beneficiary: this.filterForm.controls['beneficiary']?.value,
            lc_amount: this.filterForm.controls['lc_amount']?.value,
        };
        this.filterList(payload);
    }

    filterList(params: any) {
        this.sandBox.filterBillOfCollection(params).subscribe((res: any) => {
            if (res.data) {
                this.setBcList(res.data);
            }
        });
    }
}
