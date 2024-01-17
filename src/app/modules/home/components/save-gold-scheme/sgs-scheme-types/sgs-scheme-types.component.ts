import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
@Component({
  selector: 'app-sgs-scheme-types',
  templateUrl: './sgs-scheme-types.component.html',
  styleUrls: ['./sgs-scheme-types.component.scss']
})
export class SgsSchemeTypesComponent implements OnInit {

  @Input() type=1;
  tableConfig!: SGSTableConfig;
  query!: SGSTableQuery;  
  sortedData:Array<any>=[];
  columns= [
    {
        key: 'created_at',
        displayName: 'Created Date',
        type: ColumnType.date,
        sortable: true,
    },
    {
        key: 'scheme_type_name',
        displayName: 'Scheme Type',
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
    // {
    //   key: 'edit',
    //   displayName: 'Edit',
    //   type: ColumnType.icon,
    //   icon: 'la-edit',
    // },
    // {
    //   key: 'delete',
    //   displayName: 'Delete',
    //   type: ColumnType.icon,
    //   icon: 'la-trash',
    // }
  ];
  constructor(private dialog: SgsDialogService, private sandbox: HomeSandbox) {}

  ngOnInit(): void {  
    this.getSgsSchemeTypes();
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

  loadDataTable() {
    this.tableConfig = {
        columns: this.columns,
        data: this.sortedData,
        selection: false,
        showPagination:true,
        totalRecords: this.sortedData.length,
        clientPagination: true,
    };
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  getSgsSchemeTypes() {
    this.sandbox.getSgsSchemeTypes().subscribe((res: any) => {
      if(res?.data){
        this.sortedData=res?.data || [];
        this.query=new SGSTableQuery();
        this.query.sortKey='created_at';
        this.query.sortDirection=SortDirection.desc;
        this.lazyLoad(this.query);
      }
    });
  }

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
        this.getSgsSchemeTypes();
      });    
  }
  addSchemeType(){
    const ref = this.dialog.openOverlayPanel('Add Scheme Type', 
      SgsAddFormsComponent, {
        type:'schemeTypes',
      },SgsDialogType.medium);
      ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getSgsSchemeTypes();
      });
  }
  deleteRequest(event: any) {
    const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, event.data?.scheme_type_name || '');
    ref.afterClosed().subscribe((result: any) => {
        if (result.decision === DECISION.CONFIRM) {
            this.sandbox.deleteRequest({id:event.data.id,type:1}).subscribe((res:any) => {
                if(res?.deleteStatus === 1)
                {
                  this.getSgsSchemeTypes();
                }
            });
        }
    });
  }

  downloadExcel(){
    this.sandbox.downloadExcel(this.sortedData,'scheme_types','SchemeTypes');
  }
}

