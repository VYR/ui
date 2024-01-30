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
    
    getCategories(params:any) {
        return this.http.get(Operations.GET_CATEGORIES,params);
    }
      
    getSubCategories(params:any) {
        return this.http.get(Operations.GET_SUB_CATEGORIES,params);
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
