import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { SuperEmployeeSandbox } from '../../super-empolyee.sandbox'; 
import { ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from 'src/app/shared/constants/meta-data';
import { DECISION, SYSTEM_CONFIG, USER_TYPE } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
import { SgsDetailsComponent } from '../sgs-details/sgs-details.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit{
  tableConfig!: SGSTableConfig;
  query: SGSTableQuery= new SGSTableQuery();
  @Input() roleType=0;
  sortedData:Array<any>=[];
  userTypes=[...[{id:-1,name:'All'}],...USER_TYPES];
  statuses=[...['All'],...STATUSES];
  selectedSuperEmployee="";
  selectedStatus='active';
  USER_TABLE_COLUMNS=USER_TABLE_COLUMNS;
  enableAddButton:boolean=false;
  currentUser!:UserContext;
  constructor(private dialog: SgsDialogService, private sandbox: SuperEmployeeSandbox, private appContext:ApplicationContextService) {
    this.appContext.currentUser.subscribe((res:any) => {this.currentUser=res;});
  }
  ngOnInit(): void {  
    this.selectedSuperEmployee=this.currentUser.userId;          
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

  updateStatus(event:any,status:string){
      if(event.isUserInput){
          this.selectedStatus=status;
          this.getSgsUsers();
      }
  }
  getSgsUsers() {        
      let query:any={...this.query};
      console.log(query);
      query.userType=3;
      if(this.selectedStatus!=='All'){
          query.status=this.selectedStatus;
      }
      query.introducedBy=this.selectedSuperEmployee;
      this.sandbox.getSgsUsers(query).subscribe((res: any) => {
          if(res?.data){
              this.sortedData=res?.data?.data || [];
              const total:any=res?.data?.total || 0;
              console.log(total);
          let editCol = {
              key: 'edit',
              displayName: 'Edit',
              type: ColumnType.icon,
              icon: 'la-edit',
               
          };
          let delCol = {
              key: 'delete',
              displayName: 'Delete',
              type: ColumnType.icon,
              icon: 'la-trash',
               
          };
           

          let colArray = [...this.USER_TABLE_COLUMNS, editCol, delCol];
      
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
      const data={...event.data,currentUserType:3};
      const ref = this.dialog.openOverlayPanel('Update Employee', 
      SgsEditFormsComponent, {type:'users', data:data},SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {
          if(res?.id>0)
          this.getSgsUsers();
      }); 
  }
}

compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

addUsers(){
  const ref = this.dialog.openOverlayPanel('Add Employee', 
    SgsAddFormsComponent, {
      type:'users',
      data:{
          userType:3,
          role:ROLES['3'],
          introducedBy:this.selectedSuperEmployee
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
