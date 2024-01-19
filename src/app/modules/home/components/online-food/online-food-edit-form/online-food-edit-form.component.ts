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
    if(['subCategory','product'].includes(this.data?.type))
        this.getCategories();
    this.updateCategoriesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      category_name: new UntypedFormControl(this.data?.data?.category_name || null, Validators.required),
      category_image_id: new UntypedFormControl(this.data?.data?.category_image_id || null, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
    this.updateSubCategoriesForm = this.fb.group({
      id: new UntypedFormControl(this.data?.data?.id || 0),
      category_id: new UntypedFormControl({value:this.data?.data?.category_id || null}),
      sub_category_name: new UntypedFormControl(this.data?.data?.sub_category_name || null, Validators.required),
      sub_category_image_id: new UntypedFormControl(this.data?.data?.sub_category_image_id || null, Validators.required),
      status: new UntypedFormControl(this.data?.data?.status || null),
    });
    this.updateProductForm = this.fb.group({
      id: new UntypedFormControl(this.data.data?.id),
      product_category_id: new UntypedFormControl(this.data?.data?.product_category_id || null,Validators.required),
      product_sub_category_id: new UntypedFormControl(this.data?.data?.product_sub_category_id || null,Validators.required),
      product_name: new UntypedFormControl(this.data?.data?.product_name || null,Validators.required),
      product_actual_price: new UntypedFormControl(parseInt(this.data?.data?.product_actual_price || 0) || null,[Validators.required,Validators.min(1)]),
      product_image_id: new UntypedFormControl(this.data?.data?.product_image_id || null,Validators.required),
      discount_type: new UntypedFormControl(
          (this.data?.data?.product_discount_percent || 0) >0?'Percent':((this.data?.data?.product_discount_price || 0) >0?'Price':null)
      ),
      product_discount_percent: new UntypedFormControl(parseInt(this.data?.data?.product_discount_percent || 0) || null),
      product_discount_price: new UntypedFormControl(parseInt(this.data?.data?.product_discount_price || 0) || null),
      product_selling_price: new UntypedFormControl(parseInt(this.data?.data?.product_selling_price || 0) || null,[Validators.required,Validators.min(1)]),
      product_desc: new UntypedFormControl(this.data?.data?.product_desc || null),
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
  }

  calculateSellingPrice(){
    const currentType=this.updateProductForm.controls['discount_type']?.value || '';
    const actual=parseInt(this.updateProductForm.controls['product_actual_price']?.value || '0');
    if(currentType.length>0){
      const percent=parseInt(this.updateProductForm.controls['product_discount_percent']?.value || '0');
      const price=parseInt(this.updateProductForm.controls['product_discount_price']?.value || '0');     
      let selling=0;
        if(currentType==='Percent' && percent>0){
          selling=actual-(Math.round(actual*(percent/100)));
          this.updateProductForm.controls['product_selling_price'].setValue(selling);          
          this.updateProductForm.controls['product_discount_price'].setValue(0);
        }
        else if(currentType==='Price' && price>0){          
          this.updateProductForm.controls['product_discount_percent'].setValue(0);
          if(actual>price)
            selling=actual-price;
          else {
            selling=actual; 
            this.updateProductForm.controls['product_discount_price'].setValue(0);
          }           
          this.updateProductForm.controls['product_selling_price'].setValue(selling);
        }
        else{
          this.updateProductForm.controls['product_selling_price'].setValue(actual);
        }
    }
    else {
      this.updateProductForm.controls['product_selling_price'].setValue(actual);
    }
  }
  updateCalculation(event:any,value:any){
    if(event.isUserInput){
      if(value==='Percent'){         
        this.updateProductForm.controls['product_discount_price'].setValue(0);
      }
      else if(value==='Price'){          
        this.updateProductForm.controls['product_discount_percent'].setValue(0);
      }
      else {
        this.updateProductForm.controls['product_discount_percent'].setValue(0);
        this.updateProductForm.controls['product_discount_price'].setValue(0);
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
          this.updateCategoriesForm.controls['category_image_id'].setValue(res?.data?.id || null);
        }
        if(this.data?.type==='subCategory'){
          this.subCategoryImage=res?.data?.url;
          this.updateSubCategoriesForm.controls['sub_category_image_id'].setValue(res?.data?.id || null);
        }
        if(this.data?.type==='product'){
          this.productImage=res?.data?.url;
          this.updateProductForm.controls['product_image_id'].setValue(res?.data?.id || null);
        }
      }
      else {
        if(this.data?.type==='category'){
          this.categoryImage=this.data?.data?.url || this.imagePreview;
          this.updateCategoriesForm.controls['category_image_id'].setValue(this.data?.data?.category_image_id || null);
        }
        if(this.data?.type==='subCategory'){
          this.subCategoryImage=this.data?.data?.url || this.imagePreview;
          this.updateSubCategoriesForm.controls['sub_category_image_id'].setValue(this.data?.data?.sub_category_image_id || null);
        }
        if(this.data?.type==='product'){
          this.productImage=this.data?.data?.url || this.imagePreview;
          this.updateProductForm.controls['product_image_id'].setValue(this.data?.data?.product_image_id || null);
        }
      }
    });
  }
  submitCategoriesForm(){
    const formData=this.updateCategoriesForm.value;
    this.sandBox.addUpdateCategories(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }

  submitSubCategoriesForm(){
    const formData=this.updateSubCategoriesForm.value;
    this.sandBox.addUpdateSubCategories(formData).subscribe((res:any) => {
        if(res?.data){          
          this.dialogRef.close(res.data);
        }
    });
  }
  submitProductForm(){
    const formData=this.updateProductForm.value;
    this.sandBox.addUpdateProducts(formData).subscribe((res:any) => {
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
    this.sandBox.addUpdateUsers(formData).subscribe((res:any) => {
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
            this.updateSubCategoriesForm.controls['category_id'].setValue(this.categories[index].id);
          if(this.data?.type==='product')
            this.updateProductForm.controls['product_category_id'].setValue(this.categories[index].id);
          this.getSubCategoriesByCategory({isUserInput:true},this.categories[index].id);
        }
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
