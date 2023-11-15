import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({ providedIn: 'root' })
export class UsermanagementService {
    constructor(private http: ServerInteractionService) {}

    getOptions() {
        return this.http.get(Operations.GET_USER_MGMT_OPTIONS);
    }

    getGroups() {
        return this.http.get(Operations.BUSINESS_GROUPS);
    }

    getRims(text: string) {
        const params = new HttpParams().append('rim', text).append('registered', true);
        return this.http.get(Operations.SEARCH_RIMS, params);
    }

    getBusinessRims(businessId: string) {
        const params = new HttpParams().append('businessId', businessId).append('registered', true);
        return this.http.get(Operations.SEARCH_RIMS_BY_BUSINESSID, params);
    }

    getEntitlements() {
        return this.http.get(Operations.ENTITLEMENTS_INFO);
    }

    getAccounts(rimNumber: string) {
        const httpParams = new HttpParams().set('rim', rimNumber).set('status', 'ACTIVE,CUR,LIQ');
        return this.http.get(Operations.GET_ACCOUNTS_LIST_ADMIN, httpParams);
    }

    createUser(request: any) {
        return this.http.post(Operations.CORPORATE_USERS, request);
    }

    updateUser(request: any) {
        const httpParams = new HttpParams().set('validateUserId', request.user.userId);
        return this.http.put(Operations.CORPORATE_USERS, request, undefined, undefined, httpParams);
    }

    addNewRole(request: any) {
        const httpParams = new HttpParams().set('validateUserId', request.user.userId);
        return this.http.put(Operations.ADD_RIM_TO_USER, request, undefined, undefined, httpParams);
    }

    updateUserEntitlement(request: any, mode: string) {
        let httpParams;
        if (mode === 'DELETE') {
            const userEntitlementIds = request.userRim
                .map((x: any) => x.entitlements)
                .flat()
                .map((y: any) => (y.deleteAccountsOnly ? null : y.userEntitleId))
                .filter((z: any) => z)
                .join(',');
            const userEntitlementAccountIds = request.userRim
                .map((x: any) => x.entitlements)
                .flat()
                .map((y: any) => y.userEntitleAccount)
                .flat()
                .map((z: any) => z.userEntitleAccountId)
                .join(',');
            const businessRims = request.userRim.map((x: any) => x.customer?.rimnumber).join(',');
            let httpParams;
            if (userEntitlementAccountIds && userEntitlementIds) {
                httpParams = new HttpParams()
                    .set('validateUserId', request.user.userId)
                    .set('userEntitlementAccounts', userEntitlementAccountIds || '')
                    .set('userEntitlements', userEntitlementIds || '')
                    .set('businessRim', businessRims);
            } else {
                if (userEntitlementIds) {
                    httpParams = new HttpParams()
                        .set('validateUserId', request.user.userId)
                        .set('userEntitlements', userEntitlementIds || '')
                        .set('businessRim', businessRims);
                }
                if (userEntitlementAccountIds) {
                    httpParams = new HttpParams()
                        .set('validateUserId', request.user.userId)
                        .set('userEntitlementAccounts', userEntitlementAccountIds || '')
                        .set('businessRim', businessRims);
                }
            }

            return this.http.delete(Operations.DELETE_GROUP_USER, httpParams);
        } else {
            httpParams = new HttpParams().set('validateUserId', request.user.userId);
            return this.http.put(Operations.GET_RIM_ENTITLEMENTS, request, undefined, undefined, httpParams);
        }
    }

    getUsers(request: any) {
        const queryParams = new HttpParams()
            .set('rim', request.rimNumber || '')
            .set('username', (request.username || '').toUpperCase() || '')
            .set('mobilePhone', request.mobilePhone || '')
            .set('email', request.email || '');

        return this.http.get(Operations.CORPORATE_USERS, queryParams);
    }

    unlockUser(username: any) {
        return this.http.put(Operations.USER_UNLOCK, { username });
    }

    unlockUserOtp(username: string) {
        return this.http.put(Operations.USER_UNLOCK_OTP, { username });
    }

    getAdditionalDetails(request: any) {
        const queryParams = new HttpParams().set('userId', request);
        return this.http.get(Operations.ADDIOTIONAL_DETAILS, queryParams);
    }

    checkUserName(userName: string) {
        return this.http.put(Operations.CHECK_USERNAME_AVAILABILITY, { username: userName });
    }

    getEntitlementsbyRim(request: any) {
        const queryParams = new HttpParams().set('userId', request.userId || '').set('rim', request.rim);
        return this.http.get(Operations.GET_RIM_ENTITLEMENTS, queryParams);
    }

    deleteRim(rim: any, userID: any) {
        const httpParams = new HttpParams().set('partnerRim', rim).set('validateUserId', userID);
        return this.http.delete(Operations.DELETE_GROUP_USER, httpParams);
    }

    deleteUser(userID: any) {
        const httpParams = new HttpParams().set('userId', userID);
        return this.http.delete(Operations.DELETE_USER, httpParams);
    }
}
