import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SGSTableConfig, SGSTableQuery, ColumnType, SortDirection } from 'src/app/sgs-components/sgs-table/models/config.model';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { HomeSandbox } from '../../../home.sandbox';
import { INDIVIDUAL_SCHEME_TABLE_COLUMNS } from '../constants/meta-data';
import { DECISION } from 'src/app/shared/enums';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { SgsEditFormsComponent } from '../sgs-edit-forms/sgs-edit-forms.component';
import { SgsAddFormsComponent } from '../sgs-add-forms/sgs-add-forms.component';
import { SgsSchemeDetailsComponent } from '../sgs-scheme-details/sgs-scheme-details.component';

@Component({
  selector: 'app-sgs-scheme-individual',
  templateUrl: './sgs-scheme-individual.component.html',
  styleUrls: ['./sgs-scheme-individual.component.scss']
})
export class SgsSchemeIndividualComponent implements OnInit {

    @Input() schemesConfig:any;
    currentUserType=-1;
    tableConfig!: SGSTableConfig;
    query: SGSTableQuery=new SGSTableQuery();  
    sortedData:Array<any>=[];  
    INDIVIDUAL_SCHEME_TABLE_COLUMNS=INDIVIDUAL_SCHEME_TABLE_COLUMNS;
    constructor(private router: Router, private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
    
    ngOnInit(): void {
        console.log(this.schemesConfig);
        this.currentUserType=this.sandbox.currentUser.userType;
        this.query.sortKey='created_at';
        this.query.sortDirection=SortDirection.desc;
    }
    lazyLoad(event: SGSTableQuery) {
        console.log(this.query);
        console.log(event);
        this.query.pageIndex=event?.pageIndex || 0;
        if(event.sortKey)
            this.query.sortKey=event.sortKey;
        if(event.sortDirection)
        this.query.sortDirection=event.sortDirection;
        this.getSgsSchemes();
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    } 
    getSgsSchemes() {
        let query:any={...this.query};
        query.schemeType=1;
        if(this.schemesConfig.type=='userDetails'){
            query.userId=this.schemesConfig?.userId || 0;
        }
        this.sandbox.getSgsSchemes(query).subscribe((res:any) => {       
            if(res?.data?.data){
                this.sortedData=res?.data?.data || [];
                if(this.currentUserType===0 || ([1,2].includes(this.currentUserType) && this.schemesConfig.type=='userDetails'))
                 this.sortedData=this.sortedData.map((value:any) => {                                   
                    value['details']='Details';
                    return value;
                });               
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
                    key: 'details',
                    displayName: 'Details',
                    type: ColumnType.link,
                };
            
                if(this.schemesConfig.type==='referrals'){
                    this.INDIVIDUAL_SCHEME_TABLE_COLUMNS.splice(4,0,{
                        key: 'referralAmount',
                        displayName: 'Earned Amount',
                        type: ColumnType.amount,
                        sortable:true
                    });
                }
                let referralCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS];
                let clientCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol];
                let adminCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, editCol, delCol];        
                let colArray:any = [];
                if(this.currentUserType==1 && this.schemesConfig.type=='addSchemes')
                colArray=adminCols;
                else if(this.currentUserType!==3 && this.schemesConfig.type=='userDetails')
                if(this.currentUserType===0 || ([1,2].includes(this.currentUserType) && this.schemesConfig.type=='userDetails'))
                colArray=clientCols;
                else if(this.schemesConfig.type==='referrals')
                colArray=referralCols;
        
                this.tableConfig = {
                    columns: colArray,
                    data: this.sortedData,
                    selection: false,
                    totalRecords: this.sortedData.length,
                    clientPagination: true,
                };
            }      
        });
    }

    onClickCell(event: any) {
        console.log(event);
        if (event.key === 'delete') {
            this.deleteRequest(event);
        }
        else if (event.key === 'details') {
            const ref = this.dialog.openOverlayPanel('Payment Details', 
            SgsSchemeDetailsComponent, {
            type:'schemes',
            data: event.data,
            },SgsDialogType.large);
            ref.afterClosed().subscribe((res) => {
            //if(res?.id===event.data.id)
            //this.getSgsSchemes();
            }); 
        } else {
            this.openSummary(event);
        }
    }

    openSummary(event: any) {   
        const ref = this.dialog.openOverlayPanel('Update Individual Scheme', 
        SgsEditFormsComponent, {
        type:'schemes',
        data: event.data,
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id===event.data.id)
        this.getSgsSchemes();
        });         
    }
    addScheme(){
    const ref = this.dialog.openOverlayPanel('Add Individual Scheme', 
        SgsAddFormsComponent, {
        type:'schemes',
        data:{scheme_type_id:1},
        },SgsDialogType.medium);
        ref.afterClosed().subscribe((res) => {
        if(res?.id>0)
        this.getSgsSchemes();
        });
    }
    deleteRequest(event: any) {
        const ref = this.dialog.openDialog(SgsDialogType.small, DeleteRequestConfirmComponent, (event.data?.coins || '')+' Coins');
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
        this.sandbox.downloadExcel(this.sortedData,'schemes','IndividualSchemes');
    }
}
