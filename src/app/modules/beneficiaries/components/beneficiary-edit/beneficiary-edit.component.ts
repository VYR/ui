import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';
import { BeneficiaryDialogDetailsComponent } from '../beneficiary-dialog-details/beneficiary-dialog-details.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';

@Component({
    selector: 'app-beneficiary-edit',
    templateUrl: './beneficiary-edit.component.html',
    styleUrls: ['./beneficiary-edit.component.scss'],
})
export class BeneficiaryEditComponent implements OnInit {
    public editBeneficiaryForm!: UntypedFormGroup;
    @Input() countryList: any = [];
    @Input() selectedBeneficiary: any = [];
    @Input() beneficiaryRelations: any = [];
    constructor(
        public fb: UntypedFormBuilder,
        private sandBox: BeneficiariesSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.editBeneficiaryForm = this.fb.group({
            relationshipWithBeneficiary: [this.selectedBeneficiary.relationshipWithBeneficiary],
            bankCountry: new UntypedFormControl({ value: this.selectedBeneficiary.bankCountry, disabled: true }),
            bankName: new UntypedFormControl({ value: this.selectedBeneficiary.bankName, disabled: true }),
            currency: new UntypedFormControl({ value: this.selectedBeneficiary.currency, disabled: true }),
            iban: new UntypedFormControl({ value: this.selectedBeneficiary.iban, disabled: true }),
            accountNo: new UntypedFormControl({ value: this.selectedBeneficiary.accountNo, disabled: true }),
            swiftCode: new UntypedFormControl({ value: this.selectedBeneficiary.swiftCode, disabled: true }),
            ifscCode: new UntypedFormControl({ value: this.selectedBeneficiary.ifscCode, disabled: true }),
            fedwire: new UntypedFormControl({ value: this.selectedBeneficiary.fedwire, disabled: true }),
            transitNo: new UntypedFormControl({ value: this.selectedBeneficiary.transitNo, disabled: true }),
            bsbNo: new UntypedFormControl({ value: this.selectedBeneficiary.bsbNo, disabled: true }),
            beneficiaryCity: [this.selectedBeneficiary.beneficiaryCity, [Validators.required]],
            beneficiaryCountry: [this.selectedBeneficiary.beneficiaryCountry, [Validators.required]],
            nickName: [this.selectedBeneficiary.nickName, [Validators.required]],
            beneficiaryAddress: [this.selectedBeneficiary.street, []],
        });
    }

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.countryList, 'name', 'code');
    }

    /**
     * Edit beneficiary
     */
    public okToEdit(action: string, otp?: string) {
        var payload = {
            beneficiaryId: this.selectedBeneficiary.beneficiaryId,
            relationshipWithBeneficiary: this.editBeneficiaryForm.controls['relationshipWithBeneficiary'].value,
            nickName: this.editBeneficiaryForm.controls['nickName'].value,
            street: this.editBeneficiaryForm.controls['beneficiaryAddress'].value,
            beneficiaryCity: this.editBeneficiaryForm.controls['beneficiaryCity'].value,
            beneficiaryCountry: this.getCountryName(this.editBeneficiaryForm.controls['beneficiaryCountry'].value),
            beneficiaryCountryCode: this.editBeneficiaryForm.controls['beneficiaryCountry'].value,
            action: action,
            validateOTPRequest: otp ? { softTokenUser: false, otp: otp } : {},
        };
        this.sandBox.updateBeneficiary(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                var beneficiaryData = {
                    title: 'Beneficiary Edit',
                    nickName: this.editBeneficiaryForm.controls['nickName'].value,
                    iban: this.selectedBeneficiary.iban,
                    accountNo: this.selectedBeneficiary.accountNo,
                    currency: this.selectedBeneficiary.currency,
                    bankName: this.selectedBeneficiary.bankName,
                    bankCountry: this.getCountryName(this.selectedBeneficiary.bankCountry),
                    street: this.editBeneficiaryForm.controls['beneficiaryAddress'].value,
                    beneficiaryCity: this.editBeneficiaryForm.controls['beneficiaryCity'].value,
                    beneficiaryCountry: this.getCountryName(
                        this.editBeneficiaryForm.controls['beneficiaryCountry'].value
                    ),
                };
                const dialogRef = this.dialog.openDrawer(
                    `Request Summary - ${beneficiaryData.title}`,
                    BeneficiaryDialogDetailsComponent,
                    beneficiaryData
                );
                dialogRef.afterClosed().subscribe((result: any) => {
                    if (result.event === 'confirm') {
                        this.okToEdit('CONFIRM', result.data);
                    }
                });
            } else {
                if (res.status === 'SUCCESS') {
                    this.utilService.displayNotification('Beneficiary edited successfully!', 'success');
                }
                //this.ngOnInit();
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/beneficiaries/beneficiary-list']);
                });
            }
        });
    }
}
