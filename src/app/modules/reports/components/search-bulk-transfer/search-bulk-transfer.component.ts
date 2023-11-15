import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { ReportsSandbox } from '../../reports.sandbox';
import { BulkDataTableComponent } from '../bulk-data-table/bulk-data-table.component';

@Component({
    selector: 'app-search-bulk-transfer',
    templateUrl: './search-bulk-transfer.component.html',
    styleUrls: ['./search-bulk-transfer.component.scss'],
})
export class SearchBulkTransferComponent implements OnInit {
    bulkTransferList: any = [];
    tableConfig!: CIBTableConfig;
    bulkTransferDetails: any = [];
    constructor(
        private utilService: UtilService,
        private _formBuilder: FormBuilder,
        private sandBox: ReportsSandbox,
        private dialog: CibDialogService
    ) {}

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'From Date';
    toDateLabel = 'To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'created' };

    public bulkCols = [
        {
            key: 'paymentDate',
            displayName: 'PAYMENT DATE',
            minWidth: 10,
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'transRef',
            displayName: 'TRANS REF',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            sortable: true,
            minWidth: 8,
            type: ColumnType.status,
        },
        {
            key: 'debitAccountNo',
            displayName: 'DEBIT ACCCOUNT NO',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryAccountOrIban',
            displayName: 'BENEF ACCOUNT',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryName',
            displayName: 'BENEF NAME',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryAddress1',
            displayName: 'BENEF ADDRESS1',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryAddress2',
            displayName: 'BENEF ADDRESS2',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryCountry',
            displayName: 'BENEF COUNTRY',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'beneficiaryBankName',
            displayName: 'BENEF BANK NAME',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryBankCountry',
            displayName: 'BENEF BANK COUNTRY',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'beneficiaryBankLocation',
            displayName: 'BENEF BANK LOCATION',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryBankAddress',
            displayName: 'BENEF BANK ADDRESS1',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'swiftCode',
            displayName: 'BENEF BANK CODE',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'execDateTime',
            displayName: 'EXEC DATE TIME',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'paymentCurrency',
            displayName: 'PAYMENT CURRENCY',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'paymentAmount',
            displayName: 'PAYMENT AMOUNT',
            type: ColumnType.amount,
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'chargeType',
            displayName: 'CHARGE TYPE',
            minWidth: 5,
            sortable: true,
        },
        {
            key: 'purposeOfPayment',
            displayName: 'PURPOSE OF PAYMENT',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'customerRef',
            displayName: 'CUSTOMER REF',
            minWidth: 10,
            sortable: true,
        },

        {
            key: 'sourceOfIncome',
            displayName: 'SOURCE OF INCOME',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'relationShipWithBeneficiary',
            displayName: 'RELATIONSHIP WITH BENEF',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'fileName',
            displayName: 'File Name',
            minWidth: 10,
        },
    ];

    public cols = [
        {
            key: 'created',
            displayName: 'CREATED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'createdBy',
            displayName: 'CREATED BY',
            sortable: true,
        },
        {
            key: 'id',
            displayName: 'BULK ID',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'userFileName',
            displayName: 'FILE NAME',
            sortable: true,
        },
        {
            key: 'description',
            displayName: 'DESCRIPTION',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            sortable: true,
        },
    ];

    ngOnInit() {
        this.searchFormBuilder();
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    query: CIBTableQuery = this.params;

    onClickCell(event: any) {
        if (event.key === 'id') {
            this.sandBox.getBulkTransferDetails(event.data.id).subscribe((res: any) => {
                if (res.data) {
                    this.bulkTransferDetails = res.data;

                    this.bulkTransferDetails.forEach((value: any) => {
                        value.fileName = event.data.userFileName;
                    });

                    let data = {
                        columns: this.bulkCols,
                        data: this.bulkTransferDetails,
                    };
                    this.dialog.openOverlayPanel('Bulk Transfer Details', BulkDataTableComponent, data);
                }
            });
        }
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchBulkTransfer(this.query);
    }

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            fileName: [null, ''],
            fileDescription: [null, ''],
        }));
    }

    resetView() {
        this.bulkTransferList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchForm.reset();
    }

    searchBulkTransfer(params: any) {
        if (this.startDate && this.endDate) {
            let payload = {
                fromDate: this.startDate,
                toDate: this.endDate,
                fileName: this.searchForm.controls['fileName'].value || '',
                description: this.searchForm.controls['fileDescription'].value || '',
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                sortField: params.sortKey,
                sort: params.sortDirection,
            };

            this.sandBox.getBulkTransferList(payload).subscribe((res: any) => {
                if (res.data) {
                    this.bulkTransferList = res.data.content;
                    let config = {
                        columns: this.cols,
                        data: res.data.content,
                        selection: false,
                        totalRecords: res.data.totalElements,
                    };

                    this.tableConfig = config;
                }
            });
        }
    }

    reloadDatatable(params: any) {
        this.bulkTransferList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchBulkTransfer(params);
    }

    generateExcel() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                fileName: this.searchForm.controls['fileName'].value || '',
                description: this.searchForm.controls['fileDescription'].value || '',
                pageIndex: 0,
                pageSize: 1000,
                sortField: this.params.sortKey,
                sort: this.params.sortDirection,
            };

            this.sandBox.getBulkTransferList(params).subscribe((res: any) => {
                if (res.data) {
                    this.utilService.exportAsExcelFile(
                        this.formatDataForExcel(res.data.content || []),
                        'Bulk_Transfer'
                    );
                    this.utilService.displayNotification('Excel generated successfully!', 'success');
                }
            });
        }
    }

    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['CREATED DATE'] = ele.created;
            tempObject['CREATED BY'] = ele.createdBy;
            tempObject['BULK ID'] = ele.id;
            tempObject['FILE NAME'] = ele.userFileName;
            tempObject['DESCRIPTION'] = ele.description;
            tempObject['STATUS'] = ele.status;

            temp.push(tempObject);
        });
        return temp;
    }

    generatePdf() {
        let params = {
            fromDate: this.startDate,
            toDate: this.endDate,
            fileName: this.searchForm.controls['fileName'].value || '',
            description: this.searchForm.controls['fileDescription'].value || '',
            pageIndex: 0,
            pageSize: 1000,
            sortField: this.params.sortKey,
            sort: this.params.sortDirection,
            downloadType: 'pdf',
        };

        this.sandBox.getBulkTransferList(params).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'Bulk_Transfer');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }
}
