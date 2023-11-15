import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { PaymentsSandbox } from '../../payments.sandbox';
import { PaymentOtpViewComponent } from '../payment-otp-view/payment-otp-view.component';
import { UtilService } from 'src/app/utility';

@Component({
    selector: 'app-kahramaa',
    templateUrl: './kahramaa.component.html',
    styleUrls: ['./kahramaa.component.scss'],
})
export class KahramaaComponent implements OnInit {
    kahramaList: any = [];
    kahramaaBills: any = [];
    tableConfig!: CIBTableConfig;
    customerForm: FormGroup = new FormGroup({});
    editCustomerForm: FormGroup = new FormGroup({});
    isViewBill: boolean = false;

    public cols = [
        {
            key: 'accountNo',
            displayName: 'ELECTRICITY No.',
            sortable: true,
        },
        {
            key: 'nickName',
            displayName: 'CUSTOMER NAME',
            sortable: true,
        },
        {
            key: 'qatarId',
            displayName: 'QID/ESTD ID',
            sortable: true,
        },
        {
            key: 'view',
            displayName: 'VIEW',
            type: ColumnType.icon,
            icon: 'la-eye',
            UUID: 'PAYMENT_VIEW_KAHRAMAA_BILL',
        },
        {
            key: 'edit',
            displayName: 'EDIT',
            type: ColumnType.icon,
            icon: 'la-edit',
            UUID: 'PAYMENT_UPDATE_KAHRAMAA_NUMBER',
        },
        {
            key: 'delete',
            displayName: 'DELETE',
            type: ColumnType.icon,
            icon: 'la-trash',
            UUID: 'PAYMENT_DELETE_KAHRAMAA_NUMBER',
        },
    ];
    showCustomerForm: boolean = false;
    otp: any;
    formHeaderName: string = 'ADD NEW CUSTOMER NUMBER';
    editCustomer: boolean = false;
    selectedViewBill!: any;
    successData!: any;
    successMsg!: string;
    showConfirmation: boolean = false;
    addCustomerForm = false;
    sortedData!: any;
    selectedEditRow!: any;
    constructor(
        private sandBox: PaymentsSandbox,
        private dialog: CibDialogService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getKahramaaList();
    }

