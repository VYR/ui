import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from '../constants/meta-data';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { OnlineFoodViewDetailsComponent } from '../online-food-view-details/online-food-view-details.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
import { OnlineFoodAddFormComponent } from '../online-food-add-form/online-food-add-form.component';

@Component({
  selector: 'app-online-food-users',
  templateUrl: './online-food-users.component.html',
  styleUrls: ['./online-food-users.component.scss']
})
export class OnlineFoodUsersComponent implements OnInit {
  tableConfig!: SGSTableConfig;
  query: SGSTableQuery= new SGSTableQuery();
  @Input() roleType=0;
  sortedData:Array<any>=[];
  userTypes=[...[{id:-1,name:'All'}],...USER_TYPES];
  statuses=[...['All'],...STATUSES];
  selectedUserType=0;
  selectedStatus='active';
  currentUser!:UserContext;
  USER_TABLE_COLUMNS=USER_TABLE_COLUMNS;
  enableAddButton:boolean=false;
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox, private appContext:ApplicationContextService) {
    this.appContext.setPageTitle('Users');  
    this.appContext.currentUser.subscribe((res) => (this.currentUser = res));
  }
  ngOnInit(): void {       
      this.query.sortKey='created_at';
      this.query.sortDirection=SortDirection.desc;
      this.getSgsUsers();
  }

  lazyLoad(event: SGSTableQuery) {
      console.log(this.query);
      console.log(event);
      this.query.pageIndex=event?.pageIndex || 0;
      if(event.sortKey)
          this.query.sortKey=event.sortKey;
      if(event.sortDirection)
      this.query.sortDirection=event.sortDirection;
      //this.getSgsUsers();
  }
  updateUserType(event:any,id:any){
          this.selectedUserType=id;
          this.getSgsUsers();
  }
  updateStatus(event:any,status:string){
          this.selectedStatus=status;
          this.getSgsUsers();
  }
  getSgsUsers() {        
      let query:any={...this.query};
      console.log(query);
      if(this.selectedUserType>-1){
          query.userType=this.selectedUserType;
      }
      if(this.selectedStatus!=='All'){
          query.status=this.selectedStatus;
      }
      this.sandbox.getSgsUsers(query).subscribe((res: any) => {
          if(res?.data){
              this.sortedData=res?.data?.data || [];
              const total:any=res?.data?.total || 0;
              console.log(total);
          this.sortedData=this.sortedData.map((value:any) => {
              value.currentUser=this.currentUser;
              value.orders='Details';
              return value;
          });
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
          let schemesCol={
              key: 'orders',
              displayName: 'Orders',
              sortable: true,
              type: ColumnType.link
          };
          let colArray = [...this.USER_TABLE_COLUMNS, editCol, delCol];
          if([1,2].includes(this.currentUser.userType) && [-1,0].includes(this.selectedUserType)){
              colArray.splice(2,0,schemesCol);
          }    
      
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
            this.getSgsUsers();
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
        this.getSgsUsers();
      });
  }
  deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.userName || '');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:event.data.id,type:3}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                {
                  this.getSgsUsers();
                }
            });
        }
    });
  }

  downloadExcel(){
    this.sandbox.downloadExcel(this.sortedData,'users','Users');
  }

}