import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { AccountsSandbox } from '../../accounts/accounts.sandbox';
import { BeneficiariesSandbox } from '../../beneficiaries/beneficiaries.sandbox';
import { FtDetailsComponent } from '../ft-details/ft-details.component';
import { FutureDatedTransferSandbox } from '../future-dated-transfers.sandbox';
import { Router } from '@angular/router';
import { STO_TYPE } from '../../../shared/enums';
import { STO_RECURRING } from '../../../shared/enums';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SupportingDocCurrencyDialogComponent } from '../../transfers/components/supporting-doc-currency-dialog/supporting-doc-currency-dialog.component';
import { InvoiceDetailComponent } from '../../../cib-components/invoice-detail/invoice-detail.component';

@Component({
    selector: 'app-create-future-transfers',
    templateUrl: './create-future-transfers.component.html',
    styleUrls: ['./create-future-transfers.component.scss'],
})
export class CreateFutureTransfersComponent implements OnInit {
    @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
    transferType: string = '';
    createSTOForm: FormGroup = new FormGroup({});
    fromAccounts: any[] = [];
    fromAccount: any;
    toWithinAccounts: any[] = [];
    toWithinAccountsFilter: any = [];
    toAccounts: any[] = [];
    toAccountsFilter: any = [];
    benList: any[] = [];
    toAccount: any;
    recurrings: any[] = [
        {
            display: 'One time',
            code: STO_RECURRING.ONETIME,
        },
        {
            display: 'Recurring',
            code: STO_RECURRING.RECURRING,
        },
    ];
    recurring = '';

    execTimes: any[] = [];
    minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
    startDateLabel = 'Transfer Date';
    startDate = null;

    frequencies: any[] = [];
    purposeCodesList: any;
    purposeCodes: any;

    timeFreq: any;
    chargeDetails: string = '';

    showConfirmation = false;
    transactionId!: string;
    transactionMsg!: string;
    successData: any;
    resetToAccount = false;
    //loaded = false;

    constructor(
        private _formBuilder: FormBuilder,
        private accountSB: AccountsSandbox,
        private benSB: BeneficiariesSandbox,
        private fdtSB: FutureDatedTransferSandbox,
        private dialog: CibDialogService,
        private cdRef: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initForm();

        const services: Observable<any> = forkJoin([
            this.accountSB.getAccountsList('TRANSFER_ACCOUNTS'),
            this.benSB.getBeneficiaryList(),
            this.fdtSB.getPurposeCodes(),
            this.fdtSB.getTimeFreq(),
        ]).pipe(
            map(([acc, bens, pc, tf]) => {
                return { acc, bens, pc, tf };
            })
        );

        services.subscribe((res) => {
            const accounts: any = res.acc?.data?.accounts || [];
            const bens: any = res.bens?.data;
            this.toWithinAccounts = this.toWithinAccountsFilter = this.fromAccounts = accounts;
            this.toAccounts =
                this.toAccountsFilter =
                this.benList =
                    bens.sort((a: any, b: any) => a?.nickName?.localeCompare(b?.nickName));
            this.purposeCodesList = res.pc;
            this.timeFreq = res.tf;

            this.execTimes = this.timeFreq.time;
            this.frequencies = this.timeFreq.frequency;
        });
    }

    ngAfterViewInit() {
        if (this.tabGroup._allTabs.first?.textLabel === 'Within Account') {
            this.transferType = STO_TYPE.WQIB;
            this.cdRef.detectChanges();
        } else if (this.tabGroup._allTabs.first?.textLabel === 'Within Qatar') {
            this.transferType = STO_TYPE.WQAR;
            this.createSTOForm.controls['chargeDetails'].setValidators(Validators.required);
            this.createSTOForm.controls['purpose'].setValidators(Validators.required);
            this.cdRef.detectChanges();
        } else if (this.tabGroup._allTabs.first?.textLabel === 'International') {
            this.transferType = STO_TYPE.INTL;
            this.createSTOForm.controls['chargeDetails'].setValidators(Validators.required);
            this.createSTOForm.controls['purpose'].setValidators(Validators.required);
            this.cdRef.detectChanges();
        } else {
            this.router.navigate(['home/future-dated-transfers/sto-authorized']);
        }
    }

