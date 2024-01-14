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
  selector: 'app-sgs-add-forms',
  templateUrl: './sgs-add-forms.component.html',
  styleUrls: ['./sgs-add-forms.component.scss']
})
export class SgsAddFormsComponent implements OnInit {

  DECISION=DECISION;  
  public addUserForm!: UntypedFormGroup;
  public addSchemeTypesForm!: UntypedFormGroup;
  public addSchemesForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  schemeTypes:Array<any>=[];
  schemes:Array<any>=[];
  verifyValidations:any={
    mobilePhone:false,
    aadhar:false,
    pan:false
  }
  constructor(public dialogRef: MatDialogRef<SgsAddFormsComponent>, 
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
    if(['schemes','users'].includes(this.data?.type))
        this.getSgsSchemeTypes();
    this.addSchemeTypesForm = this.fb.group({
        scheme_type_name: new UntypedFormControl(null, Validators.required)
    });
    this.addSchemesForm = this.fb.group({
        scheme_type_id: new UntypedFormControl({value:this.data?.data?.scheme_type_id || null}),
        total_amount: new UntypedFormControl(null),
        amount_per_month: new UntypedFormControl(null, Validators.required),
        no_of_months: new UntypedFormControl(12, Validators.required),
        coins: new UntypedFormControl(null)
    });
    this.addUserForm = this.fb.group({
        role: new UntypedFormControl(this.data?.data?.role || null),
        userType: new UntypedFormControl(this.data?.data?.userType===0?0:(this.data?.data?.userType || null)),
        scheme_type_id: new UntypedFormControl(null),
        scheme_id: new UntypedFormControl(null),
        firstName: new UntypedFormControl(null,Validators.required),
        lastName: new UntypedFormControl(null,Validators.required),
        email: new UntypedFormControl(null,[Validators.required,Validators.email,
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password: new UntypedFormControl(null,Validators.required),
        mobilePhone: new UntypedFormControl(null),
        introducedBy: new UntypedFormControl(this.data?.data?.introducedBy),
        aadhar: new UntypedFormControl(null),
        pan: new UntypedFormControl(null),
    });
    if(this.data?.data?.scheme_type_id===1){
        this.addSchemesForm.controls['coins']?.setValidators(Validators.required);
        this.addSchemesForm.controls['total_amount'].clearValidators();
    }
    if(this.data?.data?.scheme_type_id===2){
        this.addSchemesForm.controls['total_amount']?.setValidators(Validators.required);
        this.addSchemesForm.controls['coins'].clearValidators();
    }
    if(this.data?.data?.userType===0){
      this.addUserForm.controls['scheme_type_id']?.setValidators([Validators.required]);
      this.addUserForm.controls['scheme_id']?.setValidators([Validators.required]);
      this.addUserForm.controls['aadhar']?.setValidators([Validators.required,Validators.minLength(12),Validators.maxLength(12)]);
      this.addUserForm.controls['pan']?.setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(10)]);
      this.addUserForm.controls['mobilePhone']?.setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(10),this.mobileVerificationCheck()]);       
      this.addUserForm.updateValueAndValidity();
    }
    else{
      this.addUserForm.controls['scheme_type_id'].clearValidators();
      this.addUserForm.controls['scheme_id'].clearValidators();
      this.addUserForm.controls['aadhar'].clearValidators();
      this.addUserForm.controls['pan'].clearValidators();
      this.addUserForm.controls['mobilePhone'].clearValidators();      
      this.addUserForm.updateValueAndValidity();
    }
  }

  public mobileVerificationCheck(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value && control.value != '') {
            if (this.data?.data?.currentUserType===2 && !this.verifyValidations.mobilePhone && control.value.length===10) {
                return { verifyMobile: { value: control.value } };
            }
        }
        return null;
    };
  }
  skipValidationForNow(controlName:string){
    this.verifyValidations[controlName]=true;
    this.addUserForm.controls[controlName].updateValueAndValidity();
  }

  submitSchemeTypesForm(){
    const formData=this.addSchemeTypesForm.value;
    this.sandBox.addUpdateSchemeTypes(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  submitSchemesForm(){
    const formData=this.addSchemesForm.value;
    this.sandBox.addUpdateSchemes(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  submitUsersForm(){
    const formData=this.addUserForm.value;
    console.log(formData);
    let requestObject:any={};
    Object.keys(formData).forEach((key) => {
        if(formData[key] !=null)
        requestObject[key] = formData[key];
    });
    console.log(requestObject);
    this.sandBox.addUpdateUsers(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
        if(index!=-1)
        this.addSchemesForm.controls['scheme_type_id'].setValue(this.schemeTypes[index].id)
      }
    });
  }
  getSchemesByType(event:any,type:any){
    this.schemes=[];
    if (event.isUserInput)
    this.sandBox.getSgsSchemes(type).subscribe((res:any) => {       
        if(res?.data){
            this.schemes=res?.data || [];
            const sortkey=type===1?'coins':'total_amount';
            this.schemes = this.schemes.sort((a: any, b: any) => {
              const isAsc = true;
              return this.compare(a[sortkey], b[sortkey], isAsc);
          });
        }      
    });
  }

}
