import { Component, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent  implements OnInit {
  query!: SGSTableQuery;  
  sortedData:Array<any>=[];  
  categories:Array<any>=[]; 
  subCategories:Array<any>=[];
  selectedCategory:any;
  selectedSubCategory:any;
  selectedProduct:any;
  showFullProduct:boolean=false;
  showcart:boolean=false;
  currentUser!:UserContext;
  cartItems:any=0;
  cartTotal:any=0;
  constructor(private dialog: SgsDialogService, 
    private sandbox: HomeSandbox,
    private appContext:ApplicationContextService
    ) {
    this.appContext.currentUser.subscribe((res: any) => {
      this.currentUser = res;
      this.cartItems=(this.currentUser?.cart || []).reduce((total,value) => {return total+value.quantity;},0);
      this.cartTotal=(this.currentUser?.cart || []).reduce((total,value) => {return total+(value.quantity*parseFloat(value.price));},0);
    });
    appContext.setPageTitle('Kiran Pickles');
  }
  
  ngOnInit(): void {
      this.getProducts();
  }
  getUpdatedValue(obj:any){
    this.showcart=true;
    let existingCart:Array<any>=this.currentUser?.cart || [];
    const index=existingCart.findIndex((value:any) => value.id==obj.item.id);
    
    //console.log(index);
    if(index>=0){
      if(obj.value==0)
        existingCart.splice(index,1);
      else
        existingCart[index].quantity=obj.value;
    }
    else {
      const item={
              id: obj.item.id,
              url: obj.item.path,
              path: obj.item.url,
              name:obj.item.product_name,
              price: obj.item.product_selling_price,
              image_id: obj.item.product_image_id,
              quantity: obj.value
          };
        existingCart.push(item);
    }
   this.currentUser.cart=existingCart;   
   console.log(this.currentUser.cart);
   this.appContext.setUserContext(this.currentUser);
  }
 
  compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  } 

  getProducts() {
      let query:any={...this.query};      
      this.sandbox.getProducts(query).subscribe((res:any) => {       
          if(res?.data){
              this.sortedData=res?.data || [];      
             
          }      
      });
  }

  details(data:any){
    this.onClickCell({key:'product_name',data:data});
  }

  onClickCell(event: any) {
    if (event.key === 'product_name') {
        this.selectedProduct=event.data;
        this.showFullProduct=true;
      }
  }

}

