import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Organization, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { HomeService } from './home.service';
import { UtilService } from 'src/app/utility';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root',
})
export class HomeSandbox {
    currentUser!:UserContext;
    constructor(
        private service: HomeService,
        private appContext: ApplicationContextService,
        private authService: AuthenticationService,
        private utilService: UtilService
    ) {
        this.currentUser=appContext.getCurrentUser();
    }

    userSelect(organization: Organization) {
        return this.service.userSelection(organization.uniqueUserId).pipe(
            tap((res: any) => {
                this.appContext.updateUserSelection(organization, res.data);
            })
        );
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    logout() {
        // return this.authService.logout().pipe(
        //     tap((res: any) => {
        //         this.appContext.logout();
        //     })
        // );
        this.appContext.logout();
    }

    refreshToken() {
        const access_token = this.appContext.getCurrentUser().access_token;
        return this.service.refreshToken().pipe(
            tap((res: any) => {
                if (res.data && res.data.Authorization) this.appContext.updateToken(res.data.Authorization);
            })
        );
    }

    downloadExcel(data:Array<any>,type:any,fileName:any){
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(data || [],type),
            fileName
        );
        this.utilService.displayNotification(fileName+' excel file generated successfully!', 'success');
    }
    formatDataForExcel(data:Array<any>,type:any) {
        const temp: any = [];
        data.forEach((ele: any) => {            
            temp.push(this.getExcelColumns(type,ele));
        });
        return temp;
    }

    getExcelColumns(type:any,ele:any){
        let tempObject: any = {};
        if(type==='scheme_types'){
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Scheme Type'] = ele?.scheme_type_name || '';
            tempObject['Updated Date'] =  moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status || '';
        }
        if(type==='schemes'){
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            if(ele?.scheme_type_id===1)
            tempObject['No Of Coins'] = ele?.coins || '';
            if(ele?.scheme_type_id===2)
            tempObject['Total Amount'] = ele?.total_amount || '';
            tempObject['No Of Months'] = ele?.no_of_months || '';
            tempObject['Amount Per Month'] = ele?.amount_per_month || '';
            tempObject['Updated Date'] =  moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status || '';
        }
        return tempObject;
    }
    
    deleteRequest(params: any) {        
        return this.service.deleteRequest(params.type,params.id).pipe(
            tap((res: any) => {                
                if(res?.deleteStatus === 1)
                {
                  this.utilService.displayNotification('Deleted successfully','success')
                }
            })
        );
    }
    
    addUpdateSchemeTypes(params: any) {        
        return this.service.addUpdateSchemeTypes(params);
    }
    
    getSgsSchemeTypes() {
        return this.service.getSgsSchemeTypes();
    }    
    
    addUpdateSchemes(params: any) {        
        return this.service.addUpdateSchemes(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    }

    getSgsSchemes(type:number) {
        return this.service.getSgsSchemes().pipe(
            tap((res: any) => {
                
                if (res?.data) {
                   res.data=(res?.data || []).filter((value:any) => value.scheme_type_id===type);
                }
            })
        );
    }
    addUpdateUsers(params: any) {        
        return this.service.addUpdateUsers(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    }

    getSgsUsers(params:any) {
        console.log(params);
        console.log(params.userType===-1 && params.status==='All');
        return this.service.getSgsUsers().pipe(
            tap((res: any) => {                
                if (res?.data) {
                    if(params.userType===-1 && params.status==='All')
                    res.data=(res?.data || []).filter((value:any) => 
                    value.userId!==this.currentUser.userId
                    );
                    if(params.userType>-1 && params.status==='All')
                    res.data=(res?.data || []).filter((value:any) => 
                    value.userId!==this.currentUser.userId && 
                    value.userType==params.userType
                    );
                    if(params.userType==-1 && params.status!=='All')
                    res.data=(res?.data || []).filter((value:any) => 
                    value.userId!==this.currentUser.userId &&                     
                    value.status==params.status
                    );                    
                    if(params.userType>-1 && params.status!=='All')
                    res.data=(res?.data || []).filter((value:any) => 
                    value.userId!==this.currentUser.userId && 
                    value.userType==params.userType && 
                    value.status==params.status
                    );
                }
            })
        );
    }
    getAllUsers() {
        return this.service.getSgsUsers().pipe(
            tap((res: any) => {                
                if (res?.data) {
                   res.data=(res?.data || []).filter((value:any) => value.userId!==this.currentUser.userId);
                }
            })
        );
    }
}
