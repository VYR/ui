import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { AdminSandbox } from '../../../../admin.sandbox'; 
import { ROLES, STATUSES, USER_TYPES } from 'src/app/shared/constants/meta-data';
import { DECISION, SYSTEM_CONFIG } from 'src/app/shared/enums';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsDetailsComponent } from '../../../sgs-details/sgs-details.component';
import { SgsAddFormsComponent } from '../../../sgs-add-forms/sgs-add-forms.component';
import { SgsEditFormsComponent } from '../../../sgs-edit-forms/sgs-edit-forms.component';
import { SgsSchemeDetailsComponent } from '../sgs-scheme-details/sgs-scheme-details.component';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit {
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
  selectedStatus='active';
  selectedScheme:any;  
  schemes:Array<any>=[];
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
      },
      {
          key: 'lastName',
          displayName: 'Last Name',
      },
      {
          key: 'scheme_name',
          displayName: 'Scheme',
          type: ColumnType.link,
      }, 
      {
          key: 'scheme_date',
          displayName: 'Scheme Date',
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
  constructor(private dialog: SgsDialogService, private sandbox: AdminSandbox, private appContext:ApplicationContextService) {
  }
  ngOnInit(): void {            
    this.getSuperEmployees();
    this.getSgsSchemeNames();
  }
  getSgsSchemeNames() {
        let query:any={...this.query};     
        query.schemeType=1;
        query.pageSize=SYSTEM_CONFIG.DROPDOWN_PAGE_SIZE; 
        this.sandbox.getSgsSchemes(query).subscribe((res:any) => {       
            if(res?.data?.data){
                this.schemes=res?.data?.data || [];
            }      
        });
    }
getSchemeMembers(event:any,scheme:any){
    if(event.isUserInput){
        this.selectedScheme=scheme;
        this.getSgsUsers();
    }
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
    this.query.pageIndex=event?.pageIndex || 0;
    if(event.sortKey)
        this.query.sortKey=event.sortKey;
    if(event.sortDirection)
    this.query.sortDirection=event.sortDirection;
    this.getSgsUsers();
}
updateSelectedSuperEmployee(event:any,id:any){
    if(event.isUserInput){
        this.selectedSuperEmployee=id;
        this.sortedData=[]; 
        this.getEmployees();
    }
}
updateSelectedEmployee(event:any,id:any){
    if(event.isUserInput){
        this.selectedEmployee=id;
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
updateStatus(event:any,status:string){
    if(event.isUserInput){
        this.selectedStatus=status;
        this.getSgsUsers();
    }
}

getSgsUsers() {
  this.sortedData=[];        
    let query:any={...this.query};
    query.userType=0;
    if(this.selectedStatus!=='All'){
        query.status=this.selectedStatus;
    }    
    if(this.selectedPromoter.length>0)
      query.introducedBy=this.selectedPromoter;  
      query.schemeType=1;  
      query.scheme_id=this.selectedScheme?.id || 0;
      if(query.scheme_id>0) 
    this.sandbox.getSchemeMembers(query).subscribe((res: any) => {
        if(res?.data){
          this.sortedData=res?.data?.data || [];
          const total:any=res?.data?.total || 0;      
          this.tableConfig = {
              columns: this.cols,
              data: this.sortedData,
              selection: false,
              showPagination:true,
              totalRecords: total,
              clientPagination: false,
          };
        }
    });
    else 
    this.sortedData=[];
  
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
    else if (event.key === 'scheme_name') {
        const ref = this.dialog.openOverlayPanel('Scheme: '+event.data.scheme_name+' Started on '+event.data.scheme_date, SgsSchemeDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:'userSchemes',
            data: event.data,
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
    } 
    else if (event.key === 'edit') {
        const data={...event.data};
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
const ref = this.dialog.openOverlayPanel('Add Individual Scheme Member', 
  SgsAddFormsComponent, {
    type:'users',
    data:{
        userType:0,
        role:ROLES['0'],
        introducedBy:this.selectedPromoter,
        scheme_type_id:1,
        super:this.selectedSuperEmployee,
        employee:this.selectedEmployee,
        promoter:this.selectedPromoter,
        scheme_id:this.selectedScheme?.id || null
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