import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: ServerInteractionService) {}

    userSelection(number: string) {
        return this.http.post('Operations.USER_SELECTION', { number });
    }

    refreshToken() {
        return this.http.get(Operations.REFRESH_TOKEN);
    }


    deleteRequest(type: number,id:number) {
        return this.http.delete(Operations.DELETE_RECORD,null,{id:id,type:type});
    }    
   
    addUpdateUsers(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_USERS, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_USERS, params);
    } 

    getSgsUsers(params:any) {
        return this.http.get(Operations.GET_USERS,params);
    }
    
    getSettings() {
        return this.http.get(Operations.SETTINGS);
    }    
    updateSettings(params:any) {
        return this.http.post(Operations.SETTINGS, params);
    } 

    uploadFiles(params:any) {
        return this.http.post(Operations.UPLOAD_FILES, params);
    } 
    
    getFiles(params:any) {
        return this.http.get(Operations.GET_FILES,params);
    }
    addUpdateCategories(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_CATEGORIES, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_CATEGORIES, params);
    }       
    getCategories(params:any) {
        return this.http.get(Operations.GET_CATEGORIES,params);
    }
    addUpdateSubCategories(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_SUB_CATEGORIES, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_SUB_CATEGORIES, params);
    }       
    getSubCategories(params:any) {
        return this.http.get(Operations.GET_SUB_CATEGORIES,params);
    }
    addUpdateProducts(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_PRODUCTS, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_PRODUCTS, params);
    }       
    getProducts(params:any) {
        return this.http.get(Operations.GET_PRODUCTS,params);
    }
    addUpdateOrders(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_ORDERS, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_ORDERS, params);
    }       
    getOrders(params:any) {
        return this.http.get(Operations.GET_ORDERS,params);
    }
}
