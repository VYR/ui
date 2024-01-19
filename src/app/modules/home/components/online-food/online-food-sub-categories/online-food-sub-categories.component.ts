import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodAddFormComponent } from '../online-food-add-form/online-food-add-form.component';

@Component({
  selector: 'app-online-food-sub-categories',
  templateUrl: './online-food-sub-categories.component.html',
  styleUrls: ['./online-food-sub-categories.component.scss']
})
export class OnlineFoodSubCategoriesComponent  implements OnInit {
  tableConfig!: SGSTableConfig;
  query!: SGSTableQuery;  
  sortedData:Array<any>=[];  
  categories:Array<any>=[];
  selectedCategory:any;
  columns= [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'sub_category_name',
        displayName: 'Sub Category Name',
        sortable: true,
    },
    {
        key: 'url',
        displayName: 'Sub Category Image',
        type: ColumnType.image,
        width:'8rem',
        height:'6rem'
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
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
  
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
    if (event.isUserInput){
      this.selectedCategory=type;
      this.getSubCategories();
    }
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
      let query:any={...this.query};
      query.category_id=this.selectedCategory?.id || 0;
      this.sandbox.getSubCategories(query).subscribe((res:any) => {       
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

  onClickCell(event: any) {
      console.log(event);
      if (event.key === 'delete') {
          this.deleteRequest(event);
      }
      else 
        {
          const ref = this.dialog.openOverlayPanel('Update  Sub Category', 
          OnlineFoodEditFormComponent, {
          type:'subCategory',
          data: event.data,
          },SgsDialogType.medium);
          ref.afterClosed().subscribe((res) => {
          if(res?.id===event.data.id)
          this.getSubCategories();
          });
        }
  }

  addSubCategory(){
    const ref = this.dialog.openOverlayPanel('Add Sub Category', 
        OnlineFoodAddFormComponent, {
        type:'subCategory',
        data:{category_id:this.selectedCategory?.id || 0},
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getSubCategories();
        });
  }
  deleteRequest(event: any) {
      const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.sub_category_name || '');
      ref.afterClosed().subscribe((result: any) => {
          if (result.decision === DECISION.CONFIRM) {
              this.sandbox.deleteRequest({id:event.data.id,type:2}).subscribe((res:any) => {
                  if(res?.deleteStatus === 1)
                  this.getSubCategories();
              });
          }
      });
  }
  
  downloadExcel(){
      this.sandbox.downloadExcel(this.sortedData,'subCategories', (this.selectedCategory?.category_name || '')+' Sub Categories');
  }
}

