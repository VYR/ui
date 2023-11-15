import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class BankAdminDashboardService {
    constructor(private http: ServerInteractionService) {}

    getAdminRequestList(query: any, type: any) {
        let httpParams = new HttpParams()
            .set('status', type || 'Rejected')
            .set('deleted', query.deleted || 'false')
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sortDirection || 'DESC')
            .set('sortField', query.sortKey || 'created');

        return this.http.get(Operations.GET_ADMIN_REQUEST_LIST, httpParams);
    }

    updateSysConfig(payload: any) {
        return this.http.put(Operations.UPDATE_SYS_CONFIG, payload);
    }
    getEntitlementsForCorporate() {
        return this.http.get(Operations.GET_FEATURE_MANAGEMENT_ENTITLEMENTS_FOR_CORPORATE);
    }
    updateEntitlementsForCorporate(payload: any) {
        return this.http.put(Operations.UPDATE_FEATURE_MANAGEMENT_ENTITLEMENTS_CORPORATE, payload);
    }
    getEntitlementsForAdmin() {
        return this.http.get(Operations.GET_FEATURE_MANAGEMENT_ENTITLEMENTS_FOR_ADMIN);
    }
    updateEntitlementsForAdmin(payload: any) {
        return this.http.put(Operations.UPDATE_FEATURE_MANAGEMENT_ENTITLEMENTS_ADMIN, payload);
    }
}
