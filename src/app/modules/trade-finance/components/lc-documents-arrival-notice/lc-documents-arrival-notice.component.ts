import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { LcViewComponent } from '../lc-view/lc-view.component';

@Component({
    selector: 'app-lc-documents-arrival-notice',
    templateUrl: './lc-documents-arrival-notice.component.html',
    styleUrls: ['./lc-documents-arrival-notice.component.scss'],
})
export class LcDocumentsArrivalNoticeComponent {
    tableConfig!: CIBTableConfig;
    public filterForm!: FormGroup;
    public cols = [
        {
            key: 'lc_number',
            displayName: 'LODGEMENT NUMBER',
            type: ColumnType.link,
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'ld_limit_reference',
            displayName: 'LC REFERENCE',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'lc_credit_type',
            displayName: 'LC Type',
            minWidth: 10,
            sortable: true,
        },

        {
            key: 'draw_currency',
            displayName: 'CURRENCY',
            sortable: true,
        },
        {
            key: 'document_amount',
            displayName: 'DOCUMENT AMOUNT',
            minWidth: 10,
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'val_date',
            displayName: 'RECEIVED DATE',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'discrepancy',
            displayName: 'REMARKS',
            sortable: true,
        },
    ];

    lcdocuments: any = [];

    constructor(private sandBox: TradeFinanceSandbox, private fb: FormBuilder, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            value_date: [''],
            amount: [''],
            presentor: [''],
            lcRefNo: [''],
        });
        this.getLcDocumentsArrivalNotice();
    }

    generateExcel() {
        this.sandBox.getLCDocumentArrivalNotice('excel').subscribe((response: any) => {});
    }

    generatePdf() {
        this.sandBox.getLCDocumentArrivalNotice('pdf').subscribe((response: any) => {});
    }

    diableFilterButton() {
        return Object.values(this.filterForm.value).every((x: any) => !x);
    }

    public getLcDocumentsArrivalNotice() {
        this.filterForm.reset();
        this.sandBox.getLCDocumentArrivalNotice().subscribe((response: any) => {
            if (response.data) {
                this.setLcDocument(response.data);
            }
        });
    }

    setLcDocument(response: any) {
        response.forEach((item: any) => {
            item.val_date = moment(item.value_date).format('DD-MM-YYYY');
        });
        this.lcdocuments = response;

        this.lazyLoad({ sortKey: 'val_date', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
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
            event.sortKey = event.sortKey === 'val_date' ? 'value_date' : event.sortKey;
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
        if (event.key === 'lc_number') {
            const header = 'Lodgement Number: ' + event.data.lc_number;
            const dialogRef = this.dialog.openOverlayPanel(header, LcViewComponent, event.data);
        }
    }

    filterTable() {
        let filterList = [];

        filterList = this.lcdocuments.filter((item: any) => {
            if (
                (!this.filterForm.controls['lcRefNo']?.value ||
                    item.ld_limit_reference
                        ?.toLowerCase()
                        .includes(this.filterForm.controls['lcRefNo']?.value.toLowerCase())) &&
                (!this.filterForm.controls['amount']?.value ||
                    item.document_amount?.toString().includes(this.filterForm.controls['amount']?.value)) &&
                (!this.filterForm.controls['value_date']?.value ||
                    moment(this.filterForm.controls['value_date']?.value).format('DD-MM-YYYY') ===
                        moment(item.value_date).format('DD-MM-YYYY')) &&
                (!this.filterForm.controls['presentor']?.value ||
                    item.presentor?.toLowerCase().includes(this.filterForm.controls['presentor']?.value.toLowerCase()))
            ) {
                return true;
            }

            return false;
        });

        this.setLcDocument(filterList);
    }
}
