import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { ORDERS_STATUSES, ROLES, STATUSES, USER_TABLE_COLUMNS, USER_TYPES } from '../constants/meta-data';
import { DECISION, USER_TYPE } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { OnlineFoodViewDetailsComponent } from '../online-food-view-details/online-food-view-details.component';
import { OnlineFoodEditFormComponent } from '../online-food-edit-form/online-food-edit-form.component';
@Component({
  selector: 'app-online-food-orders',
  templateUrl: './online-food-orders.component.html',
  styleUrls: ['./online-food-orders.component.scss']
})
export class OnlineFoodOrdersComponent implements OnInit {
    statuses=[...['All'],...ORDERS_STATUSES];
    currentUser!:UserContext;
    sortedData:Array<any>=[];
    selectedStatus:any='pending';
    constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox, private appContext:ApplicationContextService) { 
        this.appContext.currentUser.subscribe((res) => (this.currentUser = res));
    }
    ngOnInit(): void {       
        this.getOrders();
    }

    updateStatus(event:any,status:string){
        this.selectedStatus=status;
        this.getOrders();

    }
    getOrders(){
        let query:any={userId:this.currentUser.userId};
        if(this.selectedStatus!=='All'){
            query.status=this.selectedStatus;
        }
        this.sandbox.getOrders(query).subscribe((res:any) => {
            this.sortedData=res?.data?.data || [];
            console.log(this.sortedData);
        });
    }
    cancelOrder(item:any){
        this.sandbox.addUpdateOrders({id:item.id,status:'cancelled'},'cancel').subscribe((res:any) => {
            if(res?.data?.id >0)
            {
                this.getOrders();
            }
        });
    }
    orderAgain(item:any){
        let payload:any={
            ...{
                userId:'',
                amount_paid:parseFloat('0'),
              total_products:0,
              quantity:0,
              product_details:[]
            },
            ...item
          };
          payload.status='pending';
          payload.amount_paid=parseFloat(payload.amount_paid);
          delete payload.id;
         this.sandbox.addUpdateOrders(payload).subscribe((res:any) => {
              if(res?.data?.id >0)
              {
                this.selectedStatus='pending';
                this.getOrders();
              }
          });
    }
  onClickCell(event: any) {
    console.log(event);
    if (event.key === 'delete') {
        this.deleteRequest(event);
    }
    else if (event.key === 'orders') {
        const ref = this.dialog.openOverlayPanel('Orders of '+event.data.userId, OnlineFoodViewDetailsComponent, {
            mode: event.key === 'edit'?DECISION.ADD:DECISION.VIEW,
            type:'userSchemes',
            data: event.data,
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
    } 
    else if (event.key === 'edit') {
        const data={...event.data};        
        const ref = this.dialog.openOverlayPanel('Update ', 
        OnlineFoodEditFormComponent, {type:'orders', data:data},SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
            if(res?.id>0)
            this.getOrders();
        }); 
    }
  }


  deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.userName || '');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:event.data.id,type:3}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                {
                  this.getOrders();
                }
            });
        }
    });
  }


}