import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { INDIVIDUAL_SCHEME_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsSchemeDetailsComponent } from '../sgs-scheme-details/sgs-scheme-details.component';

@Component({
  selector: 'app-sgs-scheme-individual',
  templateUrl: './sgs-scheme-individual.component.html',
  styleUrls: ['./sgs-scheme-individual.component.scss']
})
export class SgsSchemeIndividualComponent implements OnInit {

    @Input() type=1;
  config!: SGSTableConfig;
  query!: SGSTableQuery;  
  detailsName='clientDetails';
  constructor(private router: Router, private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
   
  INDIVIDUAL_SCHEME_TABLE_COLUMNS=INDIVIDUAL_SCHEME_TABLE_COLUMNS;

  ngOnInit(): void {
    if(this.sandbox.currentUser.userType==1){
        this.detailsName='adminDetails';
        }
        else if(this.sandbox.currentUser.userType==2)
        this.detailsName='dealerDetails';
    console.log(this.sandbox.currentUser.userType);
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
                individualAmount: 10000,
                referralAmount:28374,   
                individualMonths:12,
                currentState:'Approved'
            },
            {
                created:new Date(),
                userId:'SGS387465',
                individualAmount: 25000,  
                referralAmount:28374,  
                individualMonths:6, 
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
        let detailsCol = {
            key: this.detailsName,
            displayName: 'Details',
            type: ColumnType.link,
        };       
        let referralCol = {
            key: 'referral',
            displayName: 'Details',
            type: ColumnType.link,
        };
        this.INDIVIDUAL_SCHEME_TABLE_COLUMNS=INDIVIDUAL_SCHEME_TABLE_COLUMNS.map((value:any)=>{
            if(value.key==='created' && this.sandbox.currentUser.userType!=1){
                value.displayName='Joined Date';
                return value;
            }
            else 
            return value;
        });
        
        if(this.type===2){
            this.INDIVIDUAL_SCHEME_TABLE_COLUMNS.splice(3,0,{
                key: 'referralAmount',
                displayName: 'Earned Amount',
                type: ColumnType.amount,
                sortable:true
            });
            this.detailsName='referral';
        }
        let referralCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, referralCol];
        let clientCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol];
        let dealerCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol];
        let adminCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol, editCol, delCol];        
        let colArray = clientCols;
        if(this.sandbox.currentUser.userType==1)
        colArray=adminCols;
        else if(this.sandbox.currentUser.userType==2)
        colArray=dealerCols;
    
        res.data=res.data.map((value:any) => {
            value[this.detailsName]='Details';
            return value;
        });
        const config = {
            columns: this.type===1?colArray:(this.type===2?referralCols:this.INDIVIDUAL_SCHEME_TABLE_COLUMNS),
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
      const ref = this.dialog.openOverlayPanel( event.key === 'edit'?'Update Individual Scheme':'Make Payment', 
      event.key === 'edit'?SgsUpdateUserComponent:SgsSchemeDetailsComponent, {
        mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
        type:3,
        userType:this.detailsName,
        data: event.data,
      }, event.key === 'edit'?SgsDialogType.medium:SgsDialogType.large);
      ref.afterClosed().subscribe((res) => {});
    
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
