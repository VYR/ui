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
  sortedData:Array<any>=[];
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
      let data:any={
            created_at:this.data?.data?.created_at,
            amount_paid: this.data?.data?.amount_per_month,   
            month_paid:i,
            dueDate: new Date().setMonth(new Date().getMonth()+i),
            pay:'Pay',
            remind:'Send Reminder',
            pdf:'Pdf',
            status:'Due'
        };
        if(i==1){
          data['paidDate']=new Date().setMonth(new Date().getMonth()-1);
          data['status']='Paid';
        }
        res.data.push(data);
    }
    let payCol = {
        key: 'pay',
        displayName: 'Pay',
        type: ColumnType.approve,
        callBackFn: this.restrictPayment
    };
    let remindCol = {
        key: 'remind',
        displayName: 'Send Reminder',
        type: ColumnType.button,
        callBackFn: this.restrictPayment
    };
    let pdfCol=
    {
        key: 'pdf',
        displayName: 'Receipt',
        type: ColumnType.icon,
        icon: 'la-file-pdf',
        callBackFn: this.checkForPdfAction,
        minWidth: 3,
    };
    let colArray:any=[...SCHEME_PAY_TABLE_COLUMNS];
    if(this.sandBox.currentUser.userType===0)
    colArray=[...SCHEME_PAY_TABLE_COLUMNS, payCol,pdfCol];
    if(this.sandBox.currentUser.userType===2)
    colArray=[...SCHEME_PAY_TABLE_COLUMNS, remindCol];
    res.data = res.data.sort((a: any, b: any) => {
        const isAsc =true;
        return this.sandBox.compare(a['month_paid'], b['month_paid'], isAsc);
    });
    this.sortedData=res.data;
    const config = {
        columns: colArray,
        data: this.sortedData,
        selection: false,
        totalRecords: this.sortedData.length || 0,
        pageSizeOptions: [5, 10, 25],
    };
    this.config = config;
  }

  restrictPayment(data: any) {
    return data.status === 'Due';
  }

  checkForPdfAction(data: any) {
    return (data.status === 'Paid');
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
  
  downloadExcel(){
    this.sandBox.downloadExcel(this.sortedData,'payments', (this.data?.data?.scheme_type_id===1?'Individual':'Group')+' Scheme Payment Details');
  }
}
  