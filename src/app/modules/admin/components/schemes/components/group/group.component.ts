import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { AdminSandbox } from '../../../../admin.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../../../delete-request-confirm/delete-request-confirm.component';
import { SgsEditFormsComponent } from '../../../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../../../sgs-add-forms/sgs-add-forms.component';
import { SgsSchemeDetailsComponent } from '../../../sgs-scheme-details/sgs-scheme-details.component';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  tableConfig!: SGSTableConfig;
  query!: SGSTableQuery;  
  sortedData:Array<any>=[];  
  SCHEME_TABLE_COLUMNS=[
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    }, 
    {
        key: 'total_amount',
        displayName: 'Total Amount',
        type: ColumnType.amount,
        sortable: true,
    }, 
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

  constructor(private dialog: SgsDialogService, private sandbox: AdminSandbox) {
    
  }
  
  ngOnInit(): void {
    this.getSgsSchemes();
  }

  lazyLoad(event: SGSTableQuery) {
      if(this.query){
        this.query.pageIndex=event?.pageIndex || 0;
        if(event.sortKey)
            this.query.sortKey=event.sortKey;
        if(event.sortDirection)
        this.query.sortDirection=event.sortDirection;
        this.getSgsSchemes();
      }      
  }
 
  getSgsSchemes() {
      let query:any={...this.query};     
      query.schemeType=2;
      this.sandbox.getSgsSchemes(query).subscribe((res:any) => {       
          if(res?.data?.data){
                this.sortedData=res?.data?.data || [];

                this.query=new SGSTableQuery(); 
                this.query.sortKey='created_at';
                this.query.sortDirection=SortDirection.desc;

                this.tableConfig = {
                    columns: this.SCHEME_TABLE_COLUMNS,
                    data: this.sortedData,
                    selection: false,
                    showPagination:true,
                    totalRecords: this.sortedData.length,
                    clientPagination: true,
                };
          }      
      });
  }

  //Add new schemes
  addScheme(){
    const ref = this.dialog.openOverlayPanel('Add Group Scheme', 
        SgsAddFormsComponent, {
        type:'schemes',
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getSgsSchemes();
        });
    }
  
  onClickCell(event: any) {
      if (event.key === 'delete') {
          this.deleteRequest(event);
      } else if (event.key === 'edit'){
        this.updateScheme(event);
      }
  }

    //Update selected scheme
    updateScheme(event:any){
        const ref = this.dialog.openOverlayPanel('Update Group Scheme', 
        SgsEditFormsComponent, {
        type:'schemes',
        data: event.data,
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id===event.data.id)
        this.getSgsSchemes();
        }); 
    }
  deleteRequest(event: any) {
      const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, 'this row');
      ref.afterClosed().subscribe((result: any) => {
          if (result.decision === DECISION.CONFIRM) {
              this.sandbox.deleteRequest({id:event.data.id,type:2}).subscribe((res:any) => {
                  if(res?.deleteStatus === 1)
                  {
                  this.getSgsSchemes();
                  }
              });
          }
      });
  }
  
  downloadExcel(){
      this.sandbox.downloadExcel(this.sortedData,'schemes','Admin_Group_Schemes');
  }
}


