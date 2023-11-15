import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import { CIBTableConfig, CIBTableQuery } from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { ChequeManagementSandbox } from '../cheque-management.sandbox';
import { DecimalPipe } from '@angular/common';
import { ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ChequeDetailsComponent } from '../cheque-details/cheque-details.component';
import * as moment from 'moment';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-pdc',
    templateUrl: './pdc.component.html',
    styleUrls: ['./pdc.component.scss'],
})
export class PdcComponent implements OnInit {
    ppForm: FormGroup = new FormGroup({});
    accountList: any[] = [];
    startDate = null;
    endDate = null;

    dateVal = new Date();
    minDate = new Date(this.dateVal.getFullYear(), this.dateVal.getMonth() - 6, this.dateVal.getDate());
    maxDate = new Date(this.dateVal.getFullYear() + 2, this.dateVal.getMonth(), this.dateVal.getDate());

    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'fromAccount',
            displayName: 'PAY Account',
            sortable: true,
        },
        {
            key: 'bankName',
            displayName: 'Pay Bank',
            sortable: true,
        },
        {
            key: 'checqueNumber',
            displayName: 'Cheque Number',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'chqAmount',
            displayName: 'Cheque Amount',
            sortable: true,
        },
        {
            key: 'toAccount',
            displayName: 'Credit Account',
            sortable: true,
        },
        {
            key: 'chqPostingDate',
            displayName: 'Cheque Date',
            sortable: true,
        },
        {
            key: 'chqReplyDate',
            displayName: 'Transaction Date',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
    ];

    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };

    lodgedStatus: number = 0;
    lodgedAmount: number = 0;
    returnedStatus: number = 0;
    returnedAmount: number = 0;
    clearedStatus: number = 0;
    clearedAmount: number = 0;
    statuses: { status: number; amount: string; label: string }[] = [];
    @ViewChild('creditSelect') creditSelect!: MatSelect;
    customizedData: any[] = [];
    pdcList: any[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private cmSandbox: ChequeManagementSandbox,
        private dialogService: CibDialogService,
        private util: UtilService,
        private decimalPipe: DecimalPipe
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.initPDCAccountList();

        this.ppForm.get('accountList')?.valueChanges.subscribe((val: any[]) => {
            if (val?.length > 0) {
                this.creditSelect.close();
            }
        });
    }

    initForm() {
        this.ppForm = this._formBuilder.group({
            accountList: [null, Validators.required],
            chequeNumber: [null],
            fromDate: [this.startDate],
            toDate: [this.endDate],
        });
    }

    initPDCAccountList() {
        const service = this.cmSandbox.getAccountCategoryList().pipe(
            mergeMap((cat: any) => {
                const pdcCategory = cat.data.pdc;
                return this.cmSandbox.getPDCAccounts().pipe(
                    mergeMap((acc: any) => {
                        const selectAcc: any[] = [];
                        this.accountList = acc.data.accounts.filter((list: any) => {
                            if (pdcCategory.indexOf(list.category.transactionRef) !== -1) {
                                selectAcc.push(list.account_no);
                                return true;
                            } else {
                                return false;
                            }
                        });

                        return this.cmSandbox.getPDC({ accountList: selectAcc });
                    })
                );
            })
        );

        service.subscribe((res: any) => {
            this._parseAccount(this.accountList);
            this.pdcList = res.data;
            this.filterByStatus(this.pdcList);

            this.pdcList.forEach((value) => {
                this.formatData(value);
            });

            this.tableConfig = {
                columns: this.cols,
                data: this.pdcList,
                selection: false,
                totalRecords: this.pdcList.length,
                clientPagination: true,
            };
        });
    }

    private _parseAccount(accountList: any[]) {
        accountList.map((acc) => {
            acc['accountNumber'] = acc?.accountNumber || acc?.account_no;
            acc['description'] = acc?.description || acc?.category?.description;
            acc['balance'] = acc?.available_bal || 0;
            return acc;
        });
    }

    filterByStatus(list: any[]) {
        this.lodgedStatus = 0;
        this.lodgedAmount = 0;
        this.returnedStatus = 0;
        this.returnedAmount = 0;
        this.clearedStatus = 0;
        this.clearedAmount = 0;

        list.forEach((l) => {
            switch (l.status) {
                case 'LODGED':
                    this.lodgedStatus++;
                    this.lodgedAmount += l.chqAmount;
                    break;
                case 'RETURNED':
                    this.returnedStatus++;
                    this.returnedAmount += l.chqAmount;
                    break;
                case 'CLEARED':
                    this.clearedStatus++;
                    this.clearedAmount += l.chqAmount;
                    break;
            }
        });

        this.statuses = [
            {
                status: this.lodgedStatus,
                amount: this.decimalPipe.transform(this.lodgedAmount, '1.2-4') || '0.00',
                label: 'Number of Cheques Not Presented',
            },
            {
                status: this.returnedStatus,
                amount: this.decimalPipe.transform(this.returnedAmount, '1.2-4') || '0.00',
                label: 'Number of Cheques Cleared',
            },
            {
                status: this.clearedStatus,
                amount: this.decimalPipe.transform(this.clearedAmount, '1.2-4') || '0.00',
                label: 'Number of Cheques Returned',
            },
        ];
    }

    getFromDate(ev: any) {
        this.startDate = ev;
    }

    getToDate(ev: any) {
        this.endDate = ev;
    }

    submitTransfer() {
        const data = this.makePayload();
        this.cmSandbox.getPDC(data).subscribe((res: any) => {
            this.pdcList = res.data;
            this.pdcList.forEach((value) => {
                this.formatData(value);
            });

            this.tableConfig = {
                columns: this.cols,
                data: this.pdcList,
                selection: false,
                totalRecords: this.pdcList.length,
                clientPagination: true,
            };
        });
    }

    makePayload() {
        let accounts: any[] = this.ppForm.get('accountList')?.value;
        if (accounts?.length > 0) {
            accounts = accounts.map((acc) => acc.accountNumber);
        } else {
            accounts = this.pdcList.map((p) => p.toAccount);
        }

        const data: any = {
            accountList: accounts,
        };

        const chequeNumber = this.ppForm.get('chequeNumber')?.value;
        if (chequeNumber) {
            data['chequeNumber'] = chequeNumber;
        }

        if (this.startDate) {
            data['fromDate'] = this.startDate;
        }

        if (this.endDate) {
            data['toDate'] = this.endDate;
        }

        return data;
    }

    formatData(value: any) {
        value['bankName'] = value.fromBank.bankName;
        value['chqAmount'] = value.currency + ' ' + this.decimalPipe.transform(value.chqAmount, '1.2-4');
        value['chqPostingDate'] = value.chqPostingDate ? moment(value.chqPostingDate).format('DD-MM-YYYY') : '';
        value['chqReplyDate'] = value.chqReplyDate ? moment(value.chqReplyDate).format('DD-MM-YYYY') : '';
        value['status'] = value.status === 'LODGED' ? 'Not Presented' : value.status;
    }

    showDetails(payload: any) {
        let data: any = {};
        data = {
            headerName: 'CHEQUE DETAILS',
            isOtpNeeded: false,
            fields: payload,
        };

        const ref = this.dialogService.openDrawer(data.headerName, ChequeDetailsComponent, data);
        ref.afterClosed().subscribe((res: any) => {});
    }

    onClickCell(event: any) {
        if (event.key === 'checqueNumber') {
            this.showDetails(event.data);
        }
    }

    formatDataForExcel(excelList: any) {
        this.customizedData = [];
        excelList.forEach((value: any) => {
            const tempObject: any = {};
            tempObject['Pay Account'] = '' + value.fromAccount;
            tempObject['Pay Bank'] = value.fromBank.bankName;
            tempObject['Cheque Number'] = value.checqueNumber;
            tempObject['Cheque Date'] = value.chqPostingDate ? moment(value.chqPostingDate).format('YYYY-MM-DD') : '';
            tempObject['Transaction Date'] = value.chqReplyDate ? moment(value.chqReplyDate).format('YYYY-MM-DD') : '';
            tempObject['Amount'] = value.currency + ' ' + value.chqAmount;
            tempObject['Credit Account'] = '' + value.toAccount;
            tempObject['Status'] = value.status === 'LODGED' ? 'Not Presented' : value.status;
            tempObject['Reason'] = value.status === 'RETURNED' && value.statusCode ? value.statusCode.deescription : '';
            this.customizedData.push(tempObject);
        });
        return this.customizedData;
    }

    generateExcel() {
        this.util.exportAsExcelFile(this.formatDataForExcel(this.pdcList || []), 'PDC_EXTRACT');
        this.util.displayNotification('Excel generated successfully!', 'success');
    }

    generatePdf() {
        const data: any = this.makePayload();
        data['downloadType'] = 'pdf';

        this.cmSandbox.getPDC(data).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.util.downloadPdf(res.data, 'PDC_EXTRACT');
                this.util.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    lazyLoad(query: CIBTableQuery) {
        this.queryParams = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            sortKey: query.sortKey,
            sortDirection: query.sortDirection,
        };

        if (this.queryParams.sortKey && this.queryParams.sortDirection) {
            this.pdcList = this.pdcList.sort((a, b) => {
                return this.sortEl(a, b, this.queryParams.sortDirection);
            });

            this.tableConfig = {
                ...this.tableConfig,
                data: this.pdcList,
                totalRecords: this.pdcList.length,
            };
        }
    }

    sortEl(a: any, b: any, order: string): number {
        if (order === 'ASC') {
            return a[this.queryParams.sortKey].toString().localeCompare(b[this.queryParams.sortKey].toString());
        } else {
            return b[this.queryParams.sortKey].toString().localeCompare(a[this.queryParams.sortKey].toString());
        }
    }
}