    checkForAction(data: any) {
        return true;
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

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.sortedData = this.kahramaList.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    getKahramaaList() {
        this.sandBox.getKahramaaList().subscribe((res: any) => {
            this.kahramaList = res.data;
            this.sortedData = this.kahramaList;
            this.loadDataTable();
        });
    }

    onAdd() {
        this.customerForm = this._formBuilder.group({
            electricityNo: [null, Validators.required],
            name: [null, Validators.required],
            qatarId: [null, Validators.required, , Validators.maxLength],
            customerNo: [null, ''],
        });
        this.editCustomer = false;
        this.formHeaderName = 'ADD NEW CUSTOMER NUMBER';
        this.showCustomerForm = true;
        this.addCustomerForm = true;
        this.isViewBill = false;
        this.showConfirmation = false;
    }

    onAddNewCustomer(action: any) {
        //check for duplicate
        let dupFlag: boolean = false;
        const elecNo = this.customerForm.controls['electricityNo']?.value;
        this.sortedData.forEach((i: any) => {
            if (i.accountNo === elecNo?.toString()) {
                dupFlag = true;
            }
        });
        if (dupFlag) {
            this.utilService.displayNotification(`Electricity Number Already Present`, 'error');
            return;
        }
        const payload = {
            serviceNumber: this.customerForm.controls['electricityNo'].value,
            nickName: this.customerForm.controls['name'].value,
            qatarId: this.customerForm.controls['qatarId'].value,
            kahramaaCustomerNumber: this.customerForm.controls['customerNo'].value,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };

        this.sandBox.addNewCustomer(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.openSidePanel(this.customerForm);
            } else {
                if (res.data.requestId || res.status === 'SUCCESS') {
                    this.successData = payload;
                    this.successMsg = 'KAHRAMAA BENEFICIARY HAS BEEN CREATED SUCCESSFULLY';
                    this.successData.accountNo = payload.serviceNumber;
                    this.showCustomerForm = false;
                    this.showConfirmation = true;
                }
            }
        });
    }

    deleteCustomerConfirm(action: any, selectedRow: any) {
        const payload = {
            beneficiaryId: selectedRow.beneficiaryId,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };

        this.sandBox.deleteCustomer(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.openDeleteSidePanel(selectedRow);
            } else {
                if (res.data.requestId || res.status === 'SUCCESS') {
                    this.successData = selectedRow;
                    this.successMsg = 'KAHRAMAA BENEFICIARY HAS BEEN DELETED SUCCESSFULLY';
                    this.showCustomerForm = false;
                    this.showConfirmation = true;
                }
            }
        });
    }

    onEditCustomer(action: any) {
        //check for duplicate
        let dupFlag: boolean = false;
        const elecNo = this.editCustomerForm.controls['electricityNo'].value;
        this.sortedData.forEach((i: any) => {
            if (i.accountNo === elecNo?.toString()) {
                dupFlag = true;
            }
        });
        if (dupFlag) {
            this.utilService.displayNotification(`Electricity Number Already Present`, 'error');
            return;
        }
        const payload = {
            serviceNumber: this.editCustomerForm.controls['electricityNo'].value,
            nickName: this.editCustomerForm.controls['name'].value,
            qatarId: this.editCustomerForm.controls['qatarId'].value,
            kahramaaCustomerNumber: this.editCustomerForm.controls['customerNo'].value,
            beneficiaryId: this.selectedEditRow.beneficiaryId,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };

        this.sandBox.editCustomer(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.openSidePanel(this.editCustomerForm);
            } else {
                if (res.data.requestId || res.status === 'SUCCESS') {
                    this.successData = payload;
                    this.successMsg = 'KAHRAMAA BENEFICIARY HAS BEEN EDITED SUCCESSFULLY';
                    this.successData.accountNo = payload.serviceNumber;
                    this.showCustomerForm = false;
                    this.showConfirmation = true;
                }
            }
        });
    }

    openDeleteSidePanel(selectedRow: any) {
        let fieldInfo = [
            { fieldName: 'Qatar Id', fieldValue: selectedRow.qatarId },
            { fieldName: 'Customer Name', fieldValue: selectedRow.acccountHolderName },
            { fieldName: 'Electricity Number', fieldValue: selectedRow.accountNo },
        ];
        if (selectedRow.kahramaaCustomerNumber) {
            fieldInfo.push({ fieldName: 'Customer Number', fieldValue: selectedRow.kahramaaCustomerNumber });
        }

        let data = {
            headerName: 'Delete Kahraama QID',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer('Delete Kahraama QID', PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.otp = result.data;
                this.deleteCustomerConfirm('CONFIRM', selectedRow);
            }
        });
    }

    openSidePanel(form: FormGroup) {
        let fieldInfo = [
            { fieldName: 'Qatar Id', fieldValue: form.get('qatarId')?.value },
            { fieldName: 'Customer Name', fieldValue: form.get('name')?.value },
        ];
        if (form.get('electricityNo')?.value) {
            fieldInfo.push({ fieldName: 'Electricity Number', fieldValue: form.get('electricityNo')?.value });
        }
        if (form.get('customerNo')?.value) {
            fieldInfo.push({ fieldName: 'Customer Number', fieldValue: form.get('customerNo')?.value });
        }

        let data = {
            headerName: this.editCustomer ? 'EDIT CUSTOMER' : 'ADD CUSTOMER',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.otp = result.data;
                this.editCustomer ? this.onEditCustomer('CONFIRM') : this.onAddNewCustomer('CONFIRM');
            }
        });
    }

    onClickCell(event: any) {
        this.isViewBill = false;
        this.kahramaaBills = [];
        this.selectedViewBill = {};
        this.showConfirmation = false;
        this.showCustomerForm = false;
        this.addCustomerForm = false;
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Kahramaa Beneficiary</div>',
                body: '<div>Would You like to delete this Electricity Number ' + event.data.accountNo + '?</div>',
            };

            const ref = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            ref.afterClosed().subscribe((res) => {
                if (res.event === 'confirm') {
                    this.deleteCustomerConfirm('VERIFY', event.data);
                }
            });
        } else if (event.key === 'edit') {
            this.showConfirmation = false;
            this.showCustomerForm = true;
            this.editCustomer = true;
            this.formHeaderName = 'EDIT CUSTOMER NUMBER';
            this.selectedEditRow = event.data;
            this.editCustomerForm = this._formBuilder.group({
                electricityNo: event.data.accountNo,
                name: new FormControl({ value: event.data.nickName, disabled: true }),
                qatarId: new FormControl({ value: event.data.qatarId, disabled: true }),
                customerNo: event.data.kahramaaCustomerNumber,
            });
        } else if (event.key === 'view') {
            this.sandBox
                .getKahramaaBill(event.data.accountNo, event.data.qatarId, event.data.beneficiaryId)
                .subscribe((res: any) => {
                    this.kahramaaBills = res.data.kahramaaBillDetails || [];
                    this.kahramaaBills.forEach((details: any) => {
                        details['currency'] = 'QAR';
                    });
                    this.selectedViewBill = event.data;
                    this.isViewBill = true;
                });
        }
    }

    resetView() {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate([APP_ROUTES.PAYMENTS_KAHRAMAA]);
        });
    }
}
