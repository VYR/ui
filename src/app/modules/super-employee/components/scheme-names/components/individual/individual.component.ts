import { Component, Input, OnInit } from '@angular/core';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
import { SuperEmployeeSandbox } from 'src/app/modules/super-employee/super-empolyee.sandbox';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit  {
    tableConfig!: SGSTableConfig;
    query!: SGSTableQuery;  
    sortedData:Array<any>=[]; 
    schemes:Array<any>=[];
    selectedScheme:any 
    SCHEME_TABLE_COLUMNS=[
      {
          key: 'scheme_name',
          displayName: 'Scheme Name',
          sortable: true,
      },
      {
          key: 'scheme_start_date',
          displayName: 'Scheme Date',
          type:ColumnType.onlyDate,
          sortable: true,
      }, 
      {
          key: 'status',
          displayName: 'Status',
          type: ColumnType.status,
          sortable: true,
      },
    ];
  
    constructor(private dialog: SgsDialogService, private sandbox: SuperEmployeeSandbox) {
      
    }
    
    ngOnInit(): void {
      this.getSchemesByType();
    }
    getSchemesByType(){
      this.schemes=[];
      this.sandbox.getSgsSchemes({schemeType:1}).subscribe((res:any) => {       
          if(res?.data?.data){
              this.schemes=res?.data?.data || [];
              const sortkey='total_amount';
              this.schemes = this.schemes.sort((a: any, b: any) => {
                const isAsc = true;
                return this.compare(a[sortkey], b[sortkey], isAsc);
            });
            if(this.schemes.length>0){
              this.selectedScheme=this.schemes[0];
              this.query=new SGSTableQuery();
              this.query.sortKey='created_at';
              this.query.sortDirection=SortDirection.desc;
              this.getSgsSchemeNames({isUserInput:true},this.selectedScheme);
            }
          }      
      });
    }
    compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  } 
    lazyLoad(event: SGSTableQuery) {
        if(this.query){
          this.query.pageIndex=event?.pageIndex || 0;
          if(event.sortKey)
              this.query.sortKey=event.sortKey;
          if(event.sortDirection)
          this.query.sortDirection=event.sortDirection;
          //this.getSgsSchemes();
        }      
    }
   
    getSgsSchemeNames(event:any,scheme:any) {
      if(event.isUserInput){
        let query:any={...this.query};     
        query.scheme_id=scheme.id;
        this.sandbox.getSgsSchemeNames(query).subscribe((res:any) => {       
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
    }
  
    //Add new schemes
    addSchemeName(){
      const ref = this.dialog.openOverlayPanel('Add Individual Scheme Name', 
          SgsAddFormsComponent, {
          type:'schemeNames',
          data:{scheme_id:this.selectedScheme.id}
          },SgsDialogType.medium);
          ref.afterClosed().subscribe((res) => {
          if(res?.id>0)
            this.getSgsSchemeNames({isUserInput:true},this.selectedScheme);
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
          const ref = this.dialog.openOverlayPanel('Update Individual Scheme Name', 
          SgsEditFormsComponent, {
          type:'schemeNames',
          data: event.data,
          },SgsDialogType.medium);
          ref.afterClosed().subscribe((res) => {
          if(res?.id===event.data.id)
          this.getSgsSchemeNames({isUserInput:true},this.selectedScheme);
          }); 
      }
    deleteRequest(event: any) {
        const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, 'this row');
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision === DECISION.CONFIRM) {
                this.sandbox.deleteRequest({id:event.data.id,type:'deleteSchemeName'}).subscribe((res:any) => {
                    if(res?.deleteStatus === 1)
                    {
                      this.getSgsSchemeNames({isUserInput:true},this.selectedScheme);
                    }
                });
            }
        });
    }
    
    downloadExcel(){
        this.sandbox.downloadExcel(this.sortedData,'schemesNames','Admin_Individual_Scheme_Names');
    }
  }
  