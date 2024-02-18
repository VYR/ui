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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AdminSandbox } from 'src/app/modules/admin/admin.sandbox';
import { STATUSES } from 'src/app/shared/constants/meta-data';
@Component({
  selector: 'app-sgs-edit-forms',
  templateUrl: './sgs-edit-forms.component.html',
  styleUrls: ['./sgs-edit-forms.component.scss']
})
export class SgsEditFormsComponent implements OnInit {

  public Editor = ClassicEditor;
  editorData:any=`<p>Hello, world!</p>`;
  DECISION=DECISION;  
  public updateUserForm!: UntypedFormGroup;
  public updateSettingsForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  schemeTypes:Array<any>=[];
  constructor(public dialogRef: MatDialogRef<SgsEditFormsComponent>, 
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

  ngOnInit(): void {
    this.updateUserForm = this.fb.group({
      id: new UntypedFormControl(this.data.data?.id),
      firstName: new UntypedFormControl(this.data.data?.firstName, Validators.required),
      lastName: new UntypedFormControl(this.data.data?.lastName, Validators.required),
      password: new UntypedFormControl(null),
      role: new UntypedFormControl(this.data.data?.role),
      userType: new UntypedFormControl(this.data.data?.userType),
      mobilePhone: new UntypedFormControl(this.data.data?.mobilePhone, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null)
    });

    this.updateSettingsForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      individual_super_employee: new UntypedFormControl(this.data?.data?.individual?.super_employee || 0),      
      individual_employee: new UntypedFormControl(this.data?.data?.individual?.employee || 0),      
      individual_promoter: new UntypedFormControl(this.data?.data?.individual?.promoter || 0),      
      group_super_employee: new UntypedFormControl(this.data?.data?.group?.super_employee || 0),      
      group_employee: new UntypedFormControl(this.data?.data?.group?.employee || 0),      
      group_promoter: new UntypedFormControl(this.data?.data?.group?.promoter || 0),
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
    let requestObject:any={
      individual:{
        super_employee:formData.individual_super_employee,
        employee:formData.individual_employee,
        promoter:formData.individual_promoter
      },
      group:{
        super_employee:formData.group_super_employee,
        employee:formData.group_employee,
        promoter:formData.group_promoter
      }
    };
    console.log(requestObject);
    this.sandBox.updateSettings({data:requestObject}).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
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
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
