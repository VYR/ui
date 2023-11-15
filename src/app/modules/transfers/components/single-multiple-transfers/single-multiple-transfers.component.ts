import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormGroup,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { forkJoin, Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DECISION, SCREEN_MODE, STO_TYPE } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { TransferSandbox } from '../../transfers.sandbox';
import { SingleMultipleTransferPreviewComponent } from '../single-multiple-transfer-preview/single-multiple-transfer-preview.component';
import { SupportingDocCurrencyDialogComponent } from '../../components/supporting-doc-currency-dialog/supporting-doc-currency-dialog.component';
import { InvoiceDetailComponent } from '../../../../cib-components/invoice-detail/invoice-detail.component';

@Component({
    selector: 'app-single-multiple-transfers',
    templateUrl: './single-multiple-transfers.component.html',
    styleUrls: ['./single-multiple-transfers.component.scss'],
})
export class SingleMultipleTransfersComponent implements OnInit {
    fromAccounts: Array<any> = [];
    toAccounts: Array<any> = [];
    allAccounts: Array<any> = [];
    filteredToAccounts: Array<any> = [];
    purposeCodes: any = {};
    incomeSources: any = [];
    transfersData: Array<any> = [];
    successData: any = {};
    form!: UntypedFormGroup;
    mode: SCREEN_MODE = SCREEN_MODE.CREATE;
    SCREEN_MODE = SCREEN_MODE;
    DECISION = DECISION;
    fxCount: number = 0;
    thresholdCount: number = 0;
    draftId!: number;
    private unsubscribe$ = new Subject<void>();
    constructor(
        private sandbox: TransferSandbox,
        private fb: UntypedFormBuilder,
        private currencyPipe: CurrencyPipe,
        private dialogService: CibDialogService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.sandbox.fromAccounts.subscribe((res: any) => {
            this.fromAccounts = this._parseAccounts(res) || [];
            forkJoin([this.sandbox.getBenificiaries(), this.sandbox.getPurposeCodes(), this.sandbox.getIncomeSources()])
                .pipe(takeUntil(this.unsubscribe$), take(1))
                .subscribe((res: any) => {
                    if (!res) return;
                    this.toAccounts = this._parseAccounts(res[0].data);
                    this.toAccounts.sort((a: any, b: any) => a?.nickName?.localeCompare(b?.nickName));
                    this.purposeCodes = res[1].data;
                    this.incomeSources = res[2].data;
                    this.allAccounts = this._parseAccounts([...this.fromAccounts, ...this.toAccounts]);
                    this._subscribeToBenId();
                });
        });
    }

    private _subscribeToBenId() {
        this.route.queryParamMap.pipe(takeUntil(this.unsubscribe$), take(1)).subscribe((data: any) => {
            if (data?.params?.beneficiaryId) {
                this.prepareTransfer(data?.params?.beneficiaryId);
            } else {
                this._subscribeToDraft();
            }
        });
    }

    private prepareTransfer(benId: string) {
        this.form = this.fb.group({
            transfers: new UntypedFormArray([]),
        });
        const toAccount = this.allAccounts.filter((x: any) => x.beneficiaryId === benId)[0];
        this.pushTransferForm(
            { toAccount, transferType: toAccount.payeeType === 'WQIB' ? 'WQAR' : toAccount.payeeType },
            0
        );
    }

    private _subscribeToDraft() {
        this.sandbox.draftTransfer.subscribe((res: any) => {
            const data = res?.data || [{}];
            if (!data.length) return;
            this.draftId = res?.uid;
            this.mode = res?.data?.length > 0 ? SCREEN_MODE.EDIT : SCREEN_MODE.CREATE;
            this.form = this.fb.group({
                transfers: new UntypedFormArray([]),
            });
            data.forEach((x: any, index: number) => {
                ['fromAccount', 'toAccount'].forEach((account: string) => {
                    if (x[account] && x[account].accountNumber) {
                        x[account] = this.allAccounts.filter(
                            (y: any) => y.accountNumber === x[account].accountNumber
                        )[0];
                    }
                });
                this.pushTransferForm(x, index);
            });
        });
    }

