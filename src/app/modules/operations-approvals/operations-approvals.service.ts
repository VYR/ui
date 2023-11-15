import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { OPERATIONS_INQUIRY_TYPE } from 'src/app/shared/enums';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class OperationsApprovalsService {
    constructor(private http: ServerInteractionService) {}
    getServiceRequestTypeList(queryParams: any) {
        return this.http.get(Operations.GET_SERVICE_REQUEST_LIST, queryParams);
    }

    getServiceRequestList(request: any) {
        let params = new HttpParams()
            .set('status', request.status || 'ALL')
            .set('rimNumber', request.rimNumber || 'ALL')
            .set('pageSize', request.pageSize)
            .set('requestType', request.requestType)
            .set('sort', request.sort || 'DESC')
            .set('sortField', request.sortField || 'created')
            .set('pageNumber', request.pageNumber);
        return this.http.get(Operations.GET_SERVICE_REQUEST_LIST, params);
    }

    serviceRequestAction(payload: any) {
        return this.http.post(Operations.SERVICE_REQUEST_ACTION, payload);
    }

    downloadFile(params: any) {
        return this.http.get(Operations.DOWNLOAD_FILE, params);
    }

    inquiryList(pageType: OPERATIONS_INQUIRY_TYPE, applnId: any, status: any) {
        const url = pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_INQUIRY_LIST : Operations.BG_INQUIRY_LIST;
        let params: any;
        if (pageType === OPERATIONS_INQUIRY_TYPE.LC) {
            params = applnId
                ? new HttpParams().set('type', status).set('applnId', applnId)
                : new HttpParams().set('type', status);
        } else {
            params = applnId
                ? new HttpParams().set('type', status).set('id', applnId)
                : new HttpParams().set('type', status);
        }

        return this.http.get(url, params);
    }

    historyList(pageType: OPERATIONS_INQUIRY_TYPE, applnId: any) {
        const url = pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_HISTORY_LIST : Operations.BG_HISTORY_LIST;
        let params = new HttpParams().set('referenceNumber', applnId);
        return this.http.get(url, params);
    }

    actionInuiryList(pageType: OPERATIONS_INQUIRY_TYPE, payload: any, actionValue: any) {
        let url = '';
        if (actionValue == 'Approve') {
            url = pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_APPROVE_ACTION : Operations.BG_APPROVE_ACTION;
        } else if (actionValue == 'Sendback') {
            url =
                pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_SENDBACK_ACTION : Operations.BG_SENDBACK_ACTION;
        } else {
            url = pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_REJECT_ACTION : Operations.BG_REJECT_ACTION;
        }

        return this.http.post(url, payload);
    }

    filterDetails(pageType: OPERATIONS_INQUIRY_TYPE, params: any) {
        const url = pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_INQUIRY_LIST : Operations.BG_INQUIRY_LIST;
        return this.http.get(url, params);
    }

    fileUploadHisotry(pageType: OPERATIONS_INQUIRY_TYPE, payload: any, formData: any) {
        const url =
            pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.LC_HISTORY_UPLOAD : Operations.BG_HISTORY_UPLOAD;

        let params: any;
        if (pageType === OPERATIONS_INQUIRY_TYPE.LC) {
            params = new HttpParams().set('lcApplicationId', payload.applnId);
        } else {
            params = new HttpParams().set('bgApplicationId', payload.applnId).set('rim', payload.rim);
        }

        return this.http.post(url, formData, undefined, undefined, params);
    }

    deleteFileList(pageType: OPERATIONS_INQUIRY_TYPE, file: any) {
        const url =
            pageType === OPERATIONS_INQUIRY_TYPE.LC ? Operations.HISTORY_FILEDELETE : Operations.HISTORY_FILEDELETE;
        let params = new HttpParams().set('applicationId', file.id);
        return this.http.get(url, params);
    }
}
