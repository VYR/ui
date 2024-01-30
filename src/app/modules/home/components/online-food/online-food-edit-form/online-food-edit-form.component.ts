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
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { UtilService } from 'src/app/utility';
import { HomeSandbox } from '../../../home.sandbox';
import { UserContext } from 'src/app/shared/models';
import { DECISION } from 'src/app/shared/enums';
import {  STATUSES} from "../constants/meta-data";

@Component({
  selector: 'app-online-food-edit-form',
  templateUrl: './online-food-edit-form.component.html',
  styleUrls: ['./online-food-edit-form.component.scss']
})
export class OnlineFoodEditFormComponent implements OnInit {

  DECISION=DECISION;  
  public updateUserForm!: UntypedFormGroup;
  public updateCategoriesForm!: UntypedFormGroup;
  public updateSubCategoriesForm!: UntypedFormGroup;
  public updateProductForm!: UntypedFormGroup;
  public updateSettingsForm!: UntypedFormGroup;  
  imagePreview:any='assets/images/image-preview.png';
  categoryImage='';
  subCategoryImage='';
  productImage='';
  categories:Array<any>=[];
  subCategories:Array<any>=[];
  statuses:any=STATUSES;
  constructor(public dialogRef: MatDialogRef<OnlineFoodEditFormComponent>, 
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
    this.categoryImage=this.data?.data?.url || this.imagePreview;
    this.subCategoryImage=this.data?.data?.url || this.imagePreview;
    this.productImage=this.data?.data?.url || this.imagePreview;
    this.updateUserForm = this.fb.group({
      id: new UntypedFormControl(this.data.data?.id),
      firstName: new UntypedFormControl(this.data.data?.firstName, Validators.required),
      lastName: new UntypedFormControl(this.data.data?.lastName, Validators.required),
      password: new UntypedFormControl(null),
      role: new UntypedFormControl(this.data.data?.role),
      userType: new UntypedFormControl(this.data.data?.userType),
      mobilePhone: new UntypedFormControl(this.data.data?.mobilePhone, Validators.required)
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
    this.sandBox.addUpdateUsers(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  getSelectBoxName(countryCode: string) {
      return this.utilService.getNameFromList(countryCode, this.statuses, 'name', 'id');
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
