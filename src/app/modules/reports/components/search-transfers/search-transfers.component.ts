import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { ReportsSandbox } from '../../reports.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';

@Component({
    selector: 'app-search-transfers',
    templateUrl: './search-transfers.component.html',
    styleUrls: ['./search-transfers.component.scss'],
})
export class SearchTransfersComponent {
    constructor(private _formBuilder: FormBuilder, private sandBox: ReportsSandbox, private dialog: CibDialogService) {}

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'From Date';
    toDateLabel = 'To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'created' };
    tableConfig!: CIBTableConfig;
    transferList: any = [];

    types = ['1', '2'];
    currencyList: any = [];
    filterPipe = new CIBDefinition();
    query: CIBTableQuery = this.params;

    public cols = [
        {
            key: 'created',
            displayName: 'Created Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'ftRef',
            displayName: 'FT Reference',
            sortable: true,
        },
        {
            key: 'payeeType',
            displayName: 'Payee Type',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'requestId',
            displayName: 'Request ID',
            sortable: true,
        },
        {
            key: 'fromAccount',
            displayName: 'From Account',
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'To Account',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'Currency',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'Amount',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            sortable: true,
            type: ColumnType.status,
        },
    ];

    ngOnInit(): void {
        this.getCurrencyList();
        this.searchFormBuilder();
    }

    getCurrencyList() {
        this.sandBox.getCurrencyList().subscribe((res: any) => {
            let list: any = [];
            Object.keys(res).forEach((property: any) => {
                let temp: any = {};
                temp.id = property;
                temp.label = res[property].name;
                list.push(temp);
            });
            this.currencyList = list;
        });
    }

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            type: [null, Validators.required],
            benName: [null, ''],
            customerRef: [null, ''],
            currency: ['all', ''],
        }));
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    searchTransfers(params: any) {
        if (this.startDate && this.endDate) {
            let payLoad = {
                fromDate: this.startDate,
                toDate: this.endDate,
                type: this.searchForm.controls['type'].value || '',
                beneficiaryName: this.searchForm.controls['benName'].value || '',
                referenceNumber: this.searchForm.controls['customerRef'].value || '',
                currency:
                    this.searchForm.controls['currency']?.value === 'all'
                        ? ''
                        : this.searchForm.controls['currency'].value,
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                sortField: params.sortKey,
                sort: params.sortDirection,
            };

            this.sandBox.getTransferList(payLoad).subscribe((res: any) => {
                if (res.data) {
                    this.transferList = res.data.content || [];
                    this.transferList.forEach((resp: any) => {
                        if (resp.transferType === 2) {
                            resp.updated = resp.created;
                            resp.updatedBy = resp.createdBy;
                            resp.created = resp.request?.created || resp.created;
                            resp.createdBy = resp.request?.createdBy || resp.createdBy;
                        }
                        resp.requestId = resp.request?.cibRef;
                        if (resp.beneficiaryId) {
                            const toAccount = resp.beneficiaryId.accountNo || resp.beneficiaryId.iban;
                            resp.toAccount = toAccount
                                ? toAccount + '-' + resp.beneficiaryId.nickName
                                : resp.beneficiaryId.nickName;
                        }
                        resp.payeeType = this.filterPipe.transform(resp.payeeType, 'PAYEE');
                    });

                    let config = {
                        columns: this.cols,
                        data: this.transferList,
                        selection: false,
                        totalRecords: res.data.totalElements,
                    };

                    this.tableConfig = config;
                }
            });
        }
    }

    resetView() {
        this.transferList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchForm.reset();
        this.searchForm.controls['currency'].setValue('all');
    }

    generateExcel() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                type: this.searchForm.controls['type'].value || '',
                beneficiaryName: this.searchForm.controls['benName'].value || '',
                referenceNumber: this.searchForm.controls['customerRef'].value || '',
                currency:
                    this.searchForm.controls['currency']?.value === 'all'
                        ? ''
                        : this.searchForm.controls['currency'].value,
                sortField: this.params.sortKey,
                sort: this.params.sortDirection,
                pageIndex: 0,
                pageSize: 1000,
            };

            this.sandBox.getTransferList(params, 'excel').subscribe((res: any) => {});
        }
    }

    reloadTable(params: any) {
        this.transferList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchTransfers(params);
    }

    generatePdf() {
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                type: this.searchForm.controls['type'].value || '',
                beneficiaryName: this.searchForm.controls['benName'].value || '',
                referenceNumber: this.searchForm.controls['customerRef'].value || '',
                currency:
                    this.searchForm.controls['currency']?.value === 'all'
                        ? ''
                        : this.searchForm.controls['currency'].value,
                sortField: this.params.sortKey,
                sort: this.params.sortDirection,
                pageIndex: 0,
                pageSize: 1000,
                downloadType: 'pdf',
            };

            this.sandBox.getTransferList(params).subscribe((res: any) => {});
        }
    }

    onClickCell(event: any) {
        if (event.key === 'payeeType') {
            this.openSidePanel(event.data);
        }
    }

    openSidePanel(selectedRow: any) {
        let fieldInfo = [
            { fieldName: 'Transfer Type', fieldValue: this.filterPipe.transform(selectedRow.payeeType, 'PAYEE') },
            { fieldName: 'Request ID', fieldValue: selectedRow.requestId },
            { fieldName: 'From Account', fieldValue: selectedRow.fromAccount },
            { fieldName: 'To Account', fieldValue: selectedRow.toAccount },
            { fieldName: 'Amount', fieldValue: selectedRow.currency + ' ' + selectedRow.amount },
            { fieldName: 'FT Reference', fieldValue: selectedRow.ftRef },
            { fieldName: 'Source of Income', fieldValue: selectedRow.sourceOfIncome },
            { fieldName: 'Payment Description', fieldValue: selectedRow.description },
        ];
        if (selectedRow.purposeValue) {
            fieldInfo.push({ fieldName: 'Purpose of Payment', fieldValue: selectedRow.purposeValue });
        }
        if (selectedRow.request?.requestData?.charges) {
            fieldInfo.push({
                fieldName: 'Debit Amount',
                fieldValue:
                    (selectedRow.request.requestData.charges?.debitCurrency || 'QAR') +
                    ' ' +
                    selectedRow.request.requestData.charges?.debitAmount,
            });
            fieldInfo.push({
                fieldName: 'Exchange Rate',
                fieldValue: selectedRow.request.requestData.charges?.exchangeRate || 1,
            });
        }

        fieldInfo.push({
            fieldName: 'Created Date',
            fieldValue: moment(selectedRow.created).format('YYYY-MM-DD hh:mm A'),
        });
        fieldInfo.push({ fieldName: 'Created By', fieldValue: selectedRow.createdBy });
        if (selectedRow.updated)
            fieldInfo.push({
                fieldName: 'Updated Date',
                fieldValue: moment(selectedRow.updated).format('YYYY-MM-DD hh:mm A'),
            });
        fieldInfo.push({ fieldName: 'Updated By', fieldValue: selectedRow.updatedBy });

        let data = {
            fields: fieldInfo,
            fxTransaction: selectedRow.fxTransaction,
        };
        this.dialog.openDrawer('Transfer Details', DetailViewComponent, data);
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchTransfers(this.query);
    }
}
