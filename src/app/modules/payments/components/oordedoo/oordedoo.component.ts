import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { PaymentsSandbox } from '../../payments.sandbox';
import { PaymentOtpViewComponent } from '../payment-otp-view/payment-otp-view.component';

@Component({
    selector: 'app-oordedoo',
    templateUrl: './oordedoo.component.html',
    styleUrls: ['./oordedoo.component.scss'],
})
export class OordedooComponent implements OnInit {
    viewBillForm: FormGroup = new FormGroup({});
    accountList: any = [];

    showOoredooBillByServiceNumber: boolean = false;
    inputValue: any = '';
    billData!: any;
    otp: any;
    showConfirmation: boolean = false;
    successData!: any;
    confirmationTitle!: string;
    confirmationSubtitle!: string;
    selectedAccount!: any;

    constructor(
        private sandBox: PaymentsSandbox,
        private _formBuilder: FormBuilder,
        private dialog: CibDialogService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getAccountsList();
        this.viewBillFormBuilder();
    }

    onViewBillClick() {
        this.selectedAccount = '';
        this.viewBillForm.reset();
        this.sandBox.viewOoredooBill('servicenumber', this.inputValue).subscribe((res: any) => {
            if (res.status === 'SUCCESS') {
                this.billData = res.data;
                this.billData.inputValue = this.inputValue;
                this.showOoredooBillByServiceNumber = true;
            }
        });
    }

    viewBillFormBuilder() {
        return (this.viewBillForm = this._formBuilder.group({
            amount: [null, Validators.required],
            fromAccount: [null, Validators.required],
        }));
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

    enableViewBillBtn(): boolean {
        return this.inputValue && this.inputValue.toString().length > 0;
    }

    filterAccountlist() {
        let validCur = ['QAR'];
        this.accountList = this.accountList.filter(function (al: any) {
            return validCur.indexOf(al.currency) !== -1;
        });
    }

    onPayOoredooBillClick(action: any) {
        var payload = {
            debitAccountId: this.viewBillForm.get('fromAccount')?.value.account_no,
            currency: this.viewBillForm.get('fromAccount')?.value.currency,
            phoneNumber: this.inputValue,
            amount: this.viewBillForm.get('amount')?.value,
            action: action,
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };

        this.sandBox.payOoredooBill(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                this.openSidePanel(this.viewBillForm);
            } else {
                this.confirmationTitle = res.data.requestId
                    ? 'Request has been sent for approval.'
                    : 'Ooredoo Bill has been paid successfully';
                this.confirmationSubtitle = res.data.requestId
                    ? 'Request ID: #' + res.data.requestId
                    : 'Reference No: #' + res.data.referenceNumber;
                this.successData = payload;
                this.showOoredooBillByServiceNumber = false;
                this.showConfirmation = true;
            }
        });
    }

    onSelectAccount(acc: any) {
        this.selectedAccount = acc;
    }

    openSidePanel(form: FormGroup) {
        let fieldInfo = [
            { fieldName: 'Service Number', fieldValue: this.inputValue },
            { fieldName: 'Debit Account', fieldValue: form.get('fromAccount')?.value.account_no },
            { fieldName: 'Currency', fieldValue: form.get('fromAccount')?.value.currency },
            { fieldName: 'Due Date', fieldValue: this.billData.dueDate },
            { fieldName: 'Outstanding Amount', fieldValue: this.billData.outstandingAmount, pipeName: 'amount' },
            { fieldName: 'Unbilled Amount', fieldValue: this.billData.unbilledAmount, pipeName: 'amount' },
            { fieldName: 'Amount', fieldValue: form.get('amount')?.value, pipeName: 'amount' },
        ];

        let data = {
            headerName: 'Ooredoo Postpaid Payment',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.otp = result.data;
                this.onPayOoredooBillClick('CONFIRM');
            }
        });
    }

    resetView() {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate([APP_ROUTES.PAYMENTS_OOREDOO]);
        });
    }
}
