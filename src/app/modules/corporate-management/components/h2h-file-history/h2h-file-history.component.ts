import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';
import { BulkDataTableComponent } from '../bulk-data-table/bulk-data-table.component';

@Component({
    selector: 'app-h2h-file-history',
    templateUrl: './h2h-file-history.component.html',
    styleUrls: ['./h2h-file-history.component.scss'],
})
export class H2hFileHistoryComponent implements OnInit {
    h2hDetails: any = [];
    tableConfig!: CIBTableConfig;
    fileDetails: any = [];

    constructor(
        private sandBox: CorporateManagementSandbox,
        private _formBuilder: FormBuilder,
        private dialog: CibDialogService
    ) {}

    searchForm: FormGroup = new FormGroup({});

    status = ['SUCCESS', 'FAILED'];

    ngOnInit(): void {
        this.searchFormBuilder();
    }
    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'created' };

    query: CIBTableQuery = this.params;

    public cols = [
        {
            key: 'created',
            displayName: 'Created Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'rimNumber',
            displayName: 'RIM Number',
        },
        {
            key: 'fileName',
            displayName: 'File Name',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
    ];

    public fileCols = [
        {
            key: 'debitAccNumber',
            displayName: 'Debit Account Number',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'beneficiaryAcc',
            displayName: 'Beneficiary Account/IBAN Number',
            minWidth: 13,
            sortable: true,
        },
        {
            key: 'beneficiaryName',
            displayName: 'Beneficiary Name ',
            minWidth: 10,
            sortable: true,
        },

        {
            key: 'paymentCurrency',
            displayName: '  Payment Currency',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'paymentAmount',
            displayName: 'Payment Amount',
            minWidth: 10,
            sortable: true,
        },
        {
            key: 'customerRef',
            displayName: 'Customer Reference',
            minWidth: 8,
            sortable: true,
        },
        {
            key: 'errorMessage',
            displayName: 'Error Message',
            minWidth: 10,
            sortable: true,
        },
    ];

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            rimNumber: [null, Validators.required],
            fileName: [null, ''],
            status: [null, ''],
        }));
    }

    searchFiles() {
        if (this.searchForm.controls['rimNumber'].value) {
            let payload = {
                rimNumber: this.searchForm.controls['rimNumber'].value,
                fileName: this.searchForm.controls['fileName'].value,
                status: this.searchForm.controls['status']?.value,
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize,
                sortField: this.query.sortKey,
                sort: this.query.sortDirection,
            };
            this.sandBox.getHostToHostDetails(payload).subscribe((res: any) => {
                if (res.data) {
                    this.h2hDetails = [];

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

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchFiles();
    }

    onClickCell(event: any) {
        if (event.key === 'fileName') {
            this.fileDetails = event.data;

            let data = {
                columns: this.fileCols,
                data: this.fileDetails,
            };
            this.dialog.openOverlayPanel('File Details', BulkDataTableComponent, data);
        }
    }
}
