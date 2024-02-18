import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
    UntypedFormControl,
} from '@angular/forms';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { UtilService } from 'src/app/utility';
import { UserContext } from 'src/app/shared/models';
import { DECISION } from 'src/app/shared/enums';
import { SuperEmployeeSandbox } from '../../super-empolyee.sandbox';
@Component({
  selector: 'app-sgs-update-user',
  templateUrl: './sgs-update-user.component.html',
  styleUrls: ['./sgs-update-user.component.scss']
})
export class SgsUpdateUserComponent implements OnInit {

    DECISION=DECISION;
  constructor(public dialogRef: MatDialogRef<SgsUpdateUserComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sandBox: SuperEmployeeSandbox,
        public fb: UntypedFormBuilder,
        private dialog: SgsDialogService,
        private router: Router,
        private utilService: UtilService
    ) {
        console.log(this.data.data);
    }

    ngOnInit(): void {
        this.updateUserForm = this.fb.group({
            schemeType: new UntypedFormControl({ value: 1, disabled: true }),
            firstName: new UntypedFormControl({ value: this.data.data.firstName, disabled: this.data.mode === DECISION.VIEW }),
            lastName: new UntypedFormControl({ value: this.data.data.lastName, disabled: this.data.mode === DECISION.VIEW }),
            email: new UntypedFormControl({ value: this.data.data.email, disabled: this.data.mode === DECISION.VIEW }),
            mobilePhone: new UntypedFormControl({ value: this.data.data.mobilePhone, disabled: this.data.mode === DECISION.VIEW }),
            individualCommission: new UntypedFormControl({ value: this.data.data.individualCommission, disabled: this.data.mode === DECISION.VIEW }),
            groupCommission: new UntypedFormControl({ value: this.data.data.groupCommission, disabled: this.data.mode === DECISION.VIEW }),
            individualAmount: new UntypedFormControl({ value: this.data.data.individualAmount, disabled: this.data.mode === DECISION.VIEW }),
            individualMonths: new UntypedFormControl({ value: this.data.data.individualMonths, disabled: this.data.mode === DECISION.VIEW }),
            groupTotalAmount: new UntypedFormControl({ value: this.data.data.groupTotalAmount, disabled: this.data.mode === DECISION.VIEW }),
            groupMonths: new UntypedFormControl({ value: this.data.data.groupMonths, disabled: this.data.mode === DECISION.VIEW }),
            groupAmountPerMonth: new UntypedFormControl({ value: this.data.data.groupAmountPerMonth, disabled: this.data.mode === DECISION.VIEW }),
            userId: new UntypedFormControl({ value: this.data.data.userId, disabled: true }),
            introducedBy: new UntypedFormControl({ value: this.data.data.introducedBy, disabled: true }),
            aadhar: new UntypedFormControl({ value: this.data.data.aadhar, disabled: true }),
            pan: new UntypedFormControl({ value: this.data.data.pan, disabled: true }),
        });
    }
   
    public updateUserForm!: UntypedFormGroup;
schemes: any = [
    {
        id:1,
        name:'Individual',
    },
    {
        id:2,
        name:'Group',
    }
];

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.schemes, 'name', 'id');
    }

    /**
     * Edit beneficiary
     */
    public okToEdit(action: string, otp?: string) {
        // var payload = {
        //     beneficiaryId: this.data.data.beneficiaryId,
        //     relationshipWithBeneficiary: this.updateUserForm.controls['relationshipWithBeneficiary'].value,
        //     nickName: this.updateUserForm.controls['nickName'].value,
        //     street: this.updateUserForm.controls['beneficiaryAddress'].value,
        //     beneficiaryCity: this.updateUserForm.controls['beneficiaryCity'].value,
        //     beneficiaryCountry: this.getCountryName(this.updateUserForm.controls['beneficiaryCountry'].value),
        //     beneficiaryCountryCode: this.updateUserForm.controls['beneficiaryCountry'].value,
        //     action: action,
        //     validateOTPRequest: otp ? { softTokenUser: false, otp: otp } : {},
        // };
       /* this.sandBox.updateBeneficiary(payload).subscribe((res: any) => {
            if (action === 'VERIFY') {
                var beneficiaryData = {
                    title: 'Beneficiary Edit',
                    nickName: this.updateUserForm.controls['nickName'].value,
                    iban: this.data.data.iban,
                    accountNo: this.data.data.accountNo,
                    currency: this.data.data.currency,
                    bankName: this.data.data.bankName,
                    bankCountry: this.getCountryName(this.data.data.bankCountry),
                    street: this.updateUserForm.controls['beneficiaryAddress'].value,
                    beneficiaryCity: this.updateUserForm.controls['beneficiaryCity'].value,
                    beneficiaryCountry: this.getCountryName(
                        this.updateUserForm.controls['beneficiaryCountry'].value
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
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/beneficiaries/beneficiary-list']);
                });
            }
        });*/
    }
}
