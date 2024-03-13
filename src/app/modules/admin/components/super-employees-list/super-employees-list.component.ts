import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { AdminSandbox } from '../../admin.sandbox'; 
import { ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from 'src/app/shared/constants/meta-data';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsDetailsComponent } from '../sgs-details/sgs-details.component';

@Component({
  selector: 'app-super-employees-list',
  templateUrl: './super-employees-list.component.html',
  styleUrls: ['./super-employees-list.component.scss']
})
export class SuperEmployeesListComponent implements OnInit {
  tableConfig!: SGSTableConfig;
  query: SGSTableQuery= new SGSTableQuery();
  @Input() roleType=0;
  sortedData:Array<any>=[];
  userTypes=[...[{id:-1,name:'All'}],...USER_TYPES];
  statuses=[...['All'],...STATUSES];
  selectedUserType=4;
  selectedStatus='active';
  currentUser!:UserContext;
  USER_TABLE_COLUMNS=USER_TABLE_COLUMNS;
  enableAddButton:boolean=false;
  constructor(private dialog: SgsDialogService, private sandbox: AdminSandbox, private appContext:ApplicationContextService) {
      this.appContext.currentUser.subscribe((res) => (this.currentUser = res));
  }
  ngOnInit(): void {            
      this.query.sortKey='created_at';
      this.query.sortDirection=SortDirection.desc;
  }
  lazyLoad(event: SGSTableQuery) {
      console.log(this.query);
      console.log(event);
      this.query.pageIndex=event?.pageIndex || 0;
      if(event.sortKey)
          this.query.sortKey=event.sortKey;
      if(event.sortDirection)
      this.query.sortDirection=event.sortDirection;
      this.getSgsUsers();
  }
  updateUserType(event:any,id:any){
      if(event.isUserInput){
          this.selectedUserType=id;
          this.getSgsUsers();
      }
  }
  updateStatus(event:any,status:string){
      if(event.isUserInput){
          this.selectedStatus=status;
          this.getSgsUsers();
      }
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
              //if admin logged in
              if([1,2].includes(this.currentUser.userType))
              value.schemes='Details';
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
              key: 'schemes',
              displayName: 'Schemes',
              sortable: true,
              type: ColumnType.link,        
              callBackFn: this.checkForSchemesAction,
          };
          let refferalCol={
              key: 'referralAmount',
              displayName: 'Referral Amount',
              type: ColumnType.amount,
              sortable:true
          };
          let rolesCol={
              key: 'role',
              displayName: 'User Type',
              sortable:true
          };
          let colArray = [...this.USER_TABLE_COLUMNS, editCol, delCol];
          if([1,2].includes(this.currentUser.userType) && [-1,0].includes(this.selectedUserType)){
              colArray.splice(2,0,schemesCol);
          }    
          if([2,3].includes(this.currentUser.userType)){
              colArray.splice(2,0,refferalCol);
          }   
          if(this.selectedUserType===-1){
              colArray.splice(3,0,rolesCol);
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
      const ref = this.dialog.openOverlayPanel('Details of '+event.data.userId, SgsDetailsComponent, {
          mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
          type:'viewUserDetails',
          data: event.data,
      },SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {});
  }
  else if (event.key === 'schemes') {
      const ref = this.dialog.openOverlayPanel('Schemes of '+event.data.userId, SgsDetailsComponent, {
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
      SgsEditFormsComponent, {type:'users', data:data},SgsDialogType.medium);
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
    SgsAddFormsComponent, {
      type:'users',
      data:{
          userType:this.selectedUserType,
          role:ROLES[this.selectedUserType],
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
          this.sandbox.deleteRequest({id:event.data.id,type:'deleteUser'}).subscribe((res:any) => {
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
