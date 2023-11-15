import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { lcBgInquiry } from 'src/app/shared/models/lcBgInquiry.models';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { BgViewComponent } from '../bg-view/bg-view.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { LcViewComponent } from '../lc-view/lc-view.component';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';

@Component({
    selector: 'app-inquiry-listing',
    templateUrl: './inquiry-listing.component.html',
    styleUrls: ['./inquiry-listing.component.scss'],
})
export class InquiryListingComponent implements OnInit {
    @ViewChild('menuTrigger') trigger: any;
    tableConfig!: CIBTableConfig;
    DECISION = DECISION;
    @Input() status: any = 'QUEUE';
    @Input() type: any = 'LC';
    lgList: any = [];
    public filterInquiryForm!: FormGroup;
    queryParams: any = {
        pageNumber: 0,
        pageSize: 5,
    };
    payload: any;
    cols: any = [];
    fullSortData: any = [];
    pageHeader: any;
    public commonColumns = [
        {
            key: 'applnId',
            displayName: 'CIB Reference',
            type: ColumnType.link,
            sortable: true,
            minWidth: 6,
        },
        {
            key: 'customerFirstnameeng',
            displayName: 'Corporate Name',
            sortable: true,
            minWidth: 8,
        },
        {
            key: 'rimnumber',
            displayName: 'RIM',
            sortable: true,
            minWidth: 2,
        },
        {
            key: 'userFirstName',
            displayName: 'User Type',
            sortable: true,
            minWidth: 3,
        },
        {
            key: 'isAmendRequest',
            displayName: 'Request Type',
            sortable: true,
            minWidth: 6,
        },
        {
            key: this.type === 'LC' ? 'lcProductType' : 'lcProductType',
            displayName: this.type + ' Type',
            sortable: true,
            minWidth: 4,
        },
        {
            key: 'updated',
            displayName: 'Request Date',
            type: ColumnType.date,
            sortable: true,
            minWidth: 10,
        },
        {
            key: this.type === 'LC' ? 'lcBeneficiaryName' : 'beneficiaryName',
            displayName: 'Beneficiary Name',
            sortable: true,
            minWidth: 8,
            type: ColumnType.toolTip,
        },
        {
            key: 'lcAmount',
            displayName: 'Amount',
            // type: ColumnType.amount,
            sortable: true,
            minWidth: 6,
        },
        {
            key: 'attachment',
            displayName: 'Attachments',
            type: ColumnType.icon,
            icon: 'la-paperclip',
            callBackFn: this.checkForAction,
            extraText: 'docLength',
            minWidth: 1,
        },

        {
            key: 'action',
            displayName: 'Action',
            type: ColumnType.icon,
            icon: 'la-edit',
            minWidth: 1,
        },
    ];

    constructor(
        private dialog: CibDialogService,
        private sandBox: OperationsApprovalsSandbox,
        public fb: FormBuilder,
        private utilService: UtilService,
        private _decimalPipe: DecimalPipe
    ) {}

    ngOnChanges() {
        const colsLength = this.type === 'BG' ? 8 : 9;
        if (this.type === 'BG') {
            const index = this.commonColumns.findIndex((x: any) => x.key === 'lcProductType');
            if (index !== -1) {
                this.commonColumns.splice(index, 1);
            }
            this.cols = {
                ...this.commonColumns,
            };
        }

        if (this.status === 'HISTORY') {
            const columns = [
                ...this.commonColumns.slice(0, 3),
                {
                    key: 'lcRefNo',
                    displayName: this.type + ' Reference',
                    sortable: true,
                    minWidth: 3,
                },
                ...this.commonColumns.slice(3, colsLength),
                {
                    key: 'statusDesc',
                    displayName: 'Status',
                    type: ColumnType.status,
                    sortable: true,
                    minWidth: 5,
                },
                {
                    key: 'attachment',
                    displayName: 'Attachements',
                    type: ColumnType.icon,
                    icon: 'la-paperclip',
                    callBackFn: this.checkForAction,
                    extraText: 'docLength',
                    minWidth: 6,
                },
                {
                    key: 'edit',
                    displayName: 'Upload',
                    type: ColumnType.icon,
                    icon: 'las la-upload',
                    callBackFn: this.checkForUpload,
                    minWidth: 1,
                },
            ];

            this.cols = columns;
        } else {
            this.cols = this.commonColumns;
        }
    }

    checkForUpload(data: any) {
        return data.statusDesc == 'issued' || data.statusDesc == 'ISSUED';
    }

