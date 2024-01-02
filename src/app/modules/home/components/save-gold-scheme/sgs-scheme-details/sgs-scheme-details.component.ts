import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { GROUP_SCHEME_PAY_TABLE_COLUMNS, INDIVIDUAL_SCHEME_PAY_TABLE_COLUMNS, INDIVIDUAL_SCHEME_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { SgsUpdateUserComponent } from '../sgs-update-user/sgs-update-user.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/utility';

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
        private router: Router,
        private utilService: UtilService
    ) {
        console.log(this.data.data);
    }
  
    ngOnInit(): void {
      this.lazyLoad(this.query);
    }
    lazyLoad(query: SGSTableQuery) {
  
      this.getRequests();
    }
    
    getRequests() {
     
      //this.sandbox.getRequestList(query, this.status, REQUEST_LIST_TYPE.MY_QUEUE).subscribe((res) => {
          let res:any={data:[
              {
                  created:new Date(),
                  individualAmount: 10000,   
                  individualMonths:1,
                  currentState:'Paid'
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
        let payCol = {
            key: 'pay',
            displayName: 'Pay',
            type: ColumnType.approve,
            icon: '',
            callBackFn: this.restrictPayment
        };
          let colArray = [...INDIVIDUAL_SCHEME_TABLE_COLUMNS, editCol, delCol];
          if(this.data.userType==='clientDetails' || this.data.userType==='dealerDetails'){
            if(this.data.type===3){
            res={data:[
              {
                paidDate:new Date(),
                dueDate:new Date(),
                individualAmount: this.data.data.individualAmount,   
                individualMonthToPay:1,
                currentState:'Paid'
              }
          ],totalRecords:10};
              colArray=[...INDIVIDUAL_SCHEME_PAY_TABLE_COLUMNS, payCol];
              for(let i=2;i<=this.data.data.individualMonths;i++){
                let item={...res.data[0]};
                item.individualMonthToPay=i;
                item.currentState='Due';
                res.data.push(item);
              }
              res.data = res.data.sort((a: any, b: any) => {
                const isAsc =true;
                return this.sandBox.compare(a['individualMonthToPay'], b['individualMonthToPay'], isAsc);
            });
              }
              else{
                res={data:[
                  {
                    paidDate:new Date(),
                    dueDate:new Date(),
                    groupAmount: this.data.data.groupAmountPerMonth,   
                    groupMonthToPay:1,
                    currentState:'Paid'
                  }
              ],totalRecords:10};
              for(let i=2;i<=this.data.data.groupMonths;i++){
                let item={...res.data[0]};
                item.groupMonthToPay=i;
                item.currentState='Due';
                res.data.push(item);
              }
                  colArray=[...GROUP_SCHEME_PAY_TABLE_COLUMNS, payCol];
                  res.data = res.data.sort((a: any, b: any) => {
                    const isAsc =true;
                    return this.sandBox.compare(a['groupMonthToPay'], b['groupMonthToPay'], isAsc);
                });
              }
          }
          res.totalRecords=res.data.length;
          const config = {
              columns: this.type===1?colArray:INDIVIDUAL_SCHEME_TABLE_COLUMNS,
              data: res.data,
              selection: false,
              totalRecords: res.totalRecords || 0,
              pageSizeOptions: [5, 10, 25],
          };
          this.config = config;
     // });
  }
  restrictPayment(data: any) {
    return data.currentState === 'Due';
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
      if(event.key==='pay'){
        const ref = this.dialog.openOverlayPanel('Pay', SgsUpdateUserComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:5,//Payment
            data: event.data,
        },SgsDialogType.small);
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
  