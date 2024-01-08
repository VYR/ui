import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsDetailsComponent } from '../sgs-details/sgs-details.component';

@Component({
  selector: 'app-sgs-users',
  templateUrl: './sgs-users.component.html',
  styleUrls: ['./sgs-users.component.scss']
})
export class SgsUsersComponent implements OnInit {
    tableConfig!: SGSTableConfig;
    query!: SGSTableQuery;
    @Input() roleType=0;
    sortedData:Array<any>=[];
    constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
    userTypes=[...[{id:-1,name:'All'}],...USER_TYPES];
    statuses=[...['All'],...STATUSES];
    selectedUserType=3;
    selectedStatus='active';
    ngOnInit(): void {  
        this.getSgsUsers();
    }
    lazyLoad(event: SGSTableQuery) {
        if (event.sortKey) {
            event.sortKey = event.sortKey === 'term' ? 'sortTerm' : event.sortKey;
            this.sortedData = this.sortedData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
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
        console.log(this.selectedUserType);
        console.log(this.selectedStatus);
        this.sandbox.getSgsUsers({userType:this.selectedUserType,status:this.selectedStatus}).subscribe((res: any) => {
            if(res?.data){
            this.sortedData=res?.data || [];
            this.sortedData=this.sortedData.map((value:any) => {
                value.schemes='Details';
                return value;
            });
            this.query=new SGSTableQuery();
            this.query.sortKey='created_at';
            this.query.sortDirection=SortDirection.desc;
            this.lazyLoad(this.query);
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
    } else {
        if (event.data.currentState === 'Awaiting Approval') {
            // this.sandbox.getPendingReqHistory({ refNo: event.data.sgsRef }).subscribe((res: any) => {
            //     event.data['pendingHistory'] = res.data;
            //     this.openSummary(event);
            // });
        } else {
            this.openSummary(event);
        }
    }
}

openSummary(event: any) {
    const name=(this.roleType===0?'Client':'Dealer');
    if(event.key==='schemeType' || event.key==='clients')
    {
        /*const ref = this.dialog.openOverlayPanel(event.data.userId+(event.key==='schemeType'?' Schemes':' Clients'), SgsUserDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:event.key,
            data: event.data,
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});*/
    }
    else{
      const ref = this.dialog.openOverlayPanel(event.key === 'edit'?'Update '+name:'View '+name, SgsUpdateUserComponent, {
          mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
          type:1,
          data: event.data,
      },SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {});
    }
    
}



  loadDataTable() {
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
    let colArray = [...USER_TABLE_COLUMNS, editCol, delCol];
    if(this.sandbox.currentUser.userType===1 && this.roleType!=0){
        colArray.splice(3,0,{
            key: 'clients',
            displayName: 'Clients',
            type: ColumnType.link,
            sortable:true
        });
    }

    this.tableConfig = {
        columns: colArray,
        data: this.sortedData,
        selection: false,
        totalRecords: this.sortedData.length,
        clientPagination: true,
    };
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

/*
  onClickCell(event: any) {
    console.log(event);
    if (event.key === 'delete') {
        this.deleteRequest(event);
    } else {
        this.openSummary(event);
    }
  }

  openSummary(event: any) {   
      const ref = this.dialog.openOverlayPanel('Update Scheme Type', 
      SgsEditFormsComponent, {
        type:'schemeTypes',
        data: event.data,
      },SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {
        if(res?.id===event.data.id)
        this.getSgsUsers();
      });    
  }
  */
  addUsers(){
    const userType=this.userTypes.filter((value:any) => value.id===this.selectedUserType)[0].name;
    const ref = this.dialog.openOverlayPanel('Add '+userType, 
      SgsAddFormsComponent, {
        type:'users',
        data:{
            userType:this.selectedUserType,
            role:ROLES[this.selectedUserType],
            introducedBy:this.sandbox.currentUser.userId,
            currentUserType:this.sandbox.currentUser.userType
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
    this.sandbox.downloadExcel(this.sortedData,'scheme_types','SchemeTypes');
  }

}
