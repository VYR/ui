import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { USER_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsUserDetailsComponent } from '../sgs-user-details/sgs-user-details.component';

@Component({
  selector: 'app-sgs-users',
  templateUrl: './sgs-users.component.html',
  styleUrls: ['./sgs-users.component.scss']
})
export class SgsUsersComponent implements OnInit {
  config!: SGSTableConfig;
  query!: SGSTableQuery;
  @Input() roleType=0;
  constructor(private router: Router, private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
   

  ngOnInit(): void {
    this.lazyLoad(this.query);
  }

  lazyLoad(query: SGSTableQuery) {

    this.getRequests();
  }
  
  getRequests() {
   
    //this.sandbox.getRequestList(query, this.status, REQUEST_LIST_TYPE.MY_QUEUE).subscribe((res) => {
        const res={data:[
            {
                created:new Date(),
                userId:'SGS387465',
                schemeType:'Details',   
                clients:'Details',             
                firstName:'Yellamandarao',    
                lastName:'Vemula',
                email:'user@sgs.com',
                mobilePhone:'23654766',
                aadhar:'23654766',
                pan:'SDKIW4982H',
                currentState:'Approved'
            },
            {
                created:new Date(),
                userId:'SGS387465',
                schemeType:'Details',     
                clients:'Details',               
                firstName:'Yellamandarao',    
                lastName:'Vemula',
                email:'user@sgs.com',
                mobilePhone:'23654766',
                aadhar:'23654766',
                pan:'SDKIW4982H',
                currentState:'Pending'
            }
        ],totalRecords:10};
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
        for(let i=2;i<=99;i++){
            let item={...res.data[0]};
            item.currentState='Pending';
            res.data.push(item);
          }
          res.totalRecords=res.data.length;
        const config = {
            columns: colArray,
            data: res.data,
            selection: false,
            totalRecords: res.totalRecords || 0,
            pageSizeOptions: [5, 10, 25],
        };
        this.config = config;
   // });
}

onSelect(event: any) {}

onClickCell(event: any) {
    console.log(event);
    if (event.key === 'delete') {
        this.deleteRequest(event);
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
        const ref = this.dialog.openOverlayPanel(event.data.userId+(event.key==='schemeType'?' Schemes':' Clients'), SgsUserDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:event.key,
            data: event.data,
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
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

deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data);
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            // this.sandbox.deleteRequest(result.data).subscribe((res) => {
            //     this.getRequests();
            // });
        }
    });
}

}
