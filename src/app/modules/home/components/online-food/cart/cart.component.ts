import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  DECISION=DECISION;
  currentUser!:UserContext;
  cartItems:any=0;
  cartTotal:any=0;  
  existingCart:Array<any>=[];
  isCheckout:boolean=false;
  public placeOrderForm!: UntypedFormGroup; 
  constructor(public dialogRef: MatDialogRef<CartComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: SgsDialogService,
      private sandbox: HomeSandbox,
      public fb: UntypedFormBuilder,
      private router:Router,
    private appContext:ApplicationContextService
  ) 
  {
    this.appContext.currentUser.subscribe((res: any) => {
      this.currentUser = res;
      this.cartItems=(this.currentUser?.cart || []).reduce((total,value) => {return total+value.quantity;},0);
      this.cartTotal=(this.currentUser?.cart || []).reduce((total,value) => {return total+(value.quantity*parseFloat(value.price));},0);
    });
  }


  ngOnInit(): void {
    this.existingCart=this.currentUser?.cart || [];
    this.isCheckout=this.data?.isCheckout || false;
    this.placeOrderForm = this.fb.group({
      firstName: new UntypedFormControl(this.currentUser.firstName, Validators.required),
      lastName: new UntypedFormControl(this.currentUser.lastName, Validators.required),
      email: new UntypedFormControl(this.currentUser.email, [Validators.required,Validators.email]),
      password: new UntypedFormControl(this.currentUser.email, Validators.required),
      mobilePhone: new UntypedFormControl(this.currentUser.mobilePhone, Validators.required)
    });
  }
  getUpdatedValue(obj:any){
    const index=this.existingCart.findIndex((value:any) => value.id==obj.item.id);    
    if(index>=0){
      if(obj.value==0)
        this.existingCart.splice(index,1);
      else
        this.existingCart[index].quantity=obj.value;
    }
   this.currentUser.cart=this.existingCart;   
   console.log(this.currentUser.cart);
   this.appContext.setUserContext(this.currentUser);
  }
  openCheckoutPage(){
    this.isCheckout=true;
    const ref = this.dialog.openOverlayPanel('Checkout', CartComponent,{isCheckout:true},SgsDialogType.large);
    ref.afterClosed().subscribe((res) => {
      console.log(res);
      if(res?.data?.id >0)
      {        
        this.isCheckout=false;
        this.existingCart=[];
        this.currentUser.cart=this.existingCart;
        this.appContext.updateContext(this.currentUser);
        this.dialogRef.close(res);
      }
      else {        
        this.isCheckout=false;
      }
    });
  }
  placeOrder(){
    let payload:any={
      ...this.placeOrderForm.value,
      ...{
          amount_paid:parseFloat(this.cartTotal),
        total_products:this.existingCart.length,
        quantity:this.cartItems,
        product_details:this.existingCart
      }
    };
    if(this.currentUser.userId)
    payload.userId=this.currentUser.userId;
    this.sandbox.addUpdateOrders(payload).subscribe((res:any) => {
        if(res?.data?.id >0)
        {
          this.dialogRef.close(res);
        }
    });
  }
}