    public pushTransferForm(data: any, index: number) {
        const transfersForm = this.form.controls['transfers'] as FormArray;
        this.filteredToAccounts[index] = this._getEligibleAccounts(data) || [];
        const selectedBen = this.filteredToAccounts[index].filter(
            (x: any) => x.accountNumber === data?.toAccount?.accountNumber
        );
        const transferForm = this.fb.group({
            transferType: [data.transferType || STO_TYPE.WQIB, Validators.required],
            fromAccount: [data.fromAccount || {}, Validators.required],
            toAccount: [selectedBen.length > 0 ? data?.toAccount : {}, Validators.required],
            amount: [data.amount, Validators.required],
            description: [
                data.description,
                [Validators.required, this.paymentDetailsValidator(/[{}\[\]\\:;`'~=@+|\^?&%#<>$!*_"]/g)],
            ],
            incomeSource: [data.incomeSource || this.incomeSources[0], Validators.required],
            chargeDetails: [data.chargeDetails],
            purpose: [data.purpose],
            invoiceNumber: [data.invoice],
        });
        transfersForm.push(transferForm);
        this.setToAccountState(index);
        this._updateFormValidations(data.transferType || STO_TYPE.WQIB, index);
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

    private _getEligibleAccounts(data: any) {
        let eligibleToAccounts: Array<any> = [];
        if (data.transferType === STO_TYPE.WQIB) {
            eligibleToAccounts = Object.assign([], this.fromAccounts);
            const index = eligibleToAccounts.indexOf(data.fromAccount);
            if (index != -1) {
                eligibleToAccounts.splice(index, 1);
                if (data?.fromAccount?.currency === 'QAR') {
                    eligibleToAccounts = eligibleToAccounts.filter((x: any) => x.currency === 'QAR');
                }
            }
        } else if (data.transferType === STO_TYPE.WQAR) {
            eligibleToAccounts = Object.assign([], this.toAccounts);
            eligibleToAccounts = eligibleToAccounts.filter(
                (x: any) =>
                    [STO_TYPE.WQIB, STO_TYPE.WQAR].includes(x.payeeType) &&
                    (data?.fromAccount?.currency === 'QAR' ? x.currency === 'QAR' : true)
            );
        } else if (data.transferType === STO_TYPE.INTL) {
            eligibleToAccounts = Object.assign([], this.toAccounts);
            eligibleToAccounts = eligibleToAccounts.filter((x: any) => x.payeeType === STO_TYPE.INTL);
        }
        return Object.assign([], eligibleToAccounts) || [];
    }
    //     Payeetype---> WQIB & currency === 'QAR', we select all toAccounts of type QAR currency. otherwise select all foreign curencies;

    // QAR to QAR work
    // QAR to USD failed
    resetToAccount(index: number) {
        const transferForm = this.getFormGroup(index);
        transferForm.controls['toAccount'].reset();
    }

    onChangeFromAccount(fromAccount: any, index: number) {
        const data = this.getFormGroup(index).value;
        data.fromAccount = fromAccount;
        this.filteredToAccounts[index] = this._getEligibleAccounts(data) || [];
        const toAccIndex = this.filteredToAccounts[index].findIndex(
            (x: any) => x.accountNumber == data?.toAccount?.accountNumber
        );
        if (toAccIndex === -1) {
            this.resetToAccount(index);
        }
        this.setToAccountState(index);
    }

    setToAccountState(index: number) {
        const form = this.getFormGroup(index) as FormGroup;
        if (this.filteredToAccounts[index].length) {
            form.controls['toAccount'].enable();
        } else {
            form.controls['toAccount'].disable();
        }
    }

    onChangeToAccount(toAccount: any, index: number) {
        const transform = this.getFormGroup(index);
        transform.controls['invoiceNumber'].reset();
        transform.controls['invoiceNumber'].clearValidators();
        transform.controls['invoiceNumber'].setErrors(null);

        if (toAccount.bankCountry === 'ID') {
            transform.addControl('invoiceNumber', '');
            transform.controls['invoiceNumber'].setValidators([Validators.required]);
            transform.updateValueAndValidity();
        }

        if (toAccount.currency === 'CNY' || toAccount.currency === 'MYR') {
            const ref = this.dialogService.openDialog(CibDialogType.small, SupportingDocCurrencyDialogComponent, {});

            ref.afterClosed().subscribe((result: any) => {
                if (result?.decision === 'CANCEL') {
                    this.resetToAccount(index);
                    return;
                }
            });
        }
    }

    onChangeTransferType(value: STO_TYPE, index: number) {
        const transferForm = this.getFormGroup(index);
        const optionalControls = [
            'fromAccount',
            'toAccount',
            'amount',
            'description',
            'incomeSource',
            'chargeDetails',
            'purpose',
            'invoiceNumber',
        ];
        optionalControls.forEach((control: string) => {
            transferForm.controls[control].reset();
            if (control === 'incomeSource') transferForm.controls[control].setValue(this.incomeSources[0]);
        });
        this.filteredToAccounts[index] = this._getEligibleAccounts(transferForm.value) || [];
        this._updateFormValidations(value, index);
    }

    private _updateFormValidations(transferType: STO_TYPE, index: number) {
        const optionalControls = ['chargeDetails', 'purpose'];
        optionalControls.forEach((control: string) => {
            if (transferType === STO_TYPE.WQIB) {
                this.getFormGroup(index).controls[control].clearValidators();
                this.getFormGroup(index).controls[control].setErrors(null);
            } else {
                this.getFormGroup(index).controls[control].setValidators([Validators.required]);
                if (transferType === STO_TYPE.WQAR && control === 'chargeDetails')
                    this.getFormGroup(index).controls[control].setValue('OUR');
            }
        });
        this.getFormGroup(index).updateValueAndValidity();
    }

    getEligibleToAccounts(index: number) {
        const { transferType, fromAccount } = this.getTransferValue(index);
        if (!fromAccount) return [];
        let eligibleToAccounts: Array<any> = [];
        if (transferType === STO_TYPE.WQIB) {
            eligibleToAccounts = Object.assign([], this.fromAccounts);
            const index = eligibleToAccounts.indexOf(fromAccount);
            if (index != -1) {
                eligibleToAccounts.splice(index, 1);
                if (fromAccount.currency === 'QAR')
                    eligibleToAccounts = eligibleToAccounts.filter((x: any) => x.currency === 'QAR');
            }
        } else {
            eligibleToAccounts = Object.assign([], this.toAccounts);
            eligibleToAccounts = eligibleToAccounts.filter((x: any) =>
                transferType === STO_TYPE.INTL
                    ? x.payeeType === STO_TYPE.INTL
                    : [STO_TYPE.WQIB, STO_TYPE.WQAR].includes(x.payeeType) && x.currency === 'QAR'
            );
        }
        return Object.assign([], eligibleToAccounts) || [];
    }

    saveTransfers() {
        const transfers = this.form.value.transfers || [];
        transfers.forEach((y: any) => {
            y.fromAccount = {
                accountNumber: y.fromAccount?.accountNumber,
            };
            y.toAccount = {
                accountNumber: y.toAccount?.accountNumber,
                currency: y.toAccount?.currency,
            };
            y.createdOn = new Date();
        });
        const payload = {
            type: transfers.length > 1 ? 'multiple' : 'single',
            data: transfers,
        };
        return this.sandbox.saveTransfers(payload).subscribe();
    }

    get transfersFormArray(): FormArray {
        return this.form.controls['transfers'] as FormArray;
    }

    getFormGroup(index: number) {
        return (this.form.controls['transfers'] as FormArray).at(index) as FormGroup;
    }

    getTransferValue(index: number) {
        const transfers = this.form.controls['transfers'] as FormArray;
        if (transfers.length) {
            return (transfers.at(index) as FormGroup).value || {};
        }
        return {};
    }

    private _parseAccounts(accounts: Array<any>) {
        accounts.map((x: any) => {
            x.balance = x.available_bal;
            x.accountNumber = x.t24_iban || x.iban || x.accountNo;
            x.description = (x.category && x.category.description) || x.nickName;
        });
        return accounts;
    }

    clear() {
        this.mode = SCREEN_MODE.CREATE;
        this.sandbox.setDraftTransfer([]);
    }

    deleteTransfer(i: number) {
        const transfers = this.form.controls['transfers'] as FormArray;
        transfers.removeAt(i);
        this.filteredToAccounts.splice(i, 1);
    }

    createTransfer(action: DECISION, request?: any) {
        if (action === DECISION.VERIFY) {
            request = this._preparePayload();
        }
        request.action = action;
        let data: any = {};
        data.transfers = request.transferData ? request.transferData : [request];
        data.hasFx = this.fxCount > 0;
        data.hasThreshold = this.thresholdCount > 0;
        this.sandbox.createTransfer(request, action)?.subscribe((res: any) => {
            if (action === DECISION.VERIFY) {
                if (data.transfers && data.transfers.length === 1) {
                    const additionalPro = res?.data?.additionalProperties || {};
                    if (additionalPro.hasOwnProperty('chargesInfoDTO')) {
                        Object.keys(additionalPro.chargesInfoDTO).forEach((key) => {
                            data.transfers[0]['charges'][key] = additionalPro.chargesInfoDTO[key];
                        });
                    }
                }
                const dialog = this.dialogService.openDrawer(
                    'Transfer Summary',
                    SingleMultipleTransferPreviewComponent,
                    { data }
                );
                dialog.afterClosed().subscribe((result: any) => {
                    if (result.action === DECISION.CONFIRM) {
                        request.validateOTPRequest = { softTokenUser: false, otp: result.otp };
                        this.createTransfer(DECISION.CONFIRM, request);
                    }
                });
            } else {
                this.successData['transfers'] = data.transfers;
                if (res.data.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.successData['confirmationSubtitle'] = 'Request ID: #' + res.data.requestId;
                    this.successData['title'] = 'YOUR TRANSFER REQUEST HAS BEEN SENT FOR APPROVAL';
                } else {
                    this.successData['confirmationSubtitle'] = 'Reference No: #' + res.data.referenceNumber;
                    this.successData['title'] = 'YOUR TRANSFER REQUEST HAS COMPLETED SUCCESSFULLY';
                }
                if (this.mode === SCREEN_MODE.EDIT && this.draftId) {
                    this.sandbox.deleteDraftsRequest(this.draftId).subscribe((res) => {
                        this.mode = SCREEN_MODE.SUCCESS;
                    });
                } else this.mode = SCREEN_MODE.SUCCESS;
            }
        });
    }

    addInvoice(index: number) {
        const transform = this.getFormGroup(index);
        const ref = this.dialogService.openDialog(CibDialogType.medium, InvoiceDetailComponent, {});
        ref.afterClosed().subscribe((res: any) => {
            if (res.event === 'confirm') {
                transform.get('invoiceNumber')?.setValue(res.invoiceNumber);
                transform.get('invoiceNumber')?.updateValueAndValidity();
            }
        });
    }

    private processPayeeType(isMultipleTransfer: boolean, transfer: any): any {
        if (!isMultipleTransfer) return transfer.transferType;
        const toAccount =
            transfer.toAccount['account_no'] ||
            transfer.toAccount['t24_iban'] ||
            transfer.toAccount['iban'] ||
            transfer.toAccount['accountNo'];
        return toAccount?.indexOf('QISB') !== -1 ? STO_TYPE.WQIB : transfer.transferType;
    }

    private _preparePayload() {
        const request = JSON.parse(JSON.stringify(this.form.value.transfers));
        let requestPayLoadList: any = [];
        this.fxCount = 0;
        this.thresholdCount = 0;
        const isMultipleTransfer = request.length > 1;
        request.forEach((transfer: any) => {
            let requestPayload: any = {};
            const purpose =
                transfer.transferType !== STO_TYPE.WQIB && transfer.purpose
                    ? this.purposeCodes[transfer.transferType].filter((x: any) => x.type === transfer.purpose)?.[0]
                    : {};
            requestPayload['payeeType'] = this.processPayeeType(isMultipleTransfer, transfer);
            requestPayload['description'] = transfer.description;
            if (transfer.fromAccount.currency === 'QAR' && transfer.toAccount.currency !== 'QAR') {
                requestPayload['fxTransaction'] = true;
                this.fxCount++;
            }
            if (transfer.fromAccount.currency === 'QAR' && transfer.toAccount.currency === 'USD') {
                requestPayload['thresholdExceeded'] = true;
                this.thresholdCount++;
            }

            if (transfer.transferType === STO_TYPE.WQIB) {
                requestPayload['transactionType'] = transfer.transferType;
            } else {
                requestPayload['beneficiaryName'] = transfer.toAccount.nickName;
                requestPayload['beneficiaryId'] = transfer.toAccount.beneficiaryId;
                requestPayload['chargeType'] = transfer.chargeDetails;
                requestPayload['purposeType'] = purpose.type;
                requestPayload['purposeValue'] = purpose.value;
                requestPayload['invoiceNumber'] = transfer.invoiceNumber;
            }
            requestPayload['sourceOfIncome'] = transfer.incomeSource;
            requestPayload['fromAccount'] =
                transfer.fromAccount['account_no'] || transfer.fromAccount['t24_iban'] || transfer.fromAccount['iban'];
            requestPayload['currency'] = transfer.toAccount.currency;
            requestPayload['amount'] = transfer.amount;
            requestPayload['toAccount'] =
                transfer.toAccount['account_no'] ||
                transfer.toAccount['t24_iban'] ||
                transfer.toAccount['iban'] ||
                transfer.toAccount['accountNo'];

            let qarEquivlanetObj: any = {};
            const creditAmount = this.currencyPipe.transform(transfer.amount, transfer.toAccount.currency, '');
            qarEquivlanetObj = this.sandbox.getQAREquivalent(creditAmount, transfer.toAccount.currency);
            let chargeDetail: any = {};
            if (transfer.fromAccount.currency === 'QAR') {
                chargeDetail.rate = qarEquivlanetObj.rate;
                chargeDetail.amount = qarEquivlanetObj.amount;
            } else {
                const fx: any = this.sandbox.forex.filter((f: any) => f.currency === transfer.fromAccount.currency)[0];
                if (fx && fx?.transferMidRate) {
                    chargeDetail.rate = fx?.transferMidRate;
                    chargeDetail.amount = qarEquivlanetObj.amount / parseFloat(fx?.transferMidRate);
                }
            }
            requestPayload['charges'] = {
                creditAmount: transfer.amount,
                creditCurrency: transfer.toAccount.currency,
                debitAmount: chargeDetail.amount,
                debitCurrency: transfer.fromAccount.currency,
            };
            if (
                transfer.fromAccount.currency !== transfer.toAccount.currency &&
                (transfer.fromAccount.currency === 'QAR' || transfer.toAccount.currency === 'QAR')
            ) {
                requestPayload.charges['exchangeRate'] = chargeDetail?.rate ? chargeDetail.rate : 1;
            }
            requestPayLoadList.push(requestPayload);
        });
        let payload: any = {};
        payload['additionalProperties'] = {};
        payload['validateOTPRequest'] = {};
        if (request.length > 1) {
            payload['transferData'] = requestPayLoadList;
        } else {
            payload = requestPayLoadList[0];
        }
        return payload;
    }

    ngOnDestroy() {
        this.mode = SCREEN_MODE.CREATE;
        this.sandbox.setDraftTransfer([]);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
