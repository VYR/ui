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
import { OnlineFoodImageSelectionComponent } from '../online-food-image-selection/online-food-image-selection.component';

@Component({
  selector: 'app-online-food-add-form',
  templateUrl: './online-food-add-form.component.html',
  styleUrls: ['./online-food-add-form.component.scss']
})
export class OnlineFoodAddFormComponent implements OnInit {

  DECISION=DECISION;  
  public addUserForm!: UntypedFormGroup;
  public addCategoriesForm!: UntypedFormGroup;
  public addSubCategoriesForm!: UntypedFormGroup;
  public addProductForm!: UntypedFormGroup;  
  public addUserToSchemeForm!: UntypedFormGroup;
  public addPaymentForm!: UntypedFormGroup;
  statuses:any=STATUSES;
  imagePreview:any='assets/images/image-preview.png';
  categoryImage='';
  subCategoryImage='';
  productImage='';
  categories:Array<any>=[];
  subCategories:Array<any>=[];
  verifyValidations:any={
    mobilePhone:false,
    aadhar:false,
    pan:false
  }
  constructor(public dialogRef: MatDialogRef<OnlineFoodAddFormComponent>, 
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
    this.categoryImage=this.imagePreview;
    this.subCategoryImage=this.imagePreview;
    this.productImage=this.imagePreview;
    if(['subCategory','product'].includes(this.data?.type))
        this.getCategories();

    this.addCategoriesForm = this.fb.group({
      category_name: new UntypedFormControl(null, Validators.required),
      category_image_id: new UntypedFormControl(null, Validators.required)
    });

    this.addSubCategoriesForm = this.fb.group({
      category_id: new UntypedFormControl(this.data?.data?.category_id || null),
      sub_category_name: new UntypedFormControl(null, Validators.required),
      sub_category_image_id: new UntypedFormControl(null, Validators.required)
    });

    this.addProductForm = this.fb.group({
      product_category_id: new UntypedFormControl(this.data?.data?.product_category_id || null,Validators.required),
      product_sub_category_id: new UntypedFormControl(this.data?.data?.product_sub_category_id || null,Validators.required),
      product_name: new UntypedFormControl(null,Validators.required),
      product_actual_price: new UntypedFormControl(null,[Validators.required,Validators.min(1)]),
      product_image_id: new UntypedFormControl(null,Validators.required),
      discount_type: new UntypedFormControl(null),
      product_discount_percent: new UntypedFormControl(null),
      product_discount_price: new UntypedFormControl(null),
      product_selling_price: new UntypedFormControl(null,[Validators.required,Validators.min(1)]),
      product_desc: new UntypedFormControl(null),
  });
    this.addUserForm = this.fb.group({
        role: new UntypedFormControl(this.data?.data?.role || null),
        userType: new UntypedFormControl(this.data?.data?.userType===0?0:(this.data?.data?.userType || null)),
        firstName: new UntypedFormControl(null,Validators.required),
        lastName: new UntypedFormControl(null,Validators.required),
        email: new UntypedFormControl(null,[Validators.required,Validators.email,
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        password: new UntypedFormControl(null,Validators.required),
        mobilePhone: new UntypedFormControl(null),
        introducedBy: new UntypedFormControl(this.data?.data?.introducedBy),
        // aadhar: new UntypedFormControl(null),
        // pan: new UntypedFormControl(null),
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
  }
  calculateSellingPrice(){
    const currentType=this.addProductForm.controls['discount_type']?.value || '';
    const actual=parseInt(this.addProductForm.controls['product_actual_price']?.value || '0');
    if(currentType.length>0){
      const percent=parseInt(this.addProductForm.controls['product_discount_percent']?.value || '0');
      const price=parseInt(this.addProductForm.controls['product_discount_price']?.value || '0');     
      let selling=0;
        if(currentType==='Percent' && percent>0){
          selling=actual-(Math.round(actual*(percent/100)));
          this.addProductForm.controls['product_selling_price'].setValue(selling);          
          this.addProductForm.controls['product_discount_price'].setValue(0);
        }
        else if(currentType==='Price' && price>0){          
          this.addProductForm.controls['product_discount_percent'].setValue(0);
          if(actual>price)
            selling=actual-price;
          else {
            selling=actual; 
            this.addProductForm.controls['product_discount_price'].setValue(0);
          }           
          this.addProductForm.controls['product_selling_price'].setValue(selling);
        }
        else{
          this.addProductForm.controls['product_selling_price'].setValue(actual);
        }
    }
    else {
      this.addProductForm.controls['product_selling_price'].setValue(actual);
    }
  }
  updateCalculation(event:any,value:any){
    if(event.isUserInput){
      if(value==='Percent'){         
        this.addProductForm.controls['product_discount_price'].setValue(0);
      }
      else if(value==='Price'){          
        this.addProductForm.controls['product_discount_percent'].setValue(0);
      }
      else {
        this.addProductForm.controls['product_discount_percent'].setValue(0);
        this.addProductForm.controls['product_discount_price'].setValue(0);
      }
      this.calculateSellingPrice();
    }
  }
  openImagesPanel(){
    const ref = this.dialog.openOverlayPanel('Select Image', 
    OnlineFoodImageSelectionComponent, {
      type:'images',
    },SgsDialogType.medium);
    ref.afterClosed().subscribe((res) => {
      console.log(res);
      if(res?.data){
        if(this.data?.type==='category'){
          this.categoryImage=res?.data?.url;
          this.addCategoriesForm.controls['category_image_id'].setValue(res?.data?.id || null);
        }
        if(this.data?.type==='subCategory'){
          this.subCategoryImage=res?.data?.url;
          this.addSubCategoriesForm.controls['sub_category_image_id'].setValue(res?.data?.id || null);
        }
        if(this.data?.type==='product'){
          this.productImage=res?.data?.url;
          this.addProductForm.controls['product_image_id'].setValue(res?.data?.id || null);
        }
      }
      else {
        if(this.data?.type==='category')
        this.categoryImage=this.imagePreview;
        if(this.data?.type==='subCategory')
        this.subCategoryImage=this.imagePreview;
        if(this.data?.type==='product')
        this.productImage=this.imagePreview;
      }
    });
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

  submitCategoriesForm(){
    const formData=this.addCategoriesForm.value;
    this.sandBox.addUpdateCategories(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  submitSubCategoriesForm(){
    const formData=this.addSubCategoriesForm.value;
    this.sandBox.addUpdateSubCategories(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitProductForm(){
    const formData=this.addProductForm.value;
    this.sandBox.addUpdateProducts(formData).subscribe((res:any) => {
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

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  getCategories() {
    this.sandBox.getCategories({}).subscribe((res: any) => {
      if(res?.data?.data){
        this.categories=res?.data?.data || [];
        this.categories = this.categories.sort((a: any, b: any) => {
            const isAsc = true;
            return this.compare(a['category_name'], b['category_name'], isAsc);
        });
        let index=-1;
        if(this.data?.type==='subCategory')
          index=this.categories.findIndex((value:any) => value.id===this.data?.data?.category_id);
        if(this.data?.type==='product')
          index=this.categories.findIndex((value:any) => value.id===this.data?.data?.product_category_id);
        if(index!=-1){
          if(this.data?.type==='subCategory')
            this.addSubCategoriesForm.controls['category_id'].setValue(this.categories[index].id);
          if(this.data?.type==='product')
            this.addProductForm.controls['product_category_id'].setValue(this.categories[index].id);
          this.getSubCategoriesByCategory({isUserInput:true},this.categories[index].id);
        }
      }
    });
  }
  getSubCategoriesByCategory(event:any,type:any){
    this.subCategories=[];
    if (event.isUserInput)
    this.sandBox.getSubCategories({category_id:type}).subscribe((res:any) => {       
        if(res?.data?.data){
            this.subCategories=res?.data?.data || [];
            const sortkey='sub_category_name';
            this.subCategories = this.subCategories.sort((a: any, b: any) => {
              const isAsc = true;
              return this.compare(a[sortkey], b[sortkey], isAsc);
          });
        }      
    });
  }

}