    ngOnInit(): void {
        this.filterInquiryForm = this.fb.group({
            lcExpiryDate: [''],
            lcAmount: [''],
            lcApplicationId: [''],
            txnRefNo: [''],
            rim: [''],
            lcRefNo: [''],
            bgApplicationId: [''],
            bgRefNo: [''],
            bgPrincipalAmount: [''],
            bankRef: [''],
        });
        this.pageHeader =
            this.status === 'QUEUE' ? this.type + `'S PENDING FOR APPROVAL` : `COMPLETED ` + this.type + `'S`;
        this.inquiryList();
    }

    public inquiryList() {
        this.sandBox.inquiryList(this.type, '', this.status).subscribe((res: any) => {
            if (res.data) {
                this.setListData(res);
            }
        });
    }

    checkForAction(data: any) {
        return data.documents?.length > 0;
    }

    loadDataTable(data: any) {
        this.lgList = data;
        this.tableConfig = {
            columns: this.cols,
            data,
            selection: false,
            totalRecords: data.length,
            clientPagination: true,
        };
    }

    generateExcel() {
        this.queryParams = {
            pageSize: 10000,
            pageNumber: 0,
        };
        if (this.lgList.length > 0) {
            this.utilService.exportAsExcelFile(this.formatDataForExcel(this.lgList || []), this.type + '_Inquiry_list');
            this.utilService.displayNotification('Excel generated successfully!', 'success');
        }
    }

