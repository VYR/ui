import { Component, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { PaymentsSandbox } from '../../payments.sandbox';
import { PaymentOtpViewComponent } from '../payment-otp-view/payment-otp-view.component';

@Component({
    selector: 'app-dhareeba-details',
    templateUrl: './dhareeba-details.component.html',
    styleUrls: ['./dhareeba-details.component.scss'],
})
export class DhareebaDetailsComponent {
    @Input() selectedTin: any = [];
    @Input() billList: any = [];
    selectedBill: any = {};
    accountList: any = [];

    form: FormGroup = new FormGroup({});
    tableConfig!: CIBTableConfig;
    otp: any;
    DECISION = DECISION;
    isValidated: boolean = false;
    successData: any;
    payloadList: any;
    dueDate: any;
    title: any;
    availableBalance: any;

    constructor(private sandBox: PaymentsSandbox, private fb: FormBuilder, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            bill: [this.billList[0], [Validators.required]],
            fromAccount: [null, [Validators.required]],
        });
        this.selectedBill = this.billList[0];
        this.getDhareenaAccountList(this.selectedBill.itemCurrencyCode);
    }

    onBillSelected(event: any, billObj: any) {
        if (event.isUserInput) {
            this.selectedBill = billObj;
            this.availableBalance = null;
            this.accountList = this.sandBox.accountList.filter(
                (accountInfo: any) => accountInfo.currency === billObj.itemCurrencyCode
            );
        }
    }

    getDhareenaAccountList(currencyCode: any) {
        if (this.sandBox.accountList == 0) {
            this.sandBox.getAccountsList().subscribe((res: any) => {
                this.sandBox.accountList = res.data.accounts || [];
                this.accountList = this.sandBox.accountList.filter(
                    (accountInfo: any) => accountInfo.currency === currencyCode
                );
            });
        } else {
            this.accountList = this.sandBox.accountList.filter(
                (accountInfo: any) => accountInfo.currency === currencyCode
            );
        }
    }

    onPayBill(action: any) {
        const payload = {
            tinNumber: this.selectedTin,
            billNumber: this.selectedBill.itemCode,
            dueDate: this.selectedBill.itemDueDate,
            currency: this.selectedBill.itemCurrencyCode,
            debitAccountId: this.form.controls['fromAccount'].value.account_no,
            action: action,
            selectedItems: {
                itemCode: this.selectedBill.itemCode,
                itemType: this.selectedBill.itemType,
                paidAmount: this.selectedBill.itemPrice,
            },
            validateOTPRequest: {
                softTokenUser: false,
                otp: this.otp,
            },
        };
        this.sandBox.payDhareebaBill(payload).subscribe((res: any) => {
            if (action === DECISION.VERIFY) {
                this.openSidePanel(payload);
            } else {
                this.successData = payload;
                if (res.status === 'APPROVAL_REQUESTED') {
                    this.title = 'Payment request sent for approval  Request ID: #' + res.data.requestId;
                } else {
                    this.title = 'Payment request has been completed successfully';
                }
            }
        });
    }

    selectFromAccount(acc: any) {
        this.availableBalance = acc?.availableBalance;
    }

    openSidePanel(billPayload: any) {
        let fieldInfo = [
            { fieldName: 'Tin Number', fieldValue: billPayload.tinNumber },
            { fieldName: 'Bill Amount', fieldValue: billPayload.selectedItems.paidAmount },
            { fieldName: 'Currency', fieldValue: billPayload.currency },
            {
                fieldName: 'Due date',
                fieldValue: billPayload.dueDate.split(' ')[0] ? billPayload.dueDate.split(' ')[0] : '',
            },
            { fieldName: 'Bill Number', fieldValue: billPayload.billNumber },
            { fieldName: 'Account Number', fieldValue: billPayload.debitAccountId },
        ];

        let data = {
            headerName: 'Confirm Payment Summery',
            isOtpNeeded: true,
            fields: fieldInfo,
        };
        const dialogRef = this.dialog.openDrawer(data.headerName, PaymentOtpViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === DECISION.CONFIRM.toLocaleLowerCase()) {
                this.otp = result.data;
                this.onPayBill(DECISION.CONFIRM);
            }
        });
    }
}
