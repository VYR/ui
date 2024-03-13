import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class SchemeMemberService {
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
    
    addUpdateSchemeTypes(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_SCHEME_TYPES, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_SCHEME_TYPES, params);
    } 
       
    getSgsSchemeTypes() {
        return this.http.get(Operations.GET_SCHEME_TYPES);
    }  
    
    addUpdateSchemes(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_SCHEMES, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_SCHEMES, params);
    }    
    addUpdateSchemeNames(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_SCHEME_NAMES, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_SCHEME_NAMES, params);
    }     
    addUpdateSchemeMembers(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_SCHEME_MEMBERS, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_SCHEME_MEMBERS, params);
    } 
    getSchemeMembers(params:any) {
        return this.http.get(Operations.GET_SCHEME_MEMBERS,params);
    }    
    addUpdatePayment(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_PAYMENT, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_PAYMENT, params);
    } 

    getSgsSchemes(params:any) {
        return this.http.get(Operations.GET_SCHEMES,params);
    } 
    getSgsSchemeNames(params:any) {
        return this.http.get(Operations.GET_SCHEME_NAMES,params);
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
    
    getPayments(params:any) {
        return this.http.get(Operations.GET_PAYMENTS,params);
    }
    getSettings() {
        return this.http.get(Operations.SETTINGS);
    }    
    updateSettings(params:any) {
        return this.http.post(Operations.SETTINGS, params);
    } 
    download(params:any) { 
        return this.http.post(Operations.DOWNLOAD, params);
    }
}
