import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: ServerInteractionService) {}

    userSelection(rimNumber: string) {
        return this.http.post('Operations.USER_SELECTION', { rimNumber });
    }

    refreshToken() {
        return this.http.get('Operations.REFRESH_TOKEN');
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

    getSgsSchemes() {
        return this.http.get(Operations.GET_SCHEMES);
    }    
    addUpdateUsers(params:any) {
        if(params?.id)
            return this.http.post(Operations.ADD_UPDATE_USERS, params,{id:params?.id || 0});
        else 
            return this.http.post(Operations.ADD_UPDATE_USERS, params);
    } 

    getSgsUsers() {
        return this.http.get(Operations.GET_USERS);
    }
}
