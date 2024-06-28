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
import {  STATUSES} from "src/app/shared/constants/meta-data";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AdminSandbox } from 'src/app/modules/admin/admin.sandbox';
import { CustomDatePipe } from 'src/app/shared/pipes/date.pipe';
@Component({
  selector: 'app-sgs-edit-forms',
  templateUrl: './sgs-edit-forms.component.html',
  styleUrls: ['./sgs-edit-forms.component.scss']
})
export class SgsEditFormsComponent implements OnInit {
  selectedDate:any='';
  public Editor = ClassicEditor;
  editorData:any=`<p>Hello, world!</p>`;
  DECISION=DECISION;  
  public updateUserForm!: UntypedFormGroup;
  public updateSchemeTypesForm!: UntypedFormGroup;
  public updateSchemesForm!: UntypedFormGroup;
  public updateSchemeNamesForm!: UntypedFormGroup;
  public updateSettingsForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  schemeTypes:Array<any>=[];
  constructor(public dialogRef: MatDialogRef<SgsEditFormsComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sandBox: AdminSandbox,
      public fb: UntypedFormBuilder,
      private dialog: SgsDialogService,
      private router: Router,
      private datePipe:CustomDatePipe,
      private utilService: UtilService
  ) 
  {
      console.log(this.data.data);
  }

  ngOnInit(): void {    
    if(this.data?.data?.scheme_date)
    this.selectedDate=this.datePipe.transform(this.data?.data?.scheme_date,'YYYY-MM-dd'); 
    this.updateSchemesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      scheme_type_id: new UntypedFormControl(this.data?.data?.scheme_type_id),      
      scheme_date: new UntypedFormControl(new Date(this.data?.data?.scheme_date || null), Validators.required),
      scheme_name: new UntypedFormControl(this.data?.data?.scheme_name || null, Validators.required),
      total_amount: new UntypedFormControl(this.data?.data?.total_amount || 0),
      amount_per_month: new UntypedFormControl(this.data?.data?.amount_per_month || 0, Validators.required),
      no_of_months: new UntypedFormControl(this.data?.data?.no_of_months || 0, Validators.required),
      coins: new UntypedFormControl(this.data?.data?.coins || 0),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
    this.updateSchemeNamesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      scheme_id: new UntypedFormControl(this.data?.data?.scheme_id || 0),
      scheme_name: new UntypedFormControl(this.data?.data?.scheme_name || 0, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
    this.updateUserForm = this.fb.group({
      id: new UntypedFormControl(this.data.data?.id),
      firstName: new UntypedFormControl(this.data.data?.firstName, Validators.required),
      lastName: new UntypedFormControl(this.data.data?.lastName, Validators.required),
      password: new UntypedFormControl(null),
      role: new UntypedFormControl(this.data.data?.role),
      userType: new UntypedFormControl(this.data.data?.userType),
      mobilePhone: new UntypedFormControl(this.data.data?.mobilePhone, Validators.required)
    });

    this.updateSettingsForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      individual_commission: new UntypedFormControl(this.data?.data?.individual_commission || 0),
      group_commission: new UntypedFormControl(this.data?.data?.group_commission || 0),
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
  getDate(date:any){
    this.selectedDate=date;
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
    const payload:any={...formData,scheme_date:this.selectedDate};
    this.sandBox.addUpdateSchemes(payload).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitSchemeNamesForm(){
    const formData=this.updateSchemeNamesForm.value;
    this.sandBox.addUpdateSchemeNames(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitUserForm(){
    const formData=this.updateUserForm.value;   
     console.log(formData);
    let requestObject:any={};
    Object.keys(formData).forEach((key) => {
        if(formData[key] !=null)
        requestObject[key] = formData[key];
    });
    console.log(requestObject);
    this.sandBox.addUpdateUsers(requestObject).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitSettingsForm(){
    const formData=this.updateSettingsForm.value;   
     console.log(formData);
    let requestObject:any={};
    Object.keys(formData).forEach((key) => {
        if(formData[key] !=null)
        requestObject[key] = formData[key];
    });
    console.log(requestObject);
    this.sandBox.updateSettings(formData).subscribe((res:any) => {
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
