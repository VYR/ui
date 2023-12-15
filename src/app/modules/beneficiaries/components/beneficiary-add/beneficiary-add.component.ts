import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';
import { BeneficiaryDialogDetailsComponent } from '../beneficiary-dialog-details/beneficiary-dialog-details.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';

@Component({
    selector: 'app-beneficiary-add',
    templateUrl: './beneficiary-add.component.html',
    styleUrls: ['./beneficiary-add.component.scss'],
})
export class BeneficiaryAddComponent implements OnInit {
    public addBeneficiaryForm!: UntypedFormGroup;
    countryList: any = [];
    categoryList: any = [
        { id:1,name:"Biryani" },
        { id:2,name:"Dosa" },
        { id:3,name:"Meals" },
        { id:4,name:"Pickels" }
        ];
    currencyList: any = [];
    bankList: any = [];
    @Input() beneficiaryRelations: any = [];
    payeeType: string = 'INTL';
    selectedCountry!: any;
    invalidSwiftMsg: string = '';
    validSwiftMsg: string = '';
    invalidIban: boolean = true;
    invalidIbanMsg: string = '';
    validIbanMsg: string = '';
    benNameSpaceCheck: boolean = true;
    isAddBeneficiaryFormValid: boolean = false;
    showIBAN: boolean = true;
    constructor(
        private sandBox: BeneficiariesSandbox,
        public fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.addBeneficiaryForm = this.fb.group({
            relationshipWithBeneficiary: ['Business / Vendor Relationship', [Validators.required]],
            categoryId: [null, [Validators.required]],
            bankName: [null, [Validators.required]],
            bankCity: [null, [Validators.required]],
            currency: [null, [Validators.required]],
            iban: [null, [Validators.required]],
            confirmIban: [
                { value: null, disabled: this.invalidIban },
                [Validators.required, this.matchIbanAccountNo('iban')],
            ],
            ifscCode: [null, [Validators.required]],
            fedwire: [null, [Validators.required]],
            transitNo: [null, [Validators.required]],
            bsbNo: [null, [Validators.required]],
            accountNo: [null, [Validators.required]],
            confirmAccount: [
                { value: null, disabled: this.invalidIban },
                [Validators.required, this.matchIbanAccountNo('account')],
            ],
            swiftCode: [null, [Validators.required]],
            beneficiaryCity: [null, [Validators.required]],
            beneficiaryCountry: [null, [Validators.required]],
            nickName: [null, [Validators.required, this.benNameValidator(/[^a-zA-Z0-9 ]/g)]],
            street: [null, [Validators.required]],
        });

        this.addBeneficiaryForm.valueChanges.subscribe(() => {
            this.isAddBeneficiaryFormValid = false;
            if (this.addBeneficiaryForm.controls['relationshipWithBeneficiary'].invalid) return;
            if (this.addBeneficiaryForm.controls['bankCountry'].invalid) return;
            if (this.addBeneficiaryForm.controls['bankName'].invalid) return;
            if (this.addBeneficiaryForm.controls['currency'].invalid) return;
            if (this.addBeneficiaryForm.controls['beneficiaryCity'].invalid) return;
            if (this.addBeneficiaryForm.controls['beneficiaryCountry'].invalid) return;
            if (this.addBeneficiaryForm.controls['nickName'].invalid) return;
            if (this.addBeneficiaryForm.controls['street'].invalid) return;
            if (
                this.addBeneficiaryForm.controls['swiftCode'].invalid &&
                this.addBeneficiaryForm.controls['ifscCode'].invalid &&
                this.addBeneficiaryForm.controls['fedwire'].invalid &&
                this.addBeneficiaryForm.controls['transitNo'].invalid &&
                this.addBeneficiaryForm.controls['bsbNo'].invalid
            )
                return;
            if (
                this.addBeneficiaryForm.controls['iban'].invalid &&
                this.addBeneficiaryForm.controls['accountNo'].invalid
            )
                return;
            if (
                this.addBeneficiaryForm.controls['confirmIban'].invalid &&
                this.addBeneficiaryForm.controls['confirmAccount'].invalid
            )
                return;
            if (this.invalidIban) return;
            this.isAddBeneficiaryFormValid = true;
        });
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

    /** beneficiary nickname should not match the given regular expression */
    public matchIbanAccountNo(type: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const misMatch =
                    control.value !==
                    (type === 'iban'
                        ? this.addBeneficiaryForm.controls['iban'].value
                        : this.addBeneficiaryForm.controls['accountNo'].value);
                return misMatch ? { mismatch: { value: control.value } } : null;
            }
            return null;
        };
    }

    public onCountrySelected(event: any, countryObj: any) {
        // if (event.isUserInput) {
        //     this.currencyList = countryObj.currency;
        //     this.addBeneficiaryForm.controls['beneficiaryCountry'].setValue(countryObj.code);
        //     this.showIBAN = this.utilService.getNameFromList(countryObj.code, this.countryList, 'iban', 'code') === 'Y';
        //     if (countryObj.code === 'QA') {
        //         this.getBankListQatar();
        //     }
        // }
    }

    public getBankListQatar() {
        this.sandBox.getBankListQatar().subscribe((res: any) => {
            this.bankList = res.bankList;
        });
    }

    public onBankSelected(event: any, bankObj: any) {
        if (event.isUserInput) {
            this.addBeneficiaryForm.controls['swiftCode'].setValue(bankObj.swiftCode);
            if (bankObj.code === 'QISBQAQA') {
                this.payeeType = 'WQIB';
            }
            if (bankObj.code === 'QIDBQAQA') {
                this.payeeType = 'WQAR';
                this.addBeneficiaryForm.controls['currency'].setValue('QAR');
            }
            let iban: any = (this.addBeneficiaryForm.value.iban || '').trim();
            if (iban.length > 0) this.verifyIbanOrAccount(iban);
            if (bankObj.code === 'CITIQAQX') {
                this.addBeneficiaryForm.controls['currency'].setValue('USD');
            }
        }
    }

    public onCurrencySelected(event: any, currencyObj: any) {
        if (event.isUserInput) {
            if (
                this.addBeneficiaryForm.controls['bankCountry'].value === 'QA' &&
                this.addBeneficiaryForm.controls['swiftCode'].value === 'QISBQAQA'
            )
                this.payeeType = 'WQIB';
            else if (this.addBeneficiaryForm.controls['bankCountry'].value === 'QA' && currencyObj.code === 'QAR')
                this.payeeType = 'WQAR';
            else this.payeeType = 'INTL';
            this.onIBANAccountChange();
        }
    }

    public addBeneficiary(action: string, otp?: string) {
        var payload = {
            bankCountry: this.getCountryName(this.addBeneficiaryForm.controls['bankCountry'].value),
            bankCountryCode: this.addBeneficiaryForm.controls['bankCountry'].value,
            bankCity: this.addBeneficiaryForm.controls['bankCity'].value,
            bankName: this.addBeneficiaryForm.controls['bankName'].value,
            currency: this.addBeneficiaryForm.controls['currency'].value,
            iban: this.addBeneficiaryForm.controls['iban'].value,
            ifscCode: this.addBeneficiaryForm.controls['ifscCode'].value,
            fedwire: this.addBeneficiaryForm.controls['fedwire'].value,
            transitNo: this.addBeneficiaryForm.controls['transitNo'].value,
            bsbNo: this.addBeneficiaryForm.controls['bsbNo'].value,
            accountNo: this.addBeneficiaryForm.controls[this.payeeType == 'WQIB' ? 'iban' : 'accountNo'].value,
            swiftCode: this.addBeneficiaryForm.controls['swiftCode'].value,
            relationshipWithBeneficiary: this.addBeneficiaryForm.controls['relationshipWithBeneficiary'].value,
            nickName: this.addBeneficiaryForm.controls['nickName'].value,
            street: this.addBeneficiaryForm.controls['street'].value,
            beneficiaryCity: this.addBeneficiaryForm.controls['beneficiaryCity'].value,
            beneficiaryCountry: this.getCountryName(this.addBeneficiaryForm.controls['beneficiaryCountry'].value),
            beneficiaryCountryCode: this.addBeneficiaryForm.controls['beneficiaryCountry'].value,
            payeeType: this.payeeType,
            action: action,
            validateOTPRequest: otp ? { softTokenUser: false, otp: otp } : {},
        };
        this.sandBox.addBeneficiary(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                var beneficiaryData = {
                    title: 'Beneficiary Create',
                    nickName: this.addBeneficiaryForm.controls['nickName'].value,
                    iban: this.addBeneficiaryForm.controls['iban'].value,
                    accountNo: this.addBeneficiaryForm.controls[this.payeeType == 'WQIB' ? 'iban' : 'accountNo'].value,
                    currency: this.addBeneficiaryForm.controls['currency'].value,
                    bankName: this.addBeneficiaryForm.controls['bankName'].value,
                    bankCountry: this.getCountryName(this.addBeneficiaryForm.controls['bankCountry'].value),
                    ifscCode: this.addBeneficiaryForm.controls['ifscCode'].value,
                    fedwire: this.addBeneficiaryForm.controls['fedwire'].value,
                    transitNo: this.addBeneficiaryForm.controls['transitNo'].value,
                    bsbNo: this.addBeneficiaryForm.controls['bsbNo'].value,
                    swiftCode: this.addBeneficiaryForm.controls['swiftCode'].value,
                    street: this.addBeneficiaryForm.controls['street'].value,
                    beneficiaryCity: this.addBeneficiaryForm.controls['beneficiaryCity'].value,
                    beneficiaryCountry: this.getCountryName(
                        this.addBeneficiaryForm.controls['beneficiaryCountry'].value
                    ),
                };
                const dialogRef = this.dialog.openDrawer(
                    `Request Summary - ${beneficiaryData.title}`,
                    BeneficiaryDialogDetailsComponent,
                    beneficiaryData
                );
                dialogRef.afterClosed().subscribe((result: any) => {
                    if (result.event === 'confirm') {
                        this.addBeneficiary('CONFIRM', result.data);
                    }
                });
            } else {
                if (res.status === 'SUCCESS') {
                    this.utilService.displayNotification('Beneficiary added successfully!', 'success');
                }
                //this.ngOnInit();
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/beneficiaries/beneficiary-list']);
                });
            }
        });
    }

    public onSwiftCodeChange() {
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.addBeneficiaryForm.controls['bankName'].reset();
        this.addBeneficiaryForm.controls['bankCity'].reset();
    }

    public onIBANAccountChange() {
        this.invalidIban = true;
        this.invalidIbanMsg = '';
        this.validIbanMsg = '';
        this.addBeneficiaryForm.controls['confirmIban'].reset();
        this.addBeneficiaryForm.controls['confirmAccount'].reset();
    }

    public reset() {
        this.addBeneficiaryForm.reset();
        this.payeeType = 'INTL';
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.invalidIbanMsg = '';
        this.validIbanMsg = '';
        this.invalidIban = true;
        this.benNameSpaceCheck = true;
        this.showIBAN = true;
    }

    public goBack() {
        this.router.navigate(['home/beneficiaries/beneficiary-list']);
    }

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.countryList, 'name', 'code');
    }

    public validateSwiftCode(swiftCode: string) {
        this.invalidSwiftMsg = '';
        this.validSwiftMsg = '';
        this.addBeneficiaryForm.controls['bankName'].reset();
        this.addBeneficiaryForm.controls['bankCity'].reset();
        this.sandBox.validateSwiftCode({ swiftCode: swiftCode.toUpperCase() }).subscribe((res: any) => {
            if (res.data.length === 0) {
                this.invalidSwiftMsg = 'No bank details found for swift code';
            } else {
                this.validSwiftMsg = 'Bank details found for swift code';
                const swiftData = res.data;
                this.addBeneficiaryForm.controls['bankCity'].setValue(swiftData.city);
                this.addBeneficiaryForm.controls['bankName'].setValue(swiftData.institution);
            }
        });
    }

    public verifyIbanOrAccount(accountNo: string) {
        this.invalidIban = true;
        this.invalidIbanMsg = '';
        this.validIbanMsg = '';
        this.addBeneficiaryForm.controls['confirmIban'].reset();
        this.addBeneficiaryForm.controls['confirmAccount'].reset();
        const formData = this.addBeneficiaryForm.value;
        let params: any = { iban: accountNo.replace(/\s/g, '') };
        if (formData.currency) params['currency'] = formData.currency;
        this.sandBox.verifyIbanOrAccount(params).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.invalidIbanMsg = 'Beneficiary with this IBAN/Account already Exist';
            } else {
                const formData = this.addBeneficiaryForm.value;
                let selectedBanks: Array<any> = this.bankList.filter((x: any) => x.name === formData.bankName);
                if (selectedBanks.length > 0) {
                    //Get first 4 characters of swiftCode
                    const chars = selectedBanks[0].swiftCode.slice(0, 4);
                    if (accountNo?.indexOf(chars) === -1) {
                        this.invalidIbanMsg = 'The IBAN number does not match the selected bank';
                        return;
                    }
                }
                this.invalidIban = false;
                this.addBeneficiaryForm.controls['confirmIban'].enable();
                this.addBeneficiaryForm.controls['confirmAccount'].enable();
                this.validIbanMsg = 'IBAN/Account available to be added';
            }
        });
    }
}
