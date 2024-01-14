import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { SCHEME_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';

@Component({
  selector: 'app-sgs-refferals',
  templateUrl: './sgs-refferals.component.html',
  styleUrls: ['./sgs-refferals.component.scss']
})
export class SgsRefferalsComponent implements OnInit {

  config!: SGSTableConfig;
  query!: SGSTableQuery;
  @Input() type=1;
  schemesConfig:any={type:'referrals'};
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
                txnAmount: 10000,   
                months:12,
                currentState:'Approved'
            },
            {
                created:new Date(),
                userId:'SGS387465',
                txnAmount: 25000,  
                months:6, 
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
        let colArray = [...SCHEME_TABLE_COLUMNS, editCol, delCol];
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
   
      const ref = this.dialog.openOverlayPanel('Update', SgsUpdateUserComponent, {
          mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
          type:1,
          data: event.data,
      },SgsDialogType.medium);
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

