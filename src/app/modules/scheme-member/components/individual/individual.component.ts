import { Component, Inject, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SgsAddFormsComponent } from 'src/app/modules/admin/components/sgs-add-forms/sgs-add-forms.component';
import { UserContext } from 'src/app/shared/models';
import { SchemeMemberSandbox } from '../../scheme-member.sandbox';
import { SCHEME_PAY_TABLE_COLUMNS } from 'src/app/shared/constants/meta-data';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit {
  @Input() data!:any;
  config!: SGSTableConfig;
  query: SGSTableQuery=new SGSTableQuery();
  DECISION=DECISION;
  sortedData:Array<any>=[];  
  currentUser!:UserContext;
  SCHEME_TABLE_COLUMNS=[
    {
        key: 'no_of_months',
        displayName: 'No of Months',
        sortable: true,
    }, 
    {
        key: 'amount_per_month',
        displayName: 'Amount Per Month',
        type: ColumnType.amount,
        sortable: true,
    },
    {
        key: 'status',
        displayName: 'Status',
        type: ColumnType.status,
        sortable: true,
    }
  ];
  constructor( private sandBox: SchemeMemberSandbox,
    private dialog: SgsDialogService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.query.sortKey='created_at';
    this.query.sortDirection=SortDirection.desc;
  }
  lazyLoad(event: SGSTableQuery) {
    if(this.query){
      this.query.pageIndex=event?.pageIndex || 0;
      if(event.sortKey)
          this.query.sortKey=event.sortKey;
      if(event.sortDirection)
      this.query.sortDirection=event.sortDirection;
    } 
    this.getPayments();
  }
    
  getPayments() {   
    this.sandBox.getPayments({scheme_member_id:this.data?.scheme_member_id,scheme_id:this.data?.scheme_id}).subscribe((res1: any) => {
      
        
        let res:any={data:[]};
        for(let i=1;i<=this.data?.no_of_months;i++){
          let data:any={
                created_at:this.data?.scheme_date,
                amount_paid: this.data?.amount_per_month, 
                scheme_id: this.data?.scheme_id, 
                scheme_member_id: this.data?.scheme_member_id,  
                userId: this.data?.userId,   
                winning_month: this.data?.winning_month,   
                is_winner: this.data?.winning_month===i?this.data?.is_winner:'NO',   
                month_paid:i,
                dueDate: new Date(this.data?.scheme_date).setMonth(new Date(this.data?.scheme_date).getMonth()+i),
                pay:'Pay',
                remind:'Send Reminder',
                txnNo:'',
                pdf:'Pdf',
                status:'Due'
            };           
            res.data.push(data);
        }
        if(res1?.data){ 
          const paidData:Array<any>= res1?.data || [];
          if(paidData.length>0){
            res.data=res.data.map((data:any) => {
              const currentPaid:Array<any>=paidData.filter((x:any) => x.month_paid==data.month_paid);
              if(currentPaid.length>0){
                data['amount_paid']=currentPaid[0].amount_paid;
                data['txnNo']=currentPaid[0].txnNo;
                data['paidDate']=currentPaid[0].created_at;
                data['status']='Paid';
              }
              return data;
            });
          }
          
        }
        let pdfCol=
        {
            key: 'pdf',
            displayName: 'Receipt',
            type: ColumnType.icon,
            icon: 'la-file-pdf',
            callBackFn: this.checkForPdfAction,
            minWidth: 3,
        };
        let payCol = {
          key: 'pay',
          displayName: 'Pay',
          type: ColumnType.approve,
          callBackFn: this.restrictPayment
      };
        let colArray:any=[...SCHEME_PAY_TABLE_COLUMNS,payCol, pdfCol];
        res.data = res.data.sort((a: any, b: any) => {
            const isAsc =true;
            return this.sandBox.compare(a['month_paid'], b['month_paid'], isAsc);
        });
        this.sortedData=res.data;
        const config = {
            columns: colArray,
            data: this.sortedData,
            selection: false,
            showPagination:false,
            totalRecords: this.sortedData.length || 0,
            pageSizeOptions: [5, 10, 25],
        };
        this.config = config;
     
    
    });
  }

  restrictPayment(data: any) {
    return data.status === 'Due';
  }

  checkForPdfAction(data: any) {
    return (data.status === 'Paid');
  }
  checkForWinnerAction(data: any) {
    return (data.is_winner === 'YES');
  }
  
  onClickCell(event: any) {
      console.log(event);
      if(event.key==='pay'){
        const ref = this.dialog.openOverlayPanel('Pay', SgsAddFormsComponent, {
            type:'payment',
            data: event.data,
        },SgsDialogType.small);
        ref.afterClosed().subscribe((res) => {
          if(res?.id>0)
          this.getPayments();
          }); 
      }      
  }
  
  downloadExcel(){
    this.sandBox.downloadExcel(this.sortedData,'payments', (this.data?.scheme_type_id===1?'Individual':'Group')+' Scheme Payment Details');
  }
}
