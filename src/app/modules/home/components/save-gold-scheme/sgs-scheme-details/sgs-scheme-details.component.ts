import { Component, Inject, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { SCHEME_PAY_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sgs-scheme-details',
  templateUrl: './sgs-scheme-details.component.html',
  styleUrls: ['./sgs-scheme-details.component.scss']
})
export class SgsSchemeDetailsComponent implements OnInit {
  @Input() type=1;
  config!: SGSTableConfig;
  query!: SGSTableQuery;
  DECISION=DECISION;
  constructor(public dialogRef: MatDialogRef<SgsUpdateUserComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sandBox: HomeSandbox,
    private dialog: SgsDialogService,
    ) 
  {console.log(this.data.data);}
  
  ngOnInit(): void {
    this.lazyLoad(this.query);
  }

  lazyLoad(query: SGSTableQuery) {

    this.getRequests();
  }
    
  getRequests() {     
    let res:any={data:[]};
    for(let i=1;i<=this.data?.data?.no_of_months;i++){
        res.data.push({
            created:new Date(),
            amount_paid: this.data?.data?.amount_per_month,   
            month_paid:i,
            pay:'Pay',
            status:'Due'
        });
    }
    let payCol = {
        key: 'pay',
        displayName: 'Pay',
        type: ColumnType.approve,
        icon: '',
        callBackFn: this.restrictPayment
    };
    let colArray=[...SCHEME_PAY_TABLE_COLUMNS, payCol];
    res.data = res.data.sort((a: any, b: any) => {
        const isAsc =true;
        return this.sandBox.compare(a['month_paid'], b['month_paid'], isAsc);
    });
    const config = {
        columns: colArray,
        data: res.data,
        selection: false,
        totalRecords: res.data.length || 0,
        pageSizeOptions: [5, 10, 25],
    };
    this.config = config;
  }
  restrictPayment(data: any) {
    return data.status === 'Due' && this.sandBox?.currentUser?.userType==USER_TYPE.SCHEME_MEMBER;
  }
  
  onClickCell(event: any) {
      console.log(event);
      if(event.key==='pay'){
        const ref = this.dialog.openOverlayPanel('Pay', SgsUpdateUserComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:5,//Payment
            data: event.data,
        },SgsDialogType.small);
        ref.afterClosed().subscribe((res) => {});
      }
  }
  
  }
  