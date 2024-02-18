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
import { DECISION, SYSTEM_CONFIG } from 'src/app/shared/enums';
import { AdminSandbox } from 'src/app/modules/admin/admin.sandbox';
import { SGSTableConfig, SGSTableQuery } from 'src/app/sgs-components/sgs-table/models/config.model';
import { STATUSES } from 'src/app/shared/constants/meta-data';
@Component({
  selector: 'app-sgs-add-forms',
  templateUrl: './sgs-add-forms.component.html',
  styleUrls: ['./sgs-add-forms.component.scss']
})
export class SgsAddFormsComponent implements OnInit {

  DECISION=DECISION;  
  public addUserForm!: UntypedFormGroup;
  public addUserToSchemeForm!: UntypedFormGroup;
  public addPaymentForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  selectedPromoter="";
  superEmployees:Array<any>=[];
  employees:Array<any>=[];
  promoters:Array<any>=[];
  verifyValidations:any={
    mobilePhone:false,
    aadhar:false,
    pan:false
  };  
  tableConfig!: SGSTableConfig;
  cols:Array<any>= [
    {
        key: 'userId',
        displayName: 'User ID'
    },
    {
        key: 'userName',
        displayName: 'Full Name',
        sortable: true,
    },
    {
        key: 'message',
        displayName: 'Error Message',
    },
  ];
  query!:SGSTableQuery;
  constructor(public dialogRef: MatDialogRef<SgsAddFormsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sandBox: AdminSandbox,
      public fb: UntypedFormBuilder,
      private dialog: SgsDialogService,
      private router: Router,
      private utilService: UtilService
  ) 
  {
      console.log(this.data.data);
  }
  lazyLoad(event: SGSTableQuery) {
    this.query=event;
}
  ngOnInit(): void {    
    this.addUserForm = this.fb.group({
        role: new UntypedFormControl(this.data?.data?.role || null),
        userType: new UntypedFormControl(this.data?.data?.userType===0?0:(this.data?.data?.userType || null)),
        scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || null),
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
    this.addUserToSchemeForm = this.fb.group({
        scheme_type_id: new UntypedFormControl({value:this.data?.data?.scheme_type_id || null,disabled:true}),
        scheme_id: new UntypedFormControl(null,Validators.required),
        userId: new UntypedFormControl(this.data?.data?.userId)
    });
    
    this.addPaymentForm = this.fb.group({
        scheme_member_id: new UntypedFormControl(this.data?.data?.scheme_member_id || 0),
        scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || 0),
        amount_paid: new UntypedFormControl(this.data?.data?.amount_paid || 0),
        month_paid: new UntypedFormControl(this.data?.data?.month_paid || 0),
    });
    if(this.data?.data?.userType===0){
      this.addUserForm.controls['scheme_id']?.setValidators([Validators.required]);
      this.addUserForm.controls['aadhar']?.setValidators([Validators.required,Validators.minLength(12),Validators.maxLength(12)]);
      this.addUserForm.controls['pan']?.setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(10)]);
      this.addUserForm.controls['mobilePhone']?.setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(10),this.mobileVerificationCheck()]);       
      this.addUserForm.updateValueAndValidity();
    }
    else{
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
            if (this.data?.data?.userType===0 && !this.verifyValidations.mobilePhone && control.value.length===10) {
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
 
  submitUserSchemeForm(){
    const formData=this.addUserToSchemeForm.value;
    this.sandBox.addUpdateSchemeMembers(formData).subscribe((res:any) => {
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
    if(requestObject.hasOwnProperty('pan')){
      requestObject.pan=requestObject.pan.toUpperCase();
    }
    this.sandBox.addUpdateUsers(requestObject).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitPaymentForm(){
    const formData:any=this.addPaymentForm.value;
    formData.amount_paid=parseFloat(formData.amount_paid);
    this.sandBox.addUpdatePayment(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  skipAndProceed(){         
    this.dialogRef.close({data:true});
  }
}
