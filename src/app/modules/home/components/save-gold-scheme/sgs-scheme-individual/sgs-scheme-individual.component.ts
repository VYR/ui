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

    @Input() type='addSchemes';
    currentUserType=-1;
    tableConfig!: SGSTableConfig;
    query!: SGSTableQuery;  
    detailsName='clientDetails';
    sortedData:Array<any>=[];  
    INDIVIDUAL_SCHEME_TABLE_COLUMNS=INDIVIDUAL_SCHEME_TABLE_COLUMNS;
    constructor(private router: Router, private dialog: SgsDialogService, private sandbox: HomeSandbox) {}
    
    ngOnInit(): void {
        this.currentUserType=this.sandbox.currentUser.userType;
        if(this.sandbox.currentUser.userType==1)
            this.detailsName='adminDetails';
        else if(this.sandbox.currentUser.userType==2)
            this.detailsName='promoterDetails';
        else if(this.sandbox.currentUser.userType==3)
            this.detailsName='employeeDetails';

        console.log(this.sandbox.currentUser.userType);
        this.getSgsSchemes();
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
        let referralCol = {
            key: 'referral',
            displayName: 'Details',
            type: ColumnType.link,
        };
        this.INDIVIDUAL_SCHEME_TABLE_COLUMNS=INDIVIDUAL_SCHEME_TABLE_COLUMNS.map((value:any)=>{
            if(value.key==='created' && this.sandbox.currentUser.userType!=1){
                value.displayName='Joined Date';
                return value;
            }
            else 
            return value;
        });
    
if(this.type==='referrals'){
            this.INDIVIDUAL_SCHEME_TABLE_COLUMNS.splice(3,0,{
                key: 'referralAmount',
                displayName: 'Earned Amount',
                type: ColumnType.amount,
                sortable:true
            });
            this.detailsName='referral';
        }
        let referralCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, referralCol];
        let clientCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol];
        let dealerCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, detailsCol];
        let adminCols=[...this.INDIVIDUAL_SCHEME_TABLE_COLUMNS, editCol, delCol];        
        let colArray = clientCols;
        if(this.currentUserType==1 && this.type=='addSchemes')
        colArray=adminCols;
        else if(this.currentUserType==1 && this.type=='userDetails')
        colArray=clientCols;

        this.tableConfig = {
            columns: colArray,
            data: this.sortedData,
            selection: false,
            totalRecords: this.sortedData.length,
            clientPagination: true,
        };
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    } 
    getSgsSchemes() {
        this.sandbox.getSgsSchemes(1).subscribe((res:any) => {       
            if(res?.data){
                this.sortedData=res?.data || [];
                console.log(this.sortedData);
                this.sortedData=this.sortedData.map((value:any) => {
                    value['details']='Details';
                    return value;
                });
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
        const ref = this.dialog.openOverlayPanel('Update Scheme', 
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
    const ref = this.dialog.openOverlayPanel('Add Scheme', 
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