    initForm() {
        this.createSTOForm = this._formBuilder.group({
            fromAccount: [null, Validators.required],
            toAccount: [null, Validators.required],
            currency: [null, Validators.required],
            amount: [null, Validators.required],
            recurring: [null, Validators.required],
            startDate: [this.startDate, Validators.required],
            execTime: [null, Validators.required],
            description: [
                null,
                [Validators.required, this.paymentDetailsValidator(/[{}\[\]\\:;`'~=@+|\^?&%#<>$!*_"]/g)],
            ],
            chargeDetails: [null],
            purpose: [null],
            invoiceNumber: [null],
        });
    }

    /** payment details should not match the given regular expression */
    public paymentDetailsValidator(pattrn: RegExp): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const forbiddenPattern = pattrn.test(control.value);
                return forbiddenPattern ? { forbiddenDescription: { value: control.value } } : null;
            }
            return null;
        };
    }

    typeChange(ev: MatTabChangeEvent) {
        this.createSTOForm.reset();
        if (ev.tab.textLabel === 'Within Account') {
            this.transferType = STO_TYPE.WQIB;
            this.toAccounts = this.toAccountsFilter = this.benList.filter((acc) => {
                return (
                    acc.payeeType === STO_TYPE.WQAR ||
                    acc.payeeType === STO_TYPE.WQIB ||
                    acc.payeeType === STO_TYPE.INTL
                );
            });
            this.createSTOForm.controls['chargeDetails'].clearValidators();
            this.createSTOForm.controls['chargeDetails'].setErrors(null);
            this.createSTOForm.controls['purpose'].clearValidators();
            this.createSTOForm.controls['purpose'].setErrors(null);
        } else if (ev.tab.textLabel === 'Within Qatar') {
            this.transferType = STO_TYPE.WQAR;
            this.toAccounts = this.toAccountsFilter = this.benList.filter((acc) => {
                return acc.payeeType === STO_TYPE.WQAR || acc.payeeType === STO_TYPE.WQIB;
            });
            this.purposeCodes = this.purposeCodesList?.data?.WQAR;
            this.createSTOForm.controls['chargeDetails'].setValidators(Validators.required);
            this.createSTOForm.controls['chargeDetails'].setValue('OUR');
            this.createSTOForm.controls['purpose'].setValidators(Validators.required);
        } else if (ev.tab.textLabel === 'International') {
            this.transferType = STO_TYPE.INTL;
            this.toAccounts = this.toAccountsFilter = this.benList.filter((acc) => acc.payeeType === STO_TYPE.INTL);
            this.purposeCodes = this.purposeCodesList?.data?.INTL;
            this.createSTOForm.controls['chargeDetails'].setValidators(Validators.required);
            this.createSTOForm.controls['purpose'].setValidators(Validators.required);
        }
    }

    selectFromAccount(selectedAccount: any) {
        this.fromAccount = selectedAccount;
        this.toAccount = null;
        this.createSTOForm.get('toAccount')?.reset();
        if (this.transferType === STO_TYPE.WQIB) {
            this.toWithinAccounts = this.toWithinAccountsFilter.filter(
                (acc: any) =>
                    acc.account_no !== selectedAccount.account_no &&
                    !(selectedAccount.currency === 'QAR' && acc.currency !== 'QAR')
            );
        } else if (this.transferType === STO_TYPE.WQAR) {
            this.toAccounts = this.toAccountsFilter.filter((x: any) =>
                selectedAccount.currency === 'QAR' ? x.currency === 'QAR' : true
            );
        }
    }

    selectToAccount(selectedAccount: any) {
        this.toAccount = selectedAccount;
        this.createSTOForm.controls['invoiceNumber'].clearValidators();
        this.createSTOForm.controls['invoiceNumber'].setErrors(null);

        if (this.toAccount.bankCountry === 'ID') {
            this.createSTOForm.addControl('invoiceNumber', new FormControl('', Validators.required));
        }

        if (this.toAccount.currency === 'CNY' || this.toAccount.currency === 'MYR') {
            const ref = this.dialog.openDialog(CibDialogType.small, SupportingDocCurrencyDialogComponent, {});

            ref.afterClosed().subscribe((result: any) => {
                if (result?.decision === 'CANCEL') {
                    this.resetToAccount = !this.resetToAccount;
                    return;
                }
            });
        }
        this.createSTOForm.get('currency')?.setValue(selectedAccount.currency);
    }

    selectRecurring(event: MatSelectChange) {
        this.recurring = event.value;
        if (this.recurring === STO_RECURRING.RECURRING) {
            this.createSTOForm.addControl('frequency', new FormControl('', Validators.required));
            this.createSTOForm.addControl('occurence', new FormControl('', Validators.required));
            this.startDateLabel = 'Start Date';
        } else if (this.recurring === STO_RECURRING.ONETIME) {
            this.createSTOForm.removeControl('frequency');
            this.createSTOForm.removeControl('occurence');
            this.startDateLabel = 'Transfer Date';
        }
    }

    createSTO(action: string) {
        const payload: any = {
            additionalProperties: {},
            action: action,
            validateOTPRequest: {},
            fromAccount: this.fromAccount?.t24_iban || this.fromAccount?.account_no || this.fromAccount?.iban,
            amount: this.createSTOForm.get('amount')?.value,
            currency: this.createSTOForm.get('currency')?.value,
            recurring: this.recurring,
            startDate: this.startDate,
            execTime: this.createSTOForm.get('execTime')?.value.name,
            description: this.createSTOForm.get('description')?.value,
            thresholdExceeded: false,
            fxTransaction: false,
            toAccount:
                this.toAccount?.t24_iban ||
                this.toAccount?.account_no ||
                this.toAccount?.accountNo ||
                this.toAccount?.iban,
            occurrence: this.recurring === STO_RECURRING.RECURRING ? this.createSTOForm.get('occurence')?.value : 1,
        };

        if (this.recurring === STO_RECURRING.RECURRING) {
            payload['frequency'] = this.createSTOForm.get('frequency')?.value.name.toUpperCase();
        }

        let pathVar: string = '';
        if (this.transferType === STO_TYPE.WQIB) {
            payload['transactionType'] = this.transferType;
            pathVar = 'wqib?stoType=wacc';
        } else {
            payload['payeeType'] = this.transferType;
            payload['beneficiaryName'] = this.toAccount?.nickName;
            payload['beneficiaryId'] = this.toAccount?.beneficiaryId;
            payload['chargeType'] = this.createSTOForm.get('chargeDetails')?.value;
            payload['purposeType'] = this.createSTOForm.get('purpose')?.value.type;
            payload['purposeValue'] = this.createSTOForm.get('purpose')?.value.value;
            payload['invoiceNumber'] = this.createSTOForm.get('invoiceNumber')?.value;

            if (this.transferType === STO_TYPE.WQAR) {
                pathVar = 'wqar';
                if (this.toAccount?.iban.includes('QISB')) {
                    pathVar = 'wqib?stoType=wacc';
                }
            } else {
                payload['thresholdExceeded'] =
                    this.fromAccount?.currency === 'QAR' && this.toAccount?.currency === 'USD';
                payload['fxTransaction'] = this.fromAccount?.currency === 'QAR' && this.toAccount?.currency !== 'QAR';
                pathVar = 'intl';
            }
        }

        this.fdtSB.verifySTO(payload, pathVar).subscribe((res: any) => {
            // On success show side panel
            let data = {
                headerName: 'TRANSACTION SUMMARY',
                isOtpNeeded: true,
                pathVar: pathVar,
                fields: payload,
            };

            const ref = this.dialog.openDrawer(data.headerName, FtDetailsComponent, data);
            ref.afterClosed().subscribe((res: any) => {
                if (res.event === 'confirm') {
                    if (res?.data?.data?.requestId || res?.data?.data?.status === 'APPROVAL_REQUESTED') {
                        this.transactionId = 'Request ID: #' + res?.data?.data?.requestId;
                        this.transactionMsg = 'YOUR TRANSFER REQUEST HAS BEEN SENT FOR APPROVAL';
                    } else {
                        this.transactionId = 'Reference No: #' + res?.data?.data?.referenceNumber;
                        this.transactionMsg = 'YOUR TRANSFER REQUEST HAS COMPLETED SUCCESSFULLY';
                    }
                    this.successData = payload;
                    this.showConfirmation = true;
                }
            });
        });
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    resetView() {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['home/future-dated-transfers/create-sto']);
        });
    }

    addInvoice() {
        const ref = this.dialog.openDialog(CibDialogType.medium, InvoiceDetailComponent, {});
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                this.createSTOForm.get('invoiceNumber')?.setValue(res.invoiceNumber);
                this.createSTOForm.get('invoiceNumber')?.updateValueAndValidity();
            }
        });
    }
}
