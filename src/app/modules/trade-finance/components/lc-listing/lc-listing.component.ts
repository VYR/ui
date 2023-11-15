import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { BgStatusViewComponent } from '../bg-status-view/bg-status-view.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { LcStatusViewComponent } from '../lc-status-view/lc-status-view.component';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-lc-listing',
    templateUrl: './lc-listing.component.html',
    styleUrls: ['./lc-listing.component.scss'],
})
export class LcListingComponent implements OnInit {
    @ViewChild('menuTrigger') trigger: any;
    tableConfig!: CIBTableConfig;
    DECISION = DECISION;
    @Input() status: any = 'QUEUE';
    @Input() type: any = 'LC';

    public filterInquiryForm!: FormGroup;
    payload: any;
    cols: any = [];
    pageHeader: any;

    lcdocuments: any;
    public amendColumns: any = [];
    public lcColumns: any = [];

    searchForm!: UntypedFormGroup;

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'updated',
    };

    filterStatus = [
        'ALL',
        'AWAITING_APPROVAL',
        'REVERTED',
        'SUBMITTED',
        'MORE_INFO_REQ',
        'REJECTED',
        'UNDER_PROCESS',
        'ISSUED',
        'DECLINED',
        'CANCELED',
    ];

    constructor(
        private dialog: CibDialogService,
        private sandBox: TradeFinanceSandbox,
        public fb: FormBuilder,
        private utilService: UtilService,
        private router: Router
    ) {
        this.searchForm = this.fb.group({
            filterStatus: [null, ''],
        });
    }

    ngOnInit() {
        this.pageHeader =
            this.status === 'QUEUE' ? `RECENTLY CREATED ` + this.type + `'s` : `AMENDED ` + this.type + `'s`;
        this.filterInquiryForm = this.fb.group({
            lcExpiryDate: [''],
            lcAmount: [''],
            lcApplicationId: [''],
            txnRefNo: [''],
            bankRef: [''],
            bgApplicationId: [''],
            bgRefNo: [''],
            bgPrincipalAmount: [''],
            bgBeneficiaryName: [''],
        });
        this.getLcStatus();
    }

    ngOnChanges() {
        this.pageHeader =
            this.status === 'QUEUE' ? `RECENTLY CREATED ` + this.type + `'s` : `AMENDED ` + this.type + `'s`;
        this.setColumns();
    }

    setColumns() {
        this.amendColumns = [
            {
                key: this.type === 'LC' ? 'applnId' : 'mdRefColumn',
                displayName: 'Reference No',
                type: ColumnType.link,
                sortable: true,
                minWidth: 1,
            },
            {
                key: this.type === 'LC' ? 'lcRefNo' : 'bgRefNo',
                displayName: this.type === 'LC' ? 'LC Reference' : 'BG Reference',
                sortable: true,
                minWidth: 1,
            },
            {
                key: 'updated',
                displayName: 'REQUEST DATE',
                sortable: true,
                minWidth: 1,
            },
            {
                key: this.type === 'LC' ? 'lcBeneficiaryName' : 'beneficiaryName',
                displayName: 'BENEFICIARY NAME',
                sortable: true,
                minWidth: 1,
                type: ColumnType.toolTip,
            },
            {
                key: 'currency',
                displayName: 'CURRENCY',
                sortable: true,
            },
            {
                key: this.type === 'LC' ? 'lcAmount' : 'principalAmount',
                displayName: 'AMOUNT',
                sortable: true,
                type: ColumnType.amount,
                minWidth: 1,
            },

            {
                key: this.type === 'LC' ? 'lcExpiryDate' : 'expiryDate',
                displayName: 'EXPIRY DATE',
                type: ColumnType.date,
                sortable: true,
                minWidth: 1,
            },
            {
                key: 'statusDesc',
                displayName: this.type === 'LC' ? 'LC STATUS' : 'BG STATUS',
                sortable: true,
                minWidth: 1,
                type: ColumnType.status,
            },
            {
                key: 'edit',
                displayName: 'EDIT',
                callBackFn: this.checkForEditAction,
                type: ColumnType.icon,
                icon: 'la-edit',
            },
            {
                key: 'attachment',
                displayName: 'ATTACHMENTS',
                type: ColumnType.icon,
                icon: 'la-paperclip',
                callBackFn: this.checkForAction,
                extraText: 'docLength',
                minWidth: 1,
            },
        ];
        this.lcColumns = [
            {
                key: this.type === 'LC' ? 'lcCibRefCol' : 'mdRefColumn',
                displayName: 'Reference No',
                type: ColumnType.link,
                sortable: true,
                minWidth: 6,
            },
            {
                key: this.type === 'LC' ? 'lcRefNo' : 'bgRefNo',
                displayName: this.type === 'LC' ? 'LC Reference' : 'BG Reference',
                sortable: true,
                minWidth: 2,
            },

            {
                key: this.type === 'LC' ? 'lcBeneficiaryName' : 'beneficiaryName',
                displayName: 'BENEFICIARY NAME',
                sortable: true,
                minWidth: 8,
                type: ColumnType.toolTip,
            },
            {
                key: 'currency',
                displayName: 'CURRENCY',
                sortable: true,
                minWidth: 1,
            },
            {
                key: this.type === 'LC' ? 'lcAmount' : 'principalAmount',
                displayName: 'AMOUNT',
                sortable: true,
                type: ColumnType.amount,
                minWidth: 3,
            },
            {
                key: this.type === 'LC' ? 'lcProductType' : 'bgProductTypeText',
                displayName: this.type === 'LC' ? 'LC Type' : 'BG TYPE',
                sortable: true,
                minWidth: 4,
            },
            {
                key: 'updated',
                displayName: 'REQUEST DATE',
                sortable: true,
                minWidth: 10,
            },

            {
                key: this.type === 'LC' ? 'lcExpiryDate' : 'expiryDate',
                displayName: 'EXPIRY DATE',
                type: ColumnType.date,
                sortable: true,
                minWidth: 10,
            },
            {
                key: 'statusDesc',
                displayName: this.type === 'LC' ? 'STATUS' : 'STATUS',
                sortable: true,
                minWidth: 4,
                type: ColumnType.status,
            },
            {
                key: 'edit',
                displayName: 'EDIT',
                type: ColumnType.icon,
                callBackFn: this.checkForEditAction,
                icon: 'la-edit',
                minWidth: 1,
            },
            {
                key: 'amend',
                displayName: 'AMEND',
                type: ColumnType.icon,
                callBackFn: this.checkForAmendAction,
                UUID: this.type === 'LC' ? 'TRADEFINANCE_LC_AMEND_SUBMIT' : 'BANK_GUARANTEE_AMMEND',
                icon: 'la-edit',
                minWidth: 1,
            },
            {
                key: 'attachment',
                displayName: 'ATTACHMENTS',
                type: ColumnType.icon,
                icon: 'la-paperclip',
                callBackFn: this.checkForAction,
                extraText: 'docLength',
                minWidth: 2,
            },
            {
                key: 'copy',
                displayName: 'COPY',
                type: ColumnType.icon,
                icon: 'la-copy',
                callBackFn: this.checkForCopyAction,
                minWidth: 1,
            },
        ];
    }

    checkForAction(data: any) {
        return data.documents?.length > 0;
    }

    checkForCopyAction(data: any) {
        if (data.status) return !(data.status?.statusDesc.toLowerCase() != 'issued' || data.channel === 'NON-OCIB');
        else return data.lcStatusBean?.statusDesc.toLowerCase() == 'issued' && data.channel !== 'NON-OCIB';
    }

    checkForEditAction(data: any) {
        if (data.status) return data.status.isEditable !== 'N';
        else return data.lcStatusBean?.isEditable !== 'N';
    }

    checkForAmendAction(data: any) {
        if (data.status) return data.status.isAmendable !== 'N';
        else return data.lcStatusBean?.isAmendable !== 'N';
    }

    public generateExcel() {
        this.sandBox.getRecentlyCreatedLC(this.type, this.status, 'excel').subscribe((response: any) => {});
    }

    public onClickCell(event: any) {
        if (event.key === 'lcCibRefCol' || event.key === 'applnId' || event.key === 'mdRefColumn') {
            this.payload = {
                status: this.status,
                data: event.data,
            };

            if (this.type === 'LC') {
                const header = 'Reference No: ' + event.data.lcCibRefCol;
                this.dialog.openOverlayPanel(header, LcStatusViewComponent, this.payload);
            } else {
                const header = 'Reference No: ' + event.data.mdRefColumn;
                this.dialog.openOverlayPanel(header, BgStatusViewComponent, this.payload);
            }
        } else if (event.key === 'attachment') {
            let payload = {
                type: 'deleteFile',
                file: event.data.documents,
                pageType: this.type,
            };
            const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, payload);
            ref.afterClosed().subscribe((res: any) => {});
        }

        // bank-guarantee
        else if (event.key === 'edit' && this.type == 'BG' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Edit BG</div>',
                body: '<div>Would you like to edit this guarantee?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox._selectedBG.next({ type: 'bgEdit', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.BANK_GUARANTEE]);
                }
            });
        } else if (event.key === 'amend' && this.type == 'BG' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Amend BG</div>',
                body: '<div>Would you like to amend this guarantee?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.checkAmendmentEligibility(event.data);
                }
            });
        } else if (event.key === 'copy' && this.type == 'BG' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Copy BG</div>',
                body: '<div>Would you like to copy this guarantee?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox._selectedBG.next({ type: 'bgCopy', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.BANK_GUARANTEE]);
                }
            });
        } else if (event.key === 'edit' && this.type == 'BG' && this.status == 'AMEND') {
            let data = {
                header: '<div>Edit BG</div>',
                body: '<div>Would you like to edit this guarantee?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox._selectedBG.next({ type: 'bgAmendEdit', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.BANK_GUARANTEE]);
                }
            });
        }

        //import-lc
        else if (event.key === 'edit' && this.type == 'LC' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Edit LC</div>',
                body: '<div>Would you like to edit this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox.setLcRequest({ type: 'lcEdit', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.REQUEST_LC]);
                }
            });
        } else if (event.key === 'amend' && this.type == 'LC' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Amend LC</div>',
                body: '<div>Would you like to amend this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.checkAmendmentEligibilityForLc(event.data);
                }
            });
        } else if (event.key === 'copy' && this.type == 'LC' && this.status == 'QUEUE') {
            let data = {
                header: '<div>Copy LC</div>',
                body: '<div>Would you like to copy this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox.setLcRequest({ type: 'lcCopy', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.REQUEST_LC]);
                }
            });
        } else if (event.key === 'edit' && this.type == 'LC' && this.status == 'AMEND') {
            let data = {
                header: '<div>Edit LC</div>',
                body: '<div>Would you like to edit this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox.setLcRequest({ type: 'lcAmendEdit', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.REQUEST_LC]);
                }
            });
        }
    }

    checkAmendmentEligibility(bgDetails: any) {
        let refNum = bgDetails.id ? bgDetails.id : bgDetails.bankRef;
        this.sandBox.checkAmendmentEligibility(refNum).subscribe((res: any) => {
            if (res.data === 'Y') {
                this.sandBox._selectedBG.next({ type: 'bgAmend', data: bgDetails || {} });
                this.router.navigate([APP_ROUTES.BANK_GUARANTEE]);
            } else {
                this.utilService.displayNotification(
                    `Amendment already in process for this BG. Please check amendment status tab for more information.`,
                    'error'
                );
            }
        });
    }

    checkAmendmentEligibilityForLc(lcDetails: any) {
        let refNum = lcDetails.applnId ? lcDetails.applnId : lcDetails.txnRefNo;
        this.sandBox.checkAmendmentEligibilityForLc(refNum).subscribe((res: any) => {
            if (res.data === 'Y') {
                this.sandBox.setLcRequest({ type: 'lcAmend', data: lcDetails || {} });
                this.router.navigate([APP_ROUTES.REQUEST_LC]);
            } else {
                this.utilService.displayNotification(
                    `Amendment already in process for this LC. Please check amendment status tab for more information.`,
                    'error'
                );
            }
        });
    }

    lazyLoad(event: CIBTableQuery) {
        this.query = event;
        if (event.sortKey) {
            this.lcdocuments = this.lcdocuments.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.status !== 'AMEND' ? this.lcColumns : this.amendColumns,
            data: this.lcdocuments,
            selection: false,
            totalRecords: this.lcdocuments.length,
            clientPagination: true,
        };
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public getLcStatus() {
        this.filterInquiryForm.reset();
        this.searchForm.reset();
        this.sandBox.getRecentlyCreatedLC(this.type, this.status).subscribe((response: any) => {
            if (response.data) {
                this.setLcData(response.data);
            }
        });
    }

    setLcData(rowData: any[]) {
        if (this.type === 'LC') {
            if (this.status !== 'AMEND') {
                rowData = rowData?.filter(function (lc: any) {
                    return (
                        (lc.lcStatusBean.statusDesc !== 'ISSUED' && lc.lcStatusBean.isAmendable === 'N') ||
                        lc.lcStatusBean.isAmendable === 'Y'
                    );
                });
            }

            rowData?.forEach((item: any) => {
                item.lcBeneficiaryName = item.lcAdvicingBankDetails?.lcBeneficiaryName;
                item.lcProductType = item.lcbasicDetails?.lcProductType;
                item.lcExpiryDate = item.lcbasicDetails?.lcExpiryDate;
                item.statusDesc = item.lcStatusBean?.statusDesc;
                item.updated = item.updated || item.created;
                item.lcAmount = item.lcbasicDetails?.lcAmount;
                item.docLength = item.documents?.length;
                item.tfRef = item.txnRefNo;
                item.lcCibRefCol = item.applnId || item.txnRefNo;
            });
            this.lcdocuments = rowData;
        } else {
            if (this.status !== 'AMEND') {
                rowData = rowData?.filter(function (bg: any) {
                    return (
                        (bg.status.statusDesc !== 'ISSUED' && bg.status.isAmendable === 'N') ||
                        bg.status.isAmendable === 'Y'
                    );
                });
            }

            rowData?.forEach((item: any) => {
                item.mdRefColumn = item.id || item.bankRef;

                item.statusDesc = item.status?.statusDesc;
                item.updated = item.updated || item.created;
                item.docLength = item.documents?.length;
            });
            this.lcdocuments = rowData;
        }

        this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
    }

    closeMatmenu() {
        this.filterInquiryForm.reset();
        this.trigger.closeMenu();
    }

    diableFilterButton() {
        return Object.values(this.filterInquiryForm.value).every((x: any) => !x);
    }

    filterTable() {
        if (this.type === 'BG') {
            const payload: any = {};
            const fv: any = this.filterInquiryForm.getRawValue();
            Object.keys(fv).forEach((v) => {
                if (fv[v]) {
                    if (v === 'lcExpiryDate') {
                        const payName = this.type === 'LC' ? 'lcExpiryDate' : 'bgExpiryDate';
                        payload[payName] = moment(fv[v]).format('YYYY-MM-DD');
                    } else {
                        payload[v] = fv[v];
                    }
                }
            });

            this.closeMatmenu();
            this.filterList(payload);
        } else {
            let filterList = [];
            filterList = this.lcdocuments.filter((item: any) => {
                return (
                    (!this.filterInquiryForm.controls['txnRefNo']?.value ||
                        item.tfRef
                            ?.toLowerCase()
                            .includes(this.filterInquiryForm.controls['txnRefNo']?.value.toLowerCase())) &&
                    (!this.filterInquiryForm.controls['lcAmount']?.value ||
                        item.amount
                            ?.toString()
                            .includes(this.filterInquiryForm.controls['lcAmount']?.value.toString())) &&
                    (!this.filterInquiryForm.controls['lcExpiryDate']?.value ||
                        item.lcbasicDetails?.lcExpiryDate?.includes(
                            moment(this.filterInquiryForm.controls['lcExpiryDate']?.value).format('YYYY-MM-DD')
                        )) &&
                    (!this.filterInquiryForm.controls['lcApplicationId']?.value ||
                        item.lcCibRefCol
                            ?.toLowerCase()
                            .includes(this.filterInquiryForm.controls['lcApplicationId']?.value.toLowerCase())) &&
                    (!this.filterInquiryForm.controls['bgBeneficiaryName']?.value ||
                        item.lcAdvicingBankDetails?.lcBeneficiaryName
                            ?.toLowerCase()
                            .includes(this.filterInquiryForm.controls['bgBeneficiaryName']?.value.toLowerCase()))
                );
            });
            this.setLcData(filterList);
        }
    }

    filterList(params: any) {
        this.sandBox.getFilterBgList(this.status, params).subscribe((res: any) => {
            if (res.data) {
                this.setLcData(res.data);
            }
        });
    }

    onStatusChange(event: any) {
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
            clientPagination: true,
        };

        let params: any = {};
        if (this.type === 'BG') {
            if (this.searchForm.controls['filterStatus'].value !== 'ALL') {
                params = {
                    bgAction: this.searchForm.controls['filterStatus'].value,
                };
            }
            this.sandBox.getFilterBgList(this.status, params).subscribe((res: any) => {
                if (res.data) {
                    this.setLcData(res.data);
                }
            });
        } else {
            let filterList = [];
            if (this.searchForm.controls['filterStatus'].value !== 'ALL') {
                filterList = this.lcdocuments.filter((item: any) => {
                    return this.searchForm.controls['filterStatus']?.value === item.lcStatusBean?.statusCode;
                });
                this.setLcData(filterList);
            } else {
                this.sandBox.getRecentlyCreatedLC(this.type, this.status).subscribe((response: any) => {
                    if (response.data) {
                        this.setLcData(response.data);
                    }
                });
            }
        }
    }
}
