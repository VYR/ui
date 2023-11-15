import { IfStmt, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';
import { LcViewComponent } from '../lc-view/lc-view.component';

@Component({
    selector: 'app-export-lc',
    templateUrl: './export-lc.component.html',
    styleUrls: ['./export-lc.component.scss'],
})
export class ExportLcComponent {
    tableConfig!: CIBTableConfig;
    public filterForm!: FormGroup;
    public cols = [
        {
            key: 'lcRefNo',
            displayName: 'QIB REFERENCE',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'issBankRef',
            displayName: 'LC REFERENCE',
            sortable: true,
        },
        {
            key: 'applicant',
            displayName: 'APPLICANT NAME',
            sortable: true,
        },
        {
            key: 'issuingBank',
            displayName: 'ISSUING BANK NAME ',
            sortable: true,
        },
        {
            key: 'lcCurrency',
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
            key: 'issueDate',
            displayName: 'ISSUED DATE',
            sortable: true,
            type: ColumnType.date,
        },
        {
            key: 'lcExpiryDate',
            displayName: 'EXPIRY DATE',
            sortable: true,
        },
    ];

    lcdocuments: any = [];

    constructor(private sandBox: TradeFinanceSandbox, private fb: FormBuilder, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            bankRef: [''],
            lcAmount: [''],
            lcRefNo: [''],
            name: [''],
            issueBank: [''],
        });
        this.getLcExport();
    }

    diableFilterButton() {
        return Object.values(this.filterForm.value).every((x: any) => !x);
    }

    generateExcel() {
        this.sandBox.exportLC('excel').subscribe((response: any) => {});
    }

    public getLcExport() {
        this.filterForm.reset();
        this.sandBox.exportLC().subscribe((response: any) => {
            if (response.data) {
                this.setLcExport(response.data);
            }
        });
    }

    setLcExport(response: any) {
        response.forEach((item: any) => {
            item.applicant = item.lcAdvicingBankDetails.applicant;
            item.issBankRef = item.lcAdvicingBankDetails?.issBankRef;
            item.issuingBank = item.lcAdvicingBankDetails?.issuingBank;
            item.lcExpiryDate = item.lcbasicDetails?.lcExpiryDate;
            item.lcCurrency = item.lcbasicDetails?.lcCurrency;
        });
        this.lcdocuments = response;
        let config = {
            columns: this.cols,
            data: response,
            selection: false,
            totalRecords: response.length,
            clientPagination: true,
        };

        this.tableConfig = config;
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
            };
            this.dialog.openOverlayPanel(event.data.lcRefNo, DetailViewComponent, payload);
        }
    }

    filterTable() {
        let filterList = [];
        filterList = this.lcdocuments.filter((item: any) => {
            if (
                (!this.filterForm.controls['lcRefNo']?.value ||
                    item.lcRefNo?.toLowerCase().includes(this.filterForm.controls['lcRefNo']?.value.toLowerCase())) &&
                (!this.filterForm.controls['bankRef']?.value ||
                    item.lcAdvicingBankDetails?.issBankRef?.includes(this.filterForm.controls['bankRef']?.value)) &&
                (!this.filterForm.controls['lcAmount']?.value ||
                    item.amount?.toString().includes(this.filterForm.controls['lcAmount']?.value.toString())) &&
                (!this.filterForm.controls['name']?.value ||
                    item.lcAdvicingBankDetails?.applicant
                        ?.toLowerCase()
                        .includes(this.filterForm.controls['name']?.value.toLowerCase())) &&
                (!this.filterForm.controls['issueBank']?.value ||
                    item.lcAdvicingBankDetails?.issuingBank
                        ?.toLowerCase()
                        .includes(this.filterForm.controls['issueBank']?.value.toLowerCase()))
            ) {
                return true;
            }

            return false;
        });

        this.setLcExport(filterList);
    }
}
