import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class BankAdminApproverDashboardService {
    constructor(private http: ServerInteractionService) {}

    getAdminApproverRequestList(query: any, type: any) {
        let httpParams = new HttpParams()
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sortDirection || 'DESC')
            .set('sortField', query.sortKey || 'created');

        if (type) {
            httpParams = httpParams.append('type', type);
        }

        return this.http.get(Operations.GET_ADMIN_APPROVER_REQUESTS, httpParams);
    }

    actOnAdminRequest(payload: any) {
        return this.http.put(Operations.APPROVE_REJECT_ADMIN_REQUEST, payload);
    }
}
