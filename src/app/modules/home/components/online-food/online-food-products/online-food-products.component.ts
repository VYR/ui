import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodAddFormComponent } from '../online-food-add-form/online-food-add-form.component';
import { OnlineFoodViewDetailsComponent } from '../online-food-view-details/online-food-view-details.component';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
  selector: 'app-online-food-products',
  templateUrl: './online-food-products.component.html',
  styleUrls: ['./online-food-products.component.scss']
})
export class OnlineFoodProductsComponent  implements OnInit {
  tableConfig!: SGSTableConfig;
  query!: SGSTableQuery;  
  sortedData:Array<any>=[];  
  categories:Array<any>=[]; 
  subCategories:Array<any>=[];
  selectedCategory:any;
  selectedSubCategory:any;
  columns= [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'product_name',
        displayName: 'Product Name',
        type: ColumnType.link,
        sortable: true,
    },
    {
        key: 'url',
        displayName: 'Product Image',
        type: ColumnType.image,
        width:'8rem',
        height:'6rem'
    },
    {
        key: 'product_actual_price',
        displayName: 'Actual Price',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'product_discount_percent',
        displayName: 'Discount Percent(%)',
        type: ColumnType.number,
        sortable: true,
    },
    {
        key: 'product_discount_price',
        displayName: 'Discount Price(Rs.)',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'product_selling_price',
        displayName: 'Selling Price',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'updated_at',
        displayName: 'Updated Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    },
    {
      key: 'edit',
      displayName: 'Edit',
      type: ColumnType.icon,
      icon: 'la-edit',
    },
    {
      key: 'delete',
      displayName: 'Delete',
      type: ColumnType.icon,
      icon: 'la-trash',
    }
  ];
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox,private appContex:ApplicationContextService) {
    this.appContex.setPageTitle('Products');}
  
  ngOnInit(): void {
      this.getCategories();
  }
  getCategories() {
    this.sandbox.getCategories({}).subscribe((res: any) => {
      if(res?.data?.data){
        this.categories=res?.data?.data || [];
        this.categories = this.categories.sort((a: any, b: any) => {
            const isAsc = true;
            return this.compare(a['category_name'], b['category_name'], isAsc);
        });
        if(this.categories.length>0){
          this.selectedCategory=this.categories[0];
          this.query=new SGSTableQuery();
          this.query.sortKey='created_at';
          this.query.sortDirection=SortDirection.desc;
          this.getSubCategories();
        }
      }
    });
  }
  getSubCategoriesByCategory(event:any,type:any){
      this.selectedCategory=type;
      this.getSubCategories();
  }

  getProductsBySubCategories(event:any,type:any){
      this.selectedSubCategory=type;
      this.getProducts();
  }
  lazyLoad(event: SGSTableQuery) {
      if(this.query){
        this.query.pageIndex=event?.pageIndex || 0;
        if(event.sortKey)
            this.query.sortKey=event.sortKey;
        if(event.sortDirection)
        this.query.sortDirection=event.sortDirection;
        this.getSubCategories();
      }      
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  } 
  getSubCategories() {
      let query:any={};
      query.category_id=this.selectedCategory?.id || 0;
      this.sandbox.getSubCategories(query).subscribe((res:any) => {       
          if(res?.data?.data){
              this.subCategories=res?.data?.data || [];      
              this.subCategories = this.subCategories.sort((a: any, b: any) => {
                const isAsc = true;
                return this.compare(a['sub_category_name'], b['sub_category_name'], isAsc);
            });
            this.getProducts();
          }      
      });
  }
  getProducts() {
      let query:any={...this.query};      
      if(this.selectedCategory?.id)
      query.product_category_id=this.selectedCategory?.id || 0;
      if(this.selectedSubCategory?.id)
      query.product_sub_category_id=this.selectedSubCategory?.id || 0;
      this.sandbox.getProducts(query).subscribe((res:any) => {       
          if(res?.data?.data){
              this.sortedData=res?.data?.data || [];      
              this.tableConfig = {
                  columns: this.columns,
                  data: this.sortedData,
                  selection: false,
                  showPagination:true,
                  totalRecords: this.sortedData.length,
                  clientPagination: true,
              };
          }      
      });
  }
  deleteData(data:any){
    this.onClickCell({key:'delete',data:data});
  }
  editData(data:any){
    this.onClickCell({key:'edit',data:data});
  }
  details(data:any){
    this.onClickCell({key:'product_name',data:data});
  }
  onClickCell(event: any) {
      console.log(event);
      if (event.key === 'delete') {
          this.deleteRequest(event);
      }
      else if (event.key === 'product_name') {
        const ref = this.dialog.openOverlayPanel('Product Details', 
          OnlineFoodViewDetailsComponent, {
          type:'product',
          data: event.data,
          },SgsDialogType.medium);
          ref.afterClosed().subscribe((res) => {
          if(res?.id>0)
            this.getProducts();
        });
      }
      else 
        {
          const ref = this.dialog.openOverlayPanel('Update Product', 
          OnlineFoodEditFormComponent, {
          type:'product',
          data: event.data,
          },SgsDialogType.medium);
          ref.afterClosed().subscribe((res) => {
          if(res?.id>0)
            this.getProducts();
          });
        }
  }

  addProduct(){
    const ref = this.dialog.openOverlayPanel('Add Product', 
        OnlineFoodAddFormComponent, {
        type:'product',
        data:{product_category_id:this.selectedCategory?.id || 0,product_sub_category_id:this.selectedSubCategory?.id || 0},
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
          this.getProducts();
        });
  }
  deleteRequest(event: any) {
      const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.sub_category_name || '');
      ref.afterClosed().subscribe((result: any) => {
          if (result.decision === DECISION.CONFIRM) {
              this.sandbox.deleteRequest({id:event.data.id,type:4}).subscribe((res:any) => {
                  if(res?.deleteStatus === 1)
                  this.getSubCategories();
              });
          }
      });
  }
  
  downloadExcel(){
      this.sandbox.downloadExcel(this.sortedData,'product', (this.selectedSubCategory?.sub_category_name || '')+' Products');
  }
}

