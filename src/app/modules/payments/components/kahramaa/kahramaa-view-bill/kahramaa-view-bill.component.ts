import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { PaymentsSandbox } from '../../../payments.sandbox';
import { PaymentOtpViewComponent } from '../../payment-otp-view/payment-otp-view.component';

@Component({
    selector: 'app-kahramaa-view-bill',
    templateUrl: './kahramaa-view-bill.component.html',
    styleUrls: ['./kahramaa-view-bill.component.scss'],
})
export class KahramaaViewBillComponent implements OnInit {
    @Input() kahramaaBillDetails: any = [];
    @Input() data: any;
    showConfirmation: boolean = false;
    successData!: any;
    selectedBils: any = [];
    title!: string;
    accountList: any = [];
    otp: any;
    constructor(
        private sandBox: PaymentsSandbox,
        private dialog: CibDialogService,
        private _formBuilder: FormBuilder,
        private router: Router
    ) {}

    tableConfig!: CIBTableConfig;
    public cols = [
        {
            key: 'parentNum',
            displayName: 'ELECTRICITY No.',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'CURRENCY',
        },
        {
            key: 'outstandingAmount',
            displayName: 'OUTSTANDING AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
    ];
    viewBillForm: FormGroup = new FormGroup({});

    ngOnInit(): void {
        this.getAccountsList();
        this.viewBillFormBuilder();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.tableConfig = {
                columns: this.cols,
                data: this.kahramaaBillDetails,
                selection: true,
                totalRecords: this.kahramaaBillDetails.length,
                clientPagination: true,
            };
        });
    }

    public getAccountsList() {
        this.accountList = this.sandBox.accountList;
        if (this.accountList.length == 0) {
            this.sandBox.getAccountsList().subscribe((res: any) => {
                this.accountList = res.data.accounts;
                this.filterAccountlist();
            });
        } else this.filterAccountlist();
    }

    filterAccountlist() {
        let validCur = ['QAR'];
        this.accountList = this.accountList.filter(function (al: any) {
            return validCur.indexOf(al.currency) !== -1;
        });
    }

    resetView() {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate([APP_ROUTES.PAYMENTS_KAHRAMAA]);
        });
    }

    onSelect(event: any) {
        let amount = 0;
        this.selectedBils = event;
        this.selectedBils.forEach((bill: any) => {
            amount += Number(bill.outstandingAmount);
        });

        this.viewBillForm.controls['amount'].setValue(amount.toString());
        this.viewBillForm.controls['amount'].disable();
    }

    lazyLoad(event: any) {
        if (event.sortKey) {
            this.kahramaaBillDetails = this.kahramaaBillDetails.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.tableConfig = {
                columns: this.cols,
                data: this.kahramaaBillDetails,
                selection: false,
                totalRecords: this.kahramaaBillDetails.length,
                clientPagination: true,
            };
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    payKahramaaBill(action: any) {
        let transferData: any = [];
        let totalAmount: number = 0;
        this.selectedBils.forEach((bill: any) => {
            let temp = {
                kmReferenceNumber: bill.kmReferenceNumber,
                amount: bill.outstandingAmount,
                serviceNumber: bill.parentNum,
                registerType: bill.registerType,
                debitAccountId: this.viewBillForm.get('fromAccount')?.value.account_no,
                currency: this.viewBillForm.get('fromAccount')?.value.currency,
                qatarId: this.data.qatarId,
                customerNum: this.data.kahramaaCustomerNumber,
            };
            totalAmount = totalAmount + Number(bill.outstandingAmount || 0);
            transferData.push(temp);
        });

        var payload = {
            transferData: transferData,
            debitAccountId: this.viewBillForm.get('fromAccount')?.value.account_no,
            currency: this.viewBillForm.get('fromAccount')?.value.currency,
            totalAmount: totalAmount,
            beneficiaryName: this.data.nickName,
            qatarId: this.data.qatarId,
            customerNumber: this.data.kahramaaCustomerNumber,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };

        this.sandBox.payKahramaaBill(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.openSidePanel(this.viewBillForm);
            } else {
                if (res.data.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.successData = payload;
                    this.showConfirmation = true;
                    this.title = 'KAHRAMAA BILL HAS BEEN SENT FOR APPROVAL';
                } else if (res.status === 'SUCCESS') {
                    this.title = 'KAHRAMAA BILL HAS BEEN PAID SUCCESSFULLY';
                    this.successData = payload;
                    this.showConfirmation = true;
                }
            }
        });
    }

    onSelectAccount(acc: any) {}

    openSidePanel(form: FormGroup) {
        let fieldInfo = [
            { fieldName: 'Kahramaa Customer Number', fieldValue: this.data.kahramaaCustomerNumber },
            { fieldName: 'QID/Estd ID', fieldValue: this.data.qatarId },
            { fieldName: 'Debit Account', fieldValue: form.get('fromAccount')?.value.account_no },
            { fieldName: 'Amount', fieldValue: form.get('amount')?.value, pipeName: 'amount' },
            { fieldName: 'Currency', fieldValue: 'QAR' },
        ];

        let data = {
            headerName: 'Payment Summary',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.otp = result.data;
                this.payKahramaaBill('CONFIRM');
            }
        });
    }

    viewBillFormBuilder() {
        return (this.viewBillForm = this._formBuilder.group({
            amount: [0, Validators.required],
            fromAccount: [null, Validators.required],
        }));
    }
}
