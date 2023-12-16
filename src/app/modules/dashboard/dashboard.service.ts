import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { REQUEST_LIST_TYPE, REQUEST_STATUS } from 'src/app/shared/enums';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    REQUEST_LIST: any = {
        USER: {
            MY_QUEUE: Operations.MAKER_REQUESTS,
            MAKER_COMPLETED: Operations.MAKER_REQUESTS,
            ACTION_PENDING: Operations.MAKER_REQUESTS,
        },
        ROLE_USER_CHECKER: {
            APPROVER_COMPLETED: Operations.APPROVER_LIST_COMPLETED,
            ACTION_PENDING: Operations.GET_APPROVER_REQUESTS,
        },
        ROLE_USER_VERIFIER: {
            APPROVER_COMPLETED: Operations.APPROVER_LIST_COMPLETED,
            ACTION_PENDING: Operations.GET_APPROVER_REQUESTS,
        },
        ROLE_USER_MAKER_CHECKER: {
            MY_QUEUE: Operations.MAKER_REQUESTS,
            MAKER_COMPLETED: Operations.MAKER_REQUESTS,
            APPROVER_COMPLETED: Operations.APPROVER_LIST_COMPLETED,
            ACTION_PENDING: Operations.GET_APPROVER_REQUESTS,
        },
    };

    constructor(private http: ServerInteractionService) {}

    getNetwoth(request: any) {
        return this.http.get(Operations.GET_NETWORTH);
    }

    downloadFile(params: any) {
        return this.http.get(Operations.DOWNLOAD_FILE, params);
    }

    getRequestList(request: any, status: REQUEST_STATUS, type: REQUEST_LIST_TYPE, role: string) {
        let params = new HttpParams()
            .set('searchByID', request.searchByID || '')
            .set('searchByType', request.searchByType || 'ALL')
            .set('pageSize', request.pageSize)
            .set('deleted', 'false')
            .set('sort', request.sort || 'DESC')
            .set('sortField', request.sortField || 'created')
            .set('pageNumber', request.pageNumber);
        if (status === REQUEST_STATUS.PENDING) params = params.set('fetchAll', request.fetchAll);
        if (status !== REQUEST_STATUS.ALL) params = params.set('status', status);
        const url = this.REQUEST_LIST[role][type] || Operations.MAKER_REQUESTS;
        return this.http.get(url, params);
    }

    deleteRequest(requestId: string) {
        const params = new HttpParams().set('requestId', requestId);
        return this.http.delete(Operations.MAKER_REQUESTS, params);
    }

    actOnRequest(request: any) {
        return this.http.put(Operations.ACT_ON_REQUEST, request);
    }

    getRequestCount(role: string) {
        const url = this.REQUEST_LIST[role]['ACTION_PENDING'] || Operations.MAKER_REQUESTS;
        const params = new HttpParams().set('requestCounts', true);
        return this.http.get(url, params);
    }

    getMakerRequestCount() {
        return this.http.get(Operations.MAKER_REQUEST_COUNT);
    }

    getPendingReqHistory(params: any) {
        return this.http.get(Operations.GET_PENDING_REQ_HISTORY, params);
    }
}
