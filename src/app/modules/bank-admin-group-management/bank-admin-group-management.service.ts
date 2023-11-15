import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})
export class BankAdminGroupManagementService {
    constructor(private http: ServerInteractionService) {}

    getEntitlements() {
        return this.http.get(Operations.GET_ENTITLEMENTS);
    }

    getBusinessGroupsList() {
        return this.http.get(Operations.BUSINESS_GROUPS);
    }

    getBusinessCustomers(queryParams: any) {
        return this.http.get(Operations.SEARCH_RIMS_BY_BUSINESSID, queryParams);
    }
    getGroupDefinition(queryParams: any) {
        return this.http.get(Operations.GROUP_DEFINITION, queryParams);
    }

    updateGroupMatrix(postParams: any, queryParams: any) {
        return this.http.put(Operations.GROUP_DEFINITION, postParams, '', null, queryParams);
    }
    searchUserByRIM(queryParams: any) {
        return this.http.get(Operations.SEARCH_USER_BY_RIM, queryParams);
    }

    createGroup(postParams: any) {
        return this.http.post(Operations.GROUP_ADMIN, postParams);
    }

    updateGroup(postParams: any, queryParams: any) {
        return this.http.put(Operations.GROUP_ADMIN, postParams, '', null, queryParams);
    }

    searchGroup(queryParams: any) {
        return this.http.get(Operations.GROUP_ADMIN, queryParams);
    }

    getGroupByRIM(queryParams: any) {
        return this.http.get(Operations.GROUP_ADMIN, queryParams);
    }
    getGroupUsers(queryParams: any) {
        return this.http.get(Operations.GET_GROUP_USERS, queryParams);
    }

    deleteGroup(queryParams: any) {
        return this.http.delete(Operations.GROUP_ADMIN, queryParams);
    }
    deleteGroupUser(queryParams: any) {
        return this.http.delete(Operations.DELETE_GROUP_USER, queryParams);
    }

    updateUserGroup(postParams: any, queryParams: any) {
        return this.http.post(Operations.GROUP_USER, postParams, '', null, queryParams);
    }
}
