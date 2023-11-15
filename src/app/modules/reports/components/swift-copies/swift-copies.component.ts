import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../../general-services/general-services.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralServicePopupComponent } from '../../../general-services/components/general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { SWIFT_COPY_TYPES } from '../../../general-services/constants/constants';
import * as moment from 'moment';
import { SERVICE_REQUEST_TYPES } from '../../../general-services/constants/constants';
import { LcPreviewComponent } from 'src/app/modules/trade-finance/components/lc-preview/lc-preview.component';
import { ReportsSandbox } from '../../reports.sandbox';
@Component({
    selector: 'app-swift-copies',
    templateUrl: './swift-copies.component.html',
    styleUrls: ['./swift-copies.component.scss'],
})
export class SwiftCopiesComponent implements OnInit {
    currenciesList: any = [];
    accounts: any = [];
    selectedCurrency: any = '';
    selectedType: any = 'TRANSFER';
    transferDateFormat = 'YYYY-MM-DD';
    BGLCDateFormat = 'YYYYMMDD';
    swiftCopiesRequestForm!: UntypedFormGroup;
    SWIFT_COPY_TYPES = SWIFT_COPY_TYPES;
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    selectedRows: Array<any> = [];
    statusData: any = { statusTitle: '', requestType: 'swiftCopiesRequest' }; // Notification Data
    cols = [
        {
            key: 'requestDate',
            displayName: 'Date',
            sortable: true,
        },
        {
            key: 'ftRef',
            displayName: 'Reference Number',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'type',
            displayName: 'Type',
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
            key: 'action',
            displayName: 'VIEW',
            type: ColumnType.icon,
            icon: 'la-file-pdf',
            callBackFn: this.previewSwift,
        },
    ];
    tableConfig!: CIBTableConfig;
    isRequestSuccess: boolean = false;
    sortedData = []; //Specific to table for sorting
    module: any;
    constructor(
        private sandBox: GeneralServicesSandbox,
        private reportsSandBox: ReportsSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService
    ) {}

    ngOnInit(): void {
        this.getCurrencyList();
        this.sandBox
            .getAccountListFiltered([], ['Current Account', 'Call Account', 'Savings Account'])
            .subscribe((accounts: Array<any>) => {
                this.accounts = accounts || [];
            });
        this.swiftCopiesRequestForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
            amount: [null],
            requestDate: [null],
            currency: [null],
            beneficiaryName: [null],
            typeOfSwift: ['TRANSFER', [Validators.required]],
        });
        this.module = SERVICE_REQUEST_TYPES[4];
    }

    getCurrencyList() {
        this.reportsSandBox.getCurrencyList().subscribe((res: any) => {
            if (res) {
                this.currenciesList = Object.keys(res).map((index: any) => {
                    return res[index];
                });
            }
        });
    }

    onAccountChange(event: any) {
        this.selectedCurrency = event.currency;
    }

    updateCurrency(event: any, currency: any) {
        if (event.isUserInput) {
            this.selectedCurrency = currency;
        }
    }

    onTypeChange(event: any) {
        this.selectedType = event.value;
        this.swiftCopiesRequestForm.reset();
        this.swiftCopiesRequestForm.controls['typeOfSwift'].setValue(this.selectedType);
        this.selectedCurrency = '';
        this.sortedData = [];
        this.loadDataTable();
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.sortedData = this.sortedData.sort((a: any, b: any) => {
                if (event.sortKey === 'requestDate') {
                    (a[event.sortKey] = a[event.sortKey]?.split('-').reverse().join()),
                        (b[event.sortKey] = b[event.sortKey]?.split('-').reverse().join());
                }
                const isAsc = event.sortDirection === 'ASC';
                return this.sandBox.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
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

    checkForValidity() {
        if (this.selectedType === 'TRANSFER') return this.swiftCopiesRequestForm.controls['fromAccount'].invalid;
        else if (this.swiftCopiesRequestForm.controls['requestDate'].value) return false;
        else if (this.swiftCopiesRequestForm.controls['currency'].value) return false;
        else if (this.swiftCopiesRequestForm.controls['amount'].value) return false;
        else if (this.swiftCopiesRequestForm.controls['beneficiaryName'].value) return false;
        return true;
    }

    onClickCell(event: any) {
        const swiftData = event.data;
        if (event.key === 'ftRef') {
            const payLoad = {
                hideConfirm: true,
                details: {
                    data: {
                        swiftType: swiftData.type,
                        debitAccountNo: swiftData.fromAccount,
                        amount: swiftData.amount,
                        currency: swiftData.currency,
                        txnReference: swiftData.ftRef,
                        description: swiftData.description,
                        transferDate: swiftData.requestDate,
                        beneficiaryName: swiftData.beneficiaryName,
                    },
                },
            };
            const ref = this.dialog.openDrawer('Swift Copies Summary', GeneralServicePopupComponent, payLoad);
            ref.afterClosed().subscribe((result: any) => {
                if (result.decision == DECISION.CONFIRM) {
                }
            });
        } else if (event.key === 'action') {
            const payload = {
                type: this.swiftCopiesRequestForm.get('typeOfSwift')?.value,
                transRef: swiftData.ftRef,
            };

            this.reportsSandBox.getSwiftPdf(payload).subscribe((res: any) => {
                this.dialog.openOverlayPanel('Preview', LcPreviewComponent, { content: res.data });
            });
        }
    }

    public search() {
        const formData = this.swiftCopiesRequestForm.value;
        let payload: any = {};
        let dateFormat = this.transferDateFormat;
        payload = {
            amount: formData.amount || '',
            beneficiaryName: formData.beneficiaryName || '',
            currency: this.selectedCurrency,
            type: formData.typeOfSwift,
        };
        if (formData.typeOfSwift === 'LC' || formData.typeOfSwift === 'BG') {
            dateFormat = this.BGLCDateFormat;
        } else {
            payload.fromAccount = formData.fromAccount?.account_no || '';
        }
        if (formData.requestDate) payload.requestDate = moment(new Date(formData.requestDate)).format(dateFormat);
        this.reportsSandBox.searchSwiftCopies(payload).subscribe((res: any) => {
            if (res.data.swiftCopyData) {
                this.sortedData = res.data?.swiftCopyData || [];
                this.sortedData.map((obj: any) => {
                    if (obj.ftRef !== undefined || obj.ftRef !== '' || obj.ftRef !== ' ') {
                        obj.ftRef = obj.ftRef.split('\\')[0];
                    }
                    if (this.selectedType === 'TRANSFER') {
                        obj.currency = this.selectedCurrency;
                    }
                    return obj;
                });
                this.sortedData = this.sandBox.sortData(this.sortedData);
                this.loadDataTable();
            }
        });
    }

    previewSwift(data: any) {
        return data.status !== 'REJECTED' && data.status !== 'COMPLETED';
    }
}
