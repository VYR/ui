import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { SuperEmployeeSandbox } from '../../../../super-empolyee.sandbox'; 
import { ROLES, STATUSES, USER_TYPES } from 'src/app/shared/constants/meta-data';
import { DECISION, SYSTEM_CONFIG } from 'src/app/shared/enums';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsDetailsComponent } from '../../../sgs-details/sgs-details.component';
import { SgsAddFormsComponent } from '../../../sgs-add-forms/sgs-add-forms.component';
import { SgsEditFormsComponent } from '../../../sgs-edit-forms/sgs-edit-forms.component';
import { SgsSchemeDetailsComponent } from '../sgs-scheme-details/sgs-scheme-details.component';

@Component({
  selector: 'app-total-members',
  templateUrl: './total-members.component.html',
  styleUrls: ['./total-members.component.scss']
})
export class TotalMembersComponent  implements OnInit {
  tableConfig!: SGSTableConfig;
  query!: SGSTableQuery;
  @Input() roleType=0;
  sortedData:Array<any>=[];
  superEmployees:Array<any>=[];
  employees:Array<any>=[];
  promoters:Array<any>=[];
  statuses=[...['All'],...STATUSES];
  selectedSuperEmployee="";
  selectedEmployee="";
  selectedPromoter="";  
  selectedScheme:any=0;  
  schemes:Array<any>=[];
  selectedStatus='active';
  selectedSchemeType:any=0;
  selectedUsers:Array<any>=[];
  schemeTypes:Array<any>=[
    {
      id:1,
      scheme_type_name:'Individual'
    },
    {
      id:2,
      scheme_type_name:'Group'
    }
  ];
  cols:Array<any>= [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'userId',
        displayName: 'User ID',
        type: ColumnType.link,
        sortable: true,
    },
    {
        key: 'firstName',
        displayName: 'First Name',
        sortable: true,
    },
    {
        key: 'lastName',
        displayName: 'Last Name',
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
  constructor(private dialog: SgsDialogService, private sandbox: SuperEmployeeSandbox, private appContext:ApplicationContextService) {
  }
  ngOnInit(): void { 
    this.getSuperEmployees();
  }
  getSuperEmployees() {
      let query:any={};
      query.userType=4;
      query.status='active';
      query.pageSize=SYSTEM_CONFIG.DROPDOWN_PAGE_SIZE;
      this.sandbox.getSgsUsers(query).subscribe((res: any) => {
          if(res?.data){
              this.superEmployees=res?.data?.data || [];      
          }
      });
  }
  getEmployees() {
      let query:any={};
      query.userType=3;
      query.status='active'; 
      query.pageSize=SYSTEM_CONFIG.DROPDOWN_PAGE_SIZE;     
      if(this.selectedSuperEmployee.length>0)
      query.introducedBy=this.selectedSuperEmployee;
      this.sandbox.getSgsUsers(query).subscribe((res: any) => {
          if(res?.data)
            this.employees=res?.data?.data || [];          
      });
  }
  getPromoters() {
      let query:any={};
      console.log(query);
      query.userType=2;
      query.status='active'; 
      query.pageSize=SYSTEM_CONFIG.DROPDOWN_PAGE_SIZE;      
      if(this.selectedEmployee.length>0)
      query.introducedBy=this.selectedEmployee;
      this.sandbox.getSgsUsers(query).subscribe((res: any) => {
          if(res?.data)
            this.promoters=res?.data?.data || [];          
      });
  }
lazyLoad(event: SGSTableQuery) {
    this.query=event;
    this.getSgsUsers();
}
updateSelectedSuperEmployee(event:any,id:any){
    if(event.isUserInput){
        this.selectedSuperEmployee=id;
        this.selectedEmployee='';
        this.selectedPromoter='';
        this.sortedData=[]; 
        this.getEmployees();
    }
}
updateSelectedEmployee(event:any,id:any){
    if(event.isUserInput){
        this.selectedEmployee=id;
        this.selectedPromoter='';
        this.sortedData=[]; 
        this.getPromoters();
    }
}
updateSelectedPromoter(event:any,id:any){
    if(event.isUserInput){
        this.selectedPromoter=id;
        this.getSgsUsers();
    }
}
updateSelectedScheme(event:any,scheme:any){
  if(event.isUserInput){
      this.selectedScheme=scheme;
  }
}
updateSelectedSchemeType(event:any,type:any){
  if(event.isUserInput){
      this.selectedSchemeType=type;
      this.schemes=[];
      this.getSgsSchemeNames();
  }
}
applyScheme(){
  if(this.selectedScheme>0 && this.selectedUsers.length>0){
    const payload:Array<any>=this.selectedUsers.map((v:any) => { return {user_id:v.id,scheme_id:this.selectedScheme}});
    console.log(payload);
    this.sandbox.addUpdateSchemeMembers({schemeType:this.selectedSchemeType,schemeMembers:payload}).subscribe((res:any) => {
      if(res.data){
        this.selectedUsers=[];
      }
    },
    (error:any) => {
        console.log(error);
        let errors:Array<any>=error?.error?.data || [];
        errors=errors.map((v:any) => {
          const availableUser=this.selectedUsers.filter((e:any) => e.id===v.user_id)[0];
          v.userId=availableUser.userId;
          v.userName=availableUser.userName; 
          return v;
        });
        const ref = this.dialog.openOverlayPanel('Errors', 
        SgsAddFormsComponent, {type:'schemeMemberErrors', errors:errors},SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
          console.log(res);
          /*   if(res?.data){
              const users=this.selectedUsers.filter((v:any) => {
                const availableUser=errors.filter((e:any) => v.id!==e.user_id);
                return availableUser.length>0;
              });
              console.log(users);
              this.applyScheme();
            } */
        });
    });
  }
}
updateStatus(event:any,status:string){
    if(event.isUserInput){
        this.selectedStatus=status;
        this.getSgsUsers();
    }
}
getSgsSchemeNames() {
      let query:any={...this.query};     
      query.schemeType=this.selectedSchemeType;
      query.pageSize=SYSTEM_CONFIG.DROPDOWN_PAGE_SIZE;
      this.sandbox.getSgsSchemeNames(query).subscribe((res:any) => {       
          if(res?.data?.data){
              this.schemes=res?.data?.data || [];
          }      
      });
  }
getSgsUsers() {
  this.sortedData=[];        
    let query:any={...this.query};
    query.userType=0;
    if(this.selectedStatus!=='All'){
        query.status=this.selectedStatus;
    }    
    if(this.selectedPromoter.length>0){
    query.introducedBy=this.selectedPromoter;    
    this.sandbox.getSgsUsers(query).subscribe((res: any) => {
        if(res?.data){
          this.sortedData=res?.data?.data || [];
          const total:any=res?.data?.total || 0;      
          this.tableConfig = {
              columns: this.cols,
              data: this.sortedData,
              selection: true,
              showPagination:true,
              totalRecords: total,
          };
        }
    });
  }
}


onSelect(event: any) {
  console.log(event);
  this.selectedUsers=event;
}

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
else if (event.key === 'scheme_name') {
  const ref = this.dialog.openOverlayPanel('Scheme: '+event.data.scheme_name, SgsSchemeDetailsComponent, {
      mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
      type:'userSchemes',
      data: event.data,
  },SgsDialogType.large);
  ref.afterClosed().subscribe((res) => {});
}
else if (event.key === 'edit') {
    const data={...event.data,scheme_type_id:2,scheme_id:this.selectedScheme};
    const ref = this.dialog.openOverlayPanel('Update Scheme Member', 
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
const ref = this.dialog.openOverlayPanel('Add Scheme Member', 
  SgsAddFormsComponent, {
    type:'users',
    data:{
        userType:0,
        role:ROLES['0'],
        introducedBy:this.selectedPromoter
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
