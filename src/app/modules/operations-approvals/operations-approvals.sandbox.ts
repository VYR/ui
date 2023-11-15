import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/configuration/config.service';
import { map, tap } from 'rxjs';
import { UtilService } from 'src/app/utility';
import { OperationsApprovalsService } from './operations-approvals.service';
import { OPERATIONS_INQUIRY_TYPE } from 'src/app/shared/enums';

@Injectable({
    providedIn: 'root',
})
export class OperationsApprovalsSandbox {
    constructor(private service: OperationsApprovalsService, private utilService: UtilService) {}

    getServiceRequestTypeList(queryParams: any) {
        return this.service.getServiceRequestTypeList(queryParams);
    }

    getServiceRequestList(query: any) {
        const request = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            status: query.status,
            rimNumber: query.rimNumber,
            requestType: query.type,
            sortField: query.sortKey,
            sort: query.sortDirection,
        };

        return this.service.getServiceRequestList(request).pipe(
            map((res: any) => {
                const response: any = {};
                if (res.data && res.data.content) {
                    response.data = res.data.content;
                    response.totalRecords = res.data.totalElements;
                }
                return response;
            })
        );
    }

    getRequestsTypeByRim(requestType: any) {
        const request = {
            listRimNumber: true,
            requestType: requestType,
        };
        return this.service.getServiceRequestTypeList(request);
    }

    serviceRequestAction(payload: any) {
        return this.service.serviceRequestAction(payload).pipe(
            tap((res: any) => {
                if (res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Service Request status updated successfully.`, 'success');
                }
            })
        );
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.utilService.downloadFile(res, fileName, fileType);
                this.utilService.displayNotification(`File generated successfully.`, 'success');
            })
        );
    }

    inquiryList(pageType: OPERATIONS_INQUIRY_TYPE, applnId: any, status: any) {
        return this.service.inquiryList(pageType, applnId, status);
    }

    historyList(pageType: OPERATIONS_INQUIRY_TYPE, status: any) {
        return this.service.historyList(pageType, status);
    }

    actionInuiryList(pageType: OPERATIONS_INQUIRY_TYPE, payload: any, actionValue: any) {
        return this.service.actionInuiryList(pageType, payload, actionValue).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(
                        `Your request has been ` + actionValue + ` Successfully!`,
                        'success'
                    );
                }
            })
        );
    }

    filterDetails(pageType: OPERATIONS_INQUIRY_TYPE, payload: any) {
        return this.service.filterDetails(pageType, payload);
    }

    fileUploadHisotry(pageType: OPERATIONS_INQUIRY_TYPE, payload: any, formData: any) {
        return this.service.fileUploadHisotry(pageType, payload, formData).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Documents uploaded successfully.`, 'success');
                }
            })
        );
    }

    deleteFileList(pageType: OPERATIONS_INQUIRY_TYPE, file: any) {
        return this.service.deleteFileList(pageType, file).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Documents deleted successfully.`, 'success');
                }
            })
        );
    }
}
