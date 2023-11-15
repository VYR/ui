import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ManualTransfersSandbox } from '../../manual-transfers.sandbox';
import { UtilService } from 'src/app/utility';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-manual-transfer-add',
    templateUrl: './create-manual-transfer.component.html',
    styleUrls: ['./create-manual-transfer.component.scss'],
})
export class CreateManualTransferComponent implements OnInit, OnDestroy {
    public addManualTransferForm!: UntypedFormGroup;
    payeeType: string = 'INTL';
    fromAccountCurrency: string = '';
    countryList: any = [];
    currencyList: any = [];
    bankList: any = [];
    beneficiaryRelations: any = [];
    fromAccounts: any = [];
    selectedCountry!: any;
    purposeCodes: any = {};
    incomeSources: any = [];
    invalidSwiftMsg: string = '';
    validSwiftMsg: string = '';
    benNameSpaceCheck: boolean = true;
    isAddManualTransferFormValid: boolean = false;
    showIBAN: boolean = true;
    amountInWords: string = '';
    manualTransferData: any;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private sandBox: ManualTransfersSandbox,
        public fb: UntypedFormBuilder,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit() {
        this.sandBox.manualTransferData
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((manualTransferData) => (this.manualTransferData = manualTransferData));

        this.sandBox.getFromAccountsList().subscribe((res: any) => {
            this.fromAccounts = this._parseAccounts(res.data.accounts) || [];
            forkJoin([
                this.sandBox.getCountryList(),
                this.sandBox.getManualTransferRelations(),
                this.sandBox.getPurposeCodes(),
                this.sandBox.getIncomeSources(),
            ]).subscribe((res: any) => {
                if (!res) return;
                this.countryList = res[0].countries;
                this.beneficiaryRelations = res[1].relations;
                this.purposeCodes = res[2].data;
                this.incomeSources = res[3].data;

                // set from account and purpose in edit
                if (this.manualTransferData) {
                    this.addManualTransferForm.controls['fromAccount'].setValue(
                        this.fromAccounts.find(
                            (accountObj: any) => accountObj['account_no'] === this.manualTransferData.fromAccount
                        )
                    );
                    this.fromAccountCurrency = this.manualTransferData.fromAccountCurr;
                    this.amountInWords = this.manualTransferData.amountInWords;
                    this.payeeType = this.manualTransferData.payeeType;
                    this.showIBAN =
                        this.utilService.getNameFromList(
                            this.manualTransferData.bankCountryCode,
                            this.countryList,
                            'iban',
                            'code'
                        ) === 'Y';
                    this.currencyList = this.utilService.getNameFromList(
                        this.manualTransferData.bankCountryCode,
                        this.countryList,
                        'currency',
                        'code'
                    );
                    this.addManualTransferForm.controls['currency'].setValue(this.manualTransferData.currency);
                    if (this.payeeType !== 'WQIB') {
                        const purposeCodes = this.purposeCodes[this.payeeType];
                        this.addManualTransferForm.controls['purpose'].setValue(
                            purposeCodes.find(
                                (purposeObj: any) => purposeObj['type'] === this.manualTransferData.purposeCode
                            )
                        );
                    }
                }
            });
        });

        this.addManualTransferForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
            relationshipWithBeneficiary: [
                this.manualTransferData
                    ? this.manualTransferData.relationshipWithBeneficiary
                    : 'Business / Vendor Relationship',
                [Validators.required],
            ],
            incomeSource: [
                this.manualTransferData ? this.manualTransferData.sourceOfIncome : 'Business income',
                [Validators.required],
            ],
            chargeDetails: [this.manualTransferData ? this.manualTransferData.chargeType : null],
            bankCountry: [
                this.manualTransferData ? this.manualTransferData.bankCountryCode : null,
                [Validators.required],
            ],
            bankName: [this.manualTransferData ? this.manualTransferData.bankName : null, [Validators.required]],
            bankCity: [this.manualTransferData ? this.manualTransferData.bankCity : null, [Validators.required]],
            currency: [null, [Validators.required]],
            amount: [this.manualTransferData ? this.manualTransferData.amount : null, [Validators.required]],
            purpose: [null],
            iban: [this.manualTransferData ? this.manualTransferData.toAccount : null, [Validators.required]],
            ifscCode: [
                this.manualTransferData && this.manualTransferData.bankCountryCode === 'IN'
                    ? this.manualTransferData.bic
                    : null,
                [Validators.required],
            ],
            fedwire: [
                this.manualTransferData && this.manualTransferData.bankCountryCode === 'US'
                    ? this.manualTransferData.bic
                    : null,
                [Validators.required],
            ],
            transitNo: [
                this.manualTransferData && this.manualTransferData.bankCountryCode === 'CA'
                    ? this.manualTransferData.bic
                    : null,
                [Validators.required],
            ],
            bsbNo: [
                this.manualTransferData && this.manualTransferData.bankCountryCode === 'AU'
                    ? this.manualTransferData.bic
                    : null,
                [Validators.required],
            ],
            accountNo: [this.manualTransferData ? this.manualTransferData.toAccount : null, [Validators.required]],
            swiftCode: [this.manualTransferData ? this.manualTransferData.swiftCode : null, [Validators.required]],
            beneficiaryCity: [
                this.manualTransferData ? this.manualTransferData.beneficiaryCity : null,
                [Validators.required],
            ],
            beneficiaryCountry: [
                this.manualTransferData ? this.manualTransferData.beneficiaryCountryCode : null,
                [Validators.required],
            ],
            nickName: [
                this.manualTransferData ? this.manualTransferData.nickName : null,
                [Validators.required, this.benNameValidator(/[^a-zA-Z0-9 ]/g)],
            ],
            street: [this.manualTransferData ? this.manualTransferData.street : null, [Validators.required]],
            paymentDetails: [
                this.manualTransferData ? this.manualTransferData.detailsOfPayment : null,
                [Validators.required],
            ],
        });

        this.addManualTransferForm.valueChanges.subscribe(() => {
            this.isAddManualTransferFormValid = false;
            if (this.addManualTransferForm.controls['fromAccount'].invalid) return;
            if (this.addManualTransferForm.controls['relationshipWithBeneficiary'].invalid) return;
            if (this.addManualTransferForm.controls['incomeSource'].invalid) return;
            if (this.addManualTransferForm.controls['bankCountry'].invalid) return;
            if (this.addManualTransferForm.controls['bankCity'].invalid) return;
            if (this.addManualTransferForm.controls['bankName'].invalid) return;
            if (this.addManualTransferForm.controls['currency'].invalid) return;
            if (this.addManualTransferForm.controls['amount'].invalid) return;
            if (this.addManualTransferForm.controls['beneficiaryCity'].invalid) return;
            if (this.addManualTransferForm.controls['beneficiaryCountry'].invalid) return;
            if (this.addManualTransferForm.controls['nickName'].invalid) return;
            if (this.addManualTransferForm.controls['street'].invalid) return;
            if (
                this.addManualTransferForm.controls['swiftCode'].invalid &&
                this.addManualTransferForm.controls['ifscCode'].invalid &&
                this.addManualTransferForm.controls['fedwire'].invalid &&
                this.addManualTransferForm.controls['transitNo'].invalid &&
                this.addManualTransferForm.controls['bsbNo'].invalid
            )
                return;
            if (
                this.addManualTransferForm.controls['iban'].invalid &&
                this.addManualTransferForm.controls['accountNo'].invalid
            )
                return;
            this.isAddManualTransferFormValid = true;
        });
    }

    onChangeFromAccount(ev: any) {
        this.fromAccountCurrency = ev.currency;
    }

    /** beneficiary nickname should not match the given regular expression */
    public benNameValidator(pattrn: RegExp): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const crossedMaxLength = control.value.length > (this.payeeType === 'INTL' ? 66 : 55);
                if (crossedMaxLength) return { forbiddenLength: { value: control.value } };
                const hasNoSpace =
                    control.value.indexOf(' ') === -1 || control.value.indexOf(' ') === control.value.length - 1;
                const forbiddenPattern = pattrn.test(control.value);
                return forbiddenPattern || hasNoSpace ? { forbiddenName: { value: control.value } } : null;
            }
            return null;
        };
    }

    private _parseAccounts(accounts: Array<any>) {
        accounts.map((x: any) => {
            x.balance = x.available_bal;
            x.accountNumber = x.t24_iban || x.iban || x.accountNo;
            x.description = (x.category && x.category.description) || x.nickName;
        });
        return accounts;
    }

    public onCountrySelected(event: any, countryObj: any) {
        if (event.isUserInput) {
            this.currencyList = countryObj.currency;
            this.addManualTransferForm.controls['beneficiaryCountry'].setValue(countryObj.code);
            this.showIBAN = this.utilService.getNameFromList(countryObj.code, this.countryList, 'iban', 'code') === 'Y';
            if (countryObj.code === 'QA') {
                this.getBankListQatar();
            }
        }
    }

    public getBankListQatar() {
        this.sandBox.getBankListQatar().subscribe((res: any) => {
            this.bankList = res.bankList;
        });
    }

    public onBankSelected(event: any, bankObj: any) {
        if (event.isUserInput) {
            this.addManualTransferForm.controls['chargeDetails'].clearValidators();
            this.addManualTransferForm.controls['chargeDetails'].setErrors(null);
            this.addManualTransferForm.controls['purpose'].clearValidators();
            this.addManualTransferForm.controls['purpose'].setErrors(null);
            this.addManualTransferForm.controls['swiftCode'].setValue(bankObj.swiftCode);
            if (bankObj.code === 'QISBQAQA') {
                this.payeeType = 'WQIB';
            }
            if (bankObj.code === 'QIDBQAQA') {
                this.addManualTransferForm.controls['chargeDetails'].setValidators(Validators.required);
                this.addManualTransferForm.controls['chargeDetails'].setValue('OUR');
                this.addManualTransferForm.controls['purpose'].setValidators(Validators.required);
                this.payeeType = 'WQAR';
                this.addManualTransferForm.controls['currency'].setValue('QAR');
            }
        }
    }

    public onCurrencySelected(event: any, currencyObj: any) {
        if (event.isUserInput) {
            this.addManualTransferForm.controls['chargeDetails'].clearValidators();
            this.addManualTransferForm.controls['chargeDetails'].setErrors(null);
            this.addManualTransferForm.controls['purpose'].clearValidators();
            this.addManualTransferForm.controls['purpose'].setErrors(null);
            if (
                this.addManualTransferForm.controls['bankCountry'].value === 'QA' &&
                this.addManualTransferForm.controls['swiftCode'].value === 'QISBQAQA'
            )
                this.payeeType = 'WQIB';
            else if (this.addManualTransferForm.controls['bankCountry'].value === 'QA' && currencyObj.code === 'QAR') {
                this.addManualTransferForm.controls['chargeDetails'].setValidators(Validators.required);
                this.addManualTransferForm.controls['chargeDetails'].setValue('OUR');
                this.addManualTransferForm.controls['purpose'].setValidators(Validators.required);
                this.payeeType = 'WQAR';
            } else {
                this.addManualTransferForm.controls['chargeDetails'].setValidators(Validators.required);
                this.addManualTransferForm.controls['purpose'].setValidators(Validators.required);
                this.payeeType = 'INTL';
            }
        }
    }

    public addManualTransfer() {
        var payload = {
            amount: this.addManualTransferForm.controls['amount'].value,
            bankCity: this.addManualTransferForm.controls['bankCity'].value,
            bankCountryCode: this.addManualTransferForm.controls['bankCountry'].value,
            bankCountry: this.getCountryName(this.addManualTransferForm.controls['bankCountry'].value),
            bankName: this.addManualTransferForm.controls['bankName'].value,
            beneficiaryCity: this.addManualTransferForm.controls['beneficiaryCity'].value,
            beneficiaryCountry: this.getCountryName(this.addManualTransferForm.controls['beneficiaryCountry'].value),
            beneficiaryCountryCode: this.addManualTransferForm.controls['beneficiaryCountry'].value,
            chargeType: this.addManualTransferForm.controls['chargeDetails'].value,
            currency: this.addManualTransferForm.controls['currency'].value,
            fromAccount: this.addManualTransferForm.controls['fromAccount'].value?.account_no,
            fromAccountCurr: this.fromAccountCurrency,
            nickName: this.addManualTransferForm.controls['nickName'].value,
            purposeOfPayment: this.addManualTransferForm.controls['purpose'].value?.value,
            purposeCode: this.addManualTransferForm.controls['purpose'].value?.type,
            street: this.addManualTransferForm.controls['street'].value,
            relationshipWithBeneficiary: this.addManualTransferForm.controls['relationshipWithBeneficiary'].value,
            sourceOfIncome: this.addManualTransferForm.controls['incomeSource'].value,
            swiftCode: this.addManualTransferForm.controls['swiftCode'].value,
            amountInWords: this.amountInWords,
            detailsOfPayment: this.addManualTransferForm.controls['paymentDetails'].value,
            bic:
                this.addManualTransferForm.controls['ifscCode'].value ||
                this.addManualTransferForm.controls['fedwire'].value ||
                this.addManualTransferForm.controls['transitNo'].value ||
                this.addManualTransferForm.controls['bsbNo'].value ||
                this.addManualTransferForm.controls['swiftCode'].value,
            toAccount: this.showIBAN
                ? this.addManualTransferForm.controls['iban'].value
                : this.addManualTransferForm.controls['accountNo'].value,
            payeeType: this.payeeType,
        };
        this.sandBox.addManualTransfer({ simpleTransferBeanList: [payload] }).subscribe((res: any) => {
            this.utilService.displayNotification('Manual Transfer created successfully!', 'success');
            this.router.navigate(['home/manual-transfers/manual-transfer-list']);
        });
    }

    public onSwiftCodeChange() {
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.addManualTransferForm.controls['bankName'].reset();
        this.addManualTransferForm.controls['bankCity'].reset();
    }

    public reset() {
        this.addManualTransferForm.reset();
        this.payeeType = 'INTL';
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.benNameSpaceCheck = true;
        this.showIBAN = true;
    }

    public goBack() {
        this.router.navigate(['home/manual-transfers/manual-transfer-list']);
    }

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.countryList, 'name', 'code');
    }

    public validateSwiftCode(swiftCode: string) {
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.addManualTransferForm.controls['bankName'].reset();
        this.addManualTransferForm.controls['bankCity'].reset();
        this.sandBox.validateSwiftCode({ swiftCode: swiftCode.toUpperCase() }).subscribe((res: any) => {
            if (res.data.length === 0) {
                this.invalidSwiftMsg = 'No bank details found for swift code';
            } else {
                this.validSwiftMsg = 'Bank details found for swift code';
                const swiftData = res.data;
                this.addManualTransferForm.controls['bankCity'].setValue(swiftData.city);
                this.addManualTransferForm.controls['bankName'].setValue(swiftData.institution);
            }
        });
    }

    ngOnDestroy() {
        this.sandBox.setManualTransferData(null);
        this.unsubscribe$.unsubscribe();
    }
}
