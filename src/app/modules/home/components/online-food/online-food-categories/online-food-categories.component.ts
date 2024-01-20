import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { OnlineFoodAddFormComponent } from '../online-food-add-form/online-food-add-form.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';


@Component({
  selector: 'app-online-food-categories',
  templateUrl: './online-food-categories.component.html',
  styleUrls: ['./online-food-categories.component.scss']
})
export class OnlineFoodCategoriesComponent implements OnInit {
  tableConfig!: SGSTableConfig;  
  query: SGSTableQuery= new SGSTableQuery(); 
  sortedData:Array<any>=[];
  columns= [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'category_name',
        displayName: 'Category Name',
        sortable: true,
    },
    {
        key: 'url',
        displayName: 'Category Image',
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
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox, private appContex:ApplicationContextService) {
    this.appContex.setPageTitle('Categories');
  }

  ngOnInit(): void {
    this.query.sortKey='created_at';
    this.query.sortDirection=SortDirection.desc;
    this.getCategories();
  }

  lazyLoad(event: SGSTableQuery) {
    this.query.pageIndex=event?.pageIndex || 0;
    if(event.sortKey)
        this.query.sortKey=event.sortKey;
    if(event.sortDirection)
    this.query.sortDirection=event.sortDirection;
    //this.getCategories();
  }

  getCategories() {
    let query:any={...this.query};
    this.sandbox.getCategories(query).subscribe((res: any) => {
      if(res?.data){
        this.sortedData=res?.data?.data || [];
        const total:any=res?.data?.total || 0;
        this.tableConfig = {
          columns: this.columns,
          data: this.sortedData,
          selection: false,
          showPagination:true,
          totalRecords: total,
          clientPagination: false,
      };
      }
    });
  }

  addCategory(){
    const ref = this.dialog.openOverlayPanel('Add Category', 
      OnlineFoodAddFormComponent, {
        type:'category',
      },SgsDialogType.large);
      ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getCategories();
      });
  }
  deleteData(data:any){
    this.onClickCell({key:'delete',data:data});
  }
  editData(data:any){
    this.onClickCell({key:'edit',data:data});
  }
  onClickCell(event: any) {
    console.log(event);
    if (event.key === 'delete') {
        this.deleteRequest(event);
    } else {
      const ref = this.dialog.openOverlayPanel('Update Category', 
      OnlineFoodEditFormComponent, {
        type:'category',
        data: event.data,
      },SgsDialogType.large);
      ref.afterClosed().subscribe((res) => {
        if(res?.id===event.data.id)
        this.getCategories();
      });
    }
  }

  deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.category_name || '');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:event.data.id,type:1}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                this.getCategories();
            });
        }
    });
  }

  downloadExcel(){
    this.sandbox.downloadExcel(this.sortedData,'category','Categories');
  }
}