    formatDataForExcel(accountsSummary: any) {
        const temp: any = [];
        this.lgList.forEach((ele: any) => {
            let tempObject: any = {};
            if (this.type === 'LC') {
                tempObject['CIB Reference'] = ele.applnId ? ele.applnId : ele.id;
                tempObject['Corporate Name'] = ele.customerFirstnameeng ? ele.customerFirstnameeng : null;
                tempObject['Corporate RIM'] = ele.rimnumber ? ele.rimnumber : null;
                tempObject['Corporate User'] = ele.userFirstName ? ele.userFirstName : null;
                tempObject['Request Type'] = ele.isAmendRequest;
                tempObject['LC Type'] = ele.lcProductType;
                tempObject['Request Date'] = moment(ele.updated).format('YYYY-MM-DD');
                tempObject['Beneficiary Name'] = ele.lcBeneficiaryName;
                tempObject['Currency'] = ele.currency;
                tempObject['Amount'] = ele.amount;
                tempObject['Created Date'] = moment(ele.created).format('YYYY-MM-DD');
                tempObject['Updated Date'] = moment(ele.updated).format('YYYY-MM-DD');
                tempObject['Status'] = ele.statusDesc;
            } else {
                tempObject['CIB Reference'] = ele.applnId ? ele.applnId : ele.id;
                tempObject['Corporate Name'] = ele.customerFirstnameeng ? ele.customerFirstnameeng : null;
                tempObject['Corporate RIM'] = ele.rimnumber ? ele.rimnumber : null;
                tempObject['Corporate User'] = ele.userFirstName ? ele.userFirstName : null;
                tempObject['Request Type'] = ele.isAmendRequest;

                tempObject['Request Date'] = moment(ele.updated).format('YYYY-MM-DD');
                tempObject['Beneficiary Name'] = ele.lcBeneficiaryName;
                tempObject['Currency'] = ele.currency;
                tempObject['Amount'] = ele.amount;
                tempObject['Created Date'] = moment(ele.created).format('YYYY-MM-DD');
                tempObject['Updated Date'] = moment(ele.updated).format('YYYY-MM-DD');
                tempObject['Status'] = ele.statusDesc;
            }

            temp.push(tempObject);
        });
        return temp;
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            const sortedData = this.fullSortData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(sortedData);
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'applnId' || event.key === 'action') {
            this.sandBox.inquiryList(this.type, event.data.applnId, this.status).subscribe((res: any) => {
                this.payload = {
                    type: event.key === 'applnId' ? 'inquiry' : 'action',
                    data: res.data,
                    applnId: event.data.applnId,
                    pageType: this.type,
                };
                const header = 'Reference No: ' + event.data.applnId;
                const dialogRef = this.dialog.openOverlayPanel(
                    header,
                    this.type === 'LC' ? LcViewComponent : BgViewComponent,
                    this.payload
                );
                if (event.key === 'action') {
                    dialogRef.afterClosed().subscribe((res: any) => {
                        if (res == undefined) {
                            const index = this.tableConfig.data.findIndex((x: any) => x.applnId === event.data.applnId);
                            if (index !== -1) {
                                this.tableConfig.data.splice(index, 1);
                            }
                            this.tableConfig = {
                                ...this.tableConfig,
                            };
                        }
                    });
                }
            });
        } else if (event.key === 'attachment') {
            let payload = {
                type: 'deleteFile',
                file: event.data.documents,
                pageType: this.type,
            };
            const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, payload);
            ref.afterClosed().subscribe((res: any) => {});
        } else if (event.key === 'edit') {
            let data = {
                type: 'historyAction',
                data: event.data,
                applnId: event.data.applnId,
                pageType: this.type,
            };
            const header = 'Reference No: ' + event.data.applnId;
            const dialogRef = this.dialog.openOverlayPanel(
                header,
                this.type === 'LC' ? LcViewComponent : BgViewComponent,
                data,
                CibDialogType.medium
            );
            dialogRef.afterClosed().subscribe((res: any) => {
                this.inquiryList();
            });
        }
    }

    diableFilterButton() {
        return Object.values(this.filterInquiryForm.value).every((x: any) => !x);
    }

    private _formatTransactionDate(lcExpiryDate: any) {
        if (lcExpiryDate != '' && lcExpiryDate != null && lcExpiryDate != undefined) {
            return moment(lcExpiryDate).format('DD-MMM-YYYY');
        } else {
            return lcExpiryDate;
        }
    }

    filterInquiry() {
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
        this.queryParams = {
            type: this.status,
            ...payload,
        };
        this.closeMatmenu();
        this.filterList(this.queryParams);
    }

    filterList(params: any) {
        this.sandBox.filterDetails(this.type, params).subscribe((res: any) => {
            if (res.data) {
                this.setListData(res);
            }
        });
    }

    setListData(list: any) {
        const lgList: any = [];
        if (list.data) {
            list.data.forEach((data: any) => {
                let lcInquiryList = new lcBgInquiry();
                lcInquiryList = { ...data };
                lcInquiryList.applnId = data?.applnId ? data.applnId : data.id;
                lcInquiryList.customerFirstnameeng = data.customer?.firstnameeng;
                lcInquiryList.rimnumber = data.customer?.rimnumber;
                lcInquiryList.userFirstName = data.user?.firstNameEng;
                if (this.type === 'LC') {
                    lcInquiryList.isAmendRequest =
                        data.isAmendRequest === 'Y'
                            ? '' + this.type + ' Amendment Request'
                            : 'New ' + this.type + ' Request';
                } else {
                    lcInquiryList.isAmendRequest =
                        data.isAmmended === 'Y'
                            ? '' + this.type + ' Amendment Request'
                            : 'New ' + this.type + ' Request';
                }

                lcInquiryList.lcProductType = data.lcbasicDetails?.lcProductType;
                lcInquiryList.lcBeneficiaryName = data.lcAdvicingBankDetails?.lcBeneficiaryName
                    ? data.lcAdvicingBankDetails?.lcBeneficiaryName
                    : data.beneficiaryName;
                lcInquiryList.lcAmount = data.lcbasicDetails?.lcAmount
                    ? data?.currency + ' ' + this._decimalPipe.transform(data.lcbasicDetails?.lcAmount, '1.2-4')
                    : data?.currency + ' ' + this._decimalPipe.transform(data?.principalAmount, '1.2-4');
                lcInquiryList.currency = data.lcbasicDetails?.lcCurrency
                    ? data.lcbasicDetails?.lcCurrency
                    : data.currency;
                lcInquiryList.lcRefNo = data.lcRefNo ? data.lcRefNo : data.bgRefNo;
                lcInquiryList.statusDesc = data?.lcStatusBean?.statusDesc
                    ? data?.lcStatusBean.statusDesc
                    : data?.status.statusDesc;
                lcInquiryList.docLength = data.documents?.length;
                lcInquiryList.amount = data.lcbasicDetails?.lcAmount
                    ? data.lcbasicDetails?.lcAmount
                    : data.principalAmount;
                lcInquiryList.updated = data?.updated ? data?.updated : data?.created;

                lgList.push(lcInquiryList);
            });
        }
        this.fullSortData = lgList;
        this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
        //this.loadDataTable(lgList);
    }

    closeMatmenu() {
        this.filterInquiryForm.reset();
        this.trigger.closeMenu();
    }
}
