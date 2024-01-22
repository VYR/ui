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
        return this.authService.logout().pipe(
            tap((res: any) => {
                this.utilService.displayNotification('success','Logged out successfully');
                this.appContext.logout();
            })
        );
    }

    refreshToken() {
        const access_token = this.appContext.getCurrentUser().access_token;
        return this.service.refreshToken().pipe(
            tap((res: any) => {
                if (res?.access_token) this.appContext.updateToken(res.access_token);
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
        if(type==='category'){
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Category Name'] = ele?.category_name || '';
            tempObject['Updated Date'] =  moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status?ele.status.toUpperCase() :  '';
        }
        if(type==='subCategories'){
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Sub Category Name'] = ele?.sub_category_name || '';
            tempObject['Updated Date'] =  moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status?ele.status.toUpperCase() :  '';
        }
        if(type==='product'){            
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Product Name'] = ele?.product_name || '';
            tempObject['Actual Price'] = ele?.product_actual_price || '';
            tempObject['Discount Percent(%)'] = ele?.product_discount_percent || '';
            tempObject['Discount Price(Rs.)'] = ele?.product_discount_price || '';
            tempObject['Selling Price'] = ele?.product_selling_price || '';
            tempObject['Product Description'] = ele?.product_desc || '';
            tempObject['Updated Date'] =  moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status?ele.status.toUpperCase() :  '';
        }
        if(type==='payments'){
            console.log(ele);
            tempObject['Start Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Paid Date'] = ele?.paidDate?moment(ele.paidDate).format('DD-MM-YYYY  hh:mm A'):'';
            tempObject['Due Date'] = moment(ele.dueDate).format('DD-MM-YYYY  hh:mm A');
            tempObject['Amount'] = ele?.amount_paid || '';
            tempObject['Month'] = ele?.month_paid || '';
            tempObject['Payment ID'] = ele?.txnNo || '';
            tempObject['Late Fee'] = ele?.lateFee || '';
            tempObject['Status'] = ele?.status?ele.status.toUpperCase() :  '';
        }
        if(type==='users'){
            console.log(ele);
            tempObject['Created Date'] = moment(ele.created_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['User ID'] = ele?.userId || '';
            tempObject['User Type'] = ele?.role || '';
            tempObject['First Name'] = ele?.firstName || '';
            tempObject['Last Name'] = ele?.lastName || '';
            tempObject['Full Name'] = ele?.userName || '';
            tempObject['Email'] = ele?.email || '';
            tempObject['Mobile'] = ele?.mobilePhone || '';
            tempObject['PAN Number'] = ele?.pan || '';
            tempObject['Aadhar Number'] = ele?.aadhar || '';
            tempObject['Introduced By'] = ele?.introducedBy || '';
            tempObject['Updated Date'] = moment(ele.updated_at).format('DD-MM-YYYY  hh:mm A');
            tempObject['Status'] = ele?.status?ele.status.toUpperCase() :  '';
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
       
    getSettings() {
        return this.service.getSettings();
    }    
      
    updateSettings(params: any) {        
        return this.service.updateSettings(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
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
        return this.service.getSgsUsers(params);
    }
    
    getAllUsers(params:any) {
        return this.service.getSgsUsers(params).pipe(
            tap((res: any) => {                
                if (res?.data) {
                   res.data=(res?.data || []).filter((value:any) => value.userId!==this.currentUser.userId);
                }
            })
        );
    }

    uploadFiles(params:any) {
        return this.service.uploadFiles(params).pipe(
            tap((res: any) => {                
                if(res?.message)
                {
                  this.utilService.displayNotification(res.message,'success');
                }
            })
        );
    } 
        
    getFiles(params:any) {
        return this.service.getFiles(params).pipe(
            tap((res: any) => {                
                if (res?.data?.data) {
                   res.data.data=(res.data.data || []).map((value:any) => {
                    value.url=res?.url+value?.path;
                    value.active=false;
                    value.isSelected=false;
                    return value;
                  });
                }
            })
        );
    }
    
    addUpdateCategories(params: any) {        
        return this.service.addUpdateCategories(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    } 

    getCategories(params: any) {        
        return this.service.getCategories(params).pipe(
            tap((res: any) => {                
                if (res?.data?.data) {
                   res.data.data=(res.data.data || []).map((value:any) => {
                    value.url=res?.url+value?.path;
                    return value;
                  });
                }
            })
        );
    }     
    addUpdateSubCategories(params: any) {        
        return this.service.addUpdateSubCategories(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    } 

    getSubCategories(params: any) {        
        return this.service.getSubCategories(params).pipe(
            tap((res: any) => {                
                if (res?.data?.data) {
                   res.data.data=(res.data.data || []).map((value:any) => {
                    value.url=res?.url+value?.path;
                    return value;
                  });
                }
            })
        );
    }     
    addUpdateProducts(params: any) {        
        return this.service.addUpdateProducts(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    } 

    getProducts(params: any) {        
        return this.service.getProducts(params).pipe(
            tap((res: any) => {                
                if (res?.data?.data) {
                   res.data.data=(res.data.data || []).map((value:any) => {
                    value.url=res?.url+value?.path;
                    return value;
                  });
                }
            })
        );
    }     
    addUpdateOrders(params: any) {        
        return this.service.addUpdateOrders(params).pipe(
            tap((res: any) => {                
                if(res?.data?.id >0)
                {
                  this.utilService.displayNotification(res?.message,'success');
                }
            })
        );
    } 

    getOrders(params: any) {        
        return this.service.getOrders(params);
    } 

}
