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
import { HomeSandbox } from '../../../home.sandbox';
import { UserContext } from 'src/app/shared/models';
import { DECISION } from 'src/app/shared/enums';
import {  STATUSES} from "../constants/meta-data";
@Component({
  selector: 'app-sgs-edit-forms',
  templateUrl: './sgs-edit-forms.component.html',
  styleUrls: ['./sgs-edit-forms.component.scss']
})
export class SgsEditFormsComponent implements OnInit {

  DECISION=DECISION;  
  public updateUserForm!: UntypedFormGroup;
  public updateSchemeTypesForm!: UntypedFormGroup;
  public updateSchemesForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  schemeTypes:Array<any>=[];
  constructor(public dialogRef: MatDialogRef<SgsEditFormsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sandBox: HomeSandbox,
      public fb: UntypedFormBuilder,
      private dialog: SgsDialogService,
      private router: Router,
      private utilService: UtilService
  ) 
  {
      console.log(this.data.data);
  }

  ngOnInit(): void {
    if(this.data?.type==='schemes')
    this.getSgsSchemeTypes();
    this.updateSchemeTypesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      scheme_type_name: new UntypedFormControl(this.data?.data?.scheme_type_name || null, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
    this.updateSchemesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      scheme_type_id: new UntypedFormControl({value:this.data?.data?.scheme_type_id || null}),
      total_amount: new UntypedFormControl(this.data?.data?.total_amount || 0),
      amount_per_month: new UntypedFormControl(this.data?.data?.amount_per_month || 0, Validators.required),
      no_of_months: new UntypedFormControl(this.data?.data?.no_of_months || 0, Validators.required),
      coins: new UntypedFormControl(this.data?.data?.coins || 0),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
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

    if(this.data?.data?.scheme_type_id===1){
        this.updateSchemesForm.controls['coins'].setValidators(Validators.required);
        this.updateSchemesForm.controls['total_amount'].clearValidators();
    }
    if(this.data?.data?.scheme_type_id===2){
        this.updateSchemesForm.controls['total_amount'].setValidators(Validators.required);
        this.updateSchemesForm.controls['coins'].clearValidators();
    }
  }

  submitSchemeTypesForm(){
    const formData=this.updateSchemeTypesForm.value;
    this.sandBox.addUpdateSchemeTypes(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  submitSchemesForm(){
    const formData=this.updateSchemesForm.value;
    this.sandBox.addUpdateSchemes(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  getSelectBoxName(countryCode: string) {
      return this.utilService.getNameFromList(countryCode, this.statuses, 'name', 'id');
  }

  getSgsSchemeTypes() {
    this.sandBox.getSgsSchemeTypes().subscribe((res: any) => {
      if(res?.data){
        this.schemeTypes=res?.data || [];
        this.schemeTypes = this.schemeTypes.sort((a: any, b: any) => {
            const isAsc = true;
            return this.compare(a['scheme_type_name'], b['scheme_type_name'], isAsc);
        });
        const index=this.schemeTypes.findIndex((value:any) => value.id===this.data?.data?.scheme_type_id);
        console.log(index);
        if(index!=-1)
        this.updateSchemesForm.controls['scheme_type_id'].setValue(this.schemeTypes[index].id)
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
