import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ORDER_STATUSES, ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from '../constants/meta-data';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { OnlineFoodViewDetailsComponent } from '../online-food-view-details/online-food-view-details.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodAddFormComponent } from '../online-food-add-form/online-food-add-form.component';
@Component({
  selector: 'app-online-food-orders',
  templateUrl: './online-food-orders.component.html',
  styleUrls: ['./online-food-orders.component.scss']
})
export class OnlineFoodOrdersComponent implements OnInit {
  tableConfig!: SGSTableConfig;
  query: SGSTableQuery= new SGSTableQuery();
  @Input() specificUserId!:any;
  sortedData:Array<any>=[];
  userTypes=[...[{id:-1,name:'All'}],...USER_TYPES];
  statuses=[...['All'],...ORDER_STATUSES];
  selectedUserType=0;
  selectedStatus='pending';
  currentUser!:UserContext;
  USER_TABLE_COLUMNS= [
    {
        key: 'created_at',
        displayName: 'Order Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'txnNo',
        displayName: 'Order ID',
        type: ColumnType.link,
        sortable: true,
    },
    {
        key: 'total_products',
        displayName: 'Total Items',
        sortable: true,
    },
    {
        key: 'quantity',
        displayName: 'Total Quantity',
        sortable: true,
    },
    {
        key: 'userName',
        displayName: 'Ordered By',
        sortable: true,
    },
    {
        key: 'email',
        displayName: 'Email ID',
        sortable: true,
    },
    {
        key: 'mobilePhone',
        displayName: 'Mobile Number',
        sortable: true,
    }, 
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
];
  enableAddButton:boolean=false;
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox, private appContext:ApplicationContextService) {
    this.appContext.setPageTitle('Orders');  
    this.appContext.currentUser.subscribe((res) => (this.currentUser = res));
  }
  ngOnInit(): void {       
      this.query.sortKey='created_at';
      this.query.sortDirection=SortDirection.desc;
      this.getOrders();
  }

  lazyLoad(event: SGSTableQuery) {
      console.log(this.query);
      console.log(event);
      this.query.pageIndex=event?.pageIndex || 0;
      if(event.sortKey)
          this.query.sortKey=event.sortKey;
      if(event.sortDirection)
      this.query.sortDirection=event.sortDirection;
     // this.getOrders();
  }
  updateUserType(event:any,id:any){
      if(event.isUserInput){
          this.selectedUserType=id;
          this.getOrders();
      }
  }
  updateStatus(event:any,status:string){
          this.selectedStatus=status;
          this.getOrders();
  }
  getOrders() {        
      let query:any={...this.query};
      console.log(query);
      if(this.specificUserId){
          query.userId=this.specificUserId;
      }
      if(this.selectedStatus!=='All'){
          query.status=this.selectedStatus;
      }
      this.sandbox.getOrders(query).subscribe((res: any) => {
          if(res?.data){
              this.sortedData=res?.data?.data || [];
              const total:any=res?.data?.total || 0;
              console.log(total);
          let editCol = {
              key: 'edit',
              displayName: 'Edit',
              type: ColumnType.icon,
              icon: 'la-edit',
              callBackFn: this.checkForEditAction,
          };
          let delCol = {
              key: 'delete',
              displayName: 'Delete',
              type: ColumnType.icon,
              icon: 'la-trash',
              callBackFn: this.checkForDeleteAction,
          };
          let colArray = [...this.USER_TABLE_COLUMNS];   
      
          this.tableConfig = {
              columns: colArray,
              data: this.sortedData,
              selection: false,
              showPagination:true,
              totalRecords: total,
              clientPagination: false,
          };
            
          console.log(this.tableConfig);
          }
      });
  }
  updateOrderStatus(item:any,status:any){
    this.sandbox.addUpdateOrders({id:item.id,status:status}).subscribe((res:any) => {
            if(res?.data?.id >0)
            {
                this.getOrders();
            }
        });
    }

  onSelect(event: any) {}

  onClickCell(event: any) {
    console.log(event);
    if (event.key === 'delete') {
        this.deleteRequest(event);
    }
    else if (event.key === 'userId') {
        const ref = this.dialog.openOverlayPanel('Details of '+event.data.userId, OnlineFoodViewDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:'viewUserDetails',
            data: event.data,
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {});
    }
    else if (event.key === 'orders') {
        const ref = this.dialog.openOverlayPanel('Orders of '+event.data.userId, OnlineFoodViewDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:'userSchemes',
            data: event.data,
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
    } 
    else if (event.key === 'edit') {
        const data={...event.data,currentUserType:this.currentUser.userType};
        const userType=this.userTypes.filter((value:any) => value.id===this.selectedUserType)[0].name;
        const ref = this.dialog.openOverlayPanel('Update '+userType, 
        OnlineFoodEditFormComponent, {type:'users', data:data},SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
            if(res?.id>0)
            this.getOrders();
        }); 
    }
  }

  checkForSchemesAction(data:any){
    return data.userType===0;
  }
  checkForEditAction(data:any){
    return  data.currentUser.userId===data.introducedBy;
  }
  checkForDeleteAction(data:any){
    return  data.currentUser.userId===data.introducedBy;
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  addUsers(){
    const userType=this.userTypes.filter((value:any) => value.id===this.selectedUserType)[0].name;
    const ref = this.dialog.openOverlayPanel('Add '+userType, 
      OnlineFoodAddFormComponent, {
        type:'users',
        data:{
            userType:0,
            role:ROLES[0],
            introducedBy:this.currentUser.userId,
            currentUserType:this.currentUser.userType
        }
      },SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getOrders();
      });
  }
  deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.userName || '');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:event.data.id,type:3}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                {
                  this.getOrders();
                }
            });
        }
    });
  }

  downloadExcel(){
    this.sandbox.downloadExcel(this.sortedData,'users','Users');
  }

}