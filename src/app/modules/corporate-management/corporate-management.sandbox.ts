import { Injectable } from '@angular/core';
import { Subject, catchError, map, tap, throwError } from 'rxjs';
import { UtilService } from 'src/app/utility/utility.service';
import { CorporateManagementService } from './corporate-management.service';

@Injectable({
    providedIn: 'root',
})
export class CorporateManagementSandbox {
    private unsubscribe$ = new Subject<void>();
    constructor(private service: CorporateManagementService, private utilService: UtilService) {}

    searchForCorporate(rim: any) {
        return this.service.searchForCorporate(rim);
    }

    updateCorporate(payload: any) {
        return this.service.updateCorporate(payload);
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.utilService.downloadFile(res, fileName, fileType);
                this.utilService.displayNotification(`File generated successfully.`, 'success');
            })
        );
    }

    registerPositivePay(payload: any) {
        return this.service.registerPositivePay(payload).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Registered Account successfully.`, 'success');
                }
            })
        );
    }

    uploadCorporateFile(formdata: any, queryParams: any) {
        return this.service.uploadCorporateFile(formdata, queryParams).pipe(
            tap((res: any) => {
                if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification(`Documents upload has been submitted for approval`, 'success');
                } else {
                    this.utilService.displayNotification(`Documents uploaded successfully`, 'success');
                }
            })
        );
    }

    searchForCorporateGroup(GroupName: any) {
        return this.service.searchForCorporateGroup(GroupName);
    }

    addCorporateGroup(payload: any) {
        return this.service.addCorporateGroup(payload).pipe(
            tap((res: any) => {
                if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification('Request has been sent for approval', 'success');
                }
            })
        );
    }

    deleteCorporateGroup(businessId: any, businessName: any) {
        return this.service.deleteCorporateGroup(businessId, businessName);
    }

    getRimsForCorporateGroup(businessId: any) {
        return this.service.getRimsForCorporateGroup(businessId);
    }

    getRimsOnSearch(rim: any) {
        return this.service.getRimsOnSearch(rim);
    }

    updateCorporateGroup(payload: any) {
        return this.service.updateCorporateGroup(payload).pipe(
            tap((res: any) => {
                if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification('Request has been sent for approval', 'success');
                }
            })
        );
    }

    deleteCorporateMappedRim(payload: any) {
        return this.service.deleteCorporateMappedRim(payload).pipe(
            tap((res: any) => {
                if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification('Request has been sent for approval', 'success');
                }
            })
        );
    }

    searchForCustomTemplate(rim: any) {
        return this.service.searchForCustomTemplate(rim);
    }

    uploadCustomFile(file: any) {
        return this.utilService.readFromExcel(file, true).pipe(
            map(
                (res: any) => {
                    if (res.data.length === 0) {
                        this.utilService.displayNotification('Please upload a file with Valid data', 'error');
                    }
                    return res.data;
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    updateTemplate(payload: any) {
        return this.service.updateTemplate(payload).pipe(
            tap((res: any) => {
                this.utilService.displayNotification('Request sent for approval', 'success');
            })
        );
    }

    getPositivePayPerRim(rim: any) {
        return this.service.getPositivePayPerRim(rim);
    }

    getHostToHostDetails(payload: any) {
        return this.service.getHostToHostDetails(payload);
    }

    addAndUpdateH2hCustomerDetails(payload: any, isRegistered: any) {
        return this.service.updateH2hCustomerDetails(payload, isRegistered).pipe(
            tap((res: any) => {
                if (res && res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification(`Request sent for approval.`, 'success');
                }
            })
        );
    }

    getH2hCustomerDetails(rim: any) {
        return this.service.getH2hCustomerDetails(rim);
    }

    getH2hUsers(rim: any) {
        return this.service.getH2hUsers(rim);
    }

    getDeviceList(payload: any) {
        return this.service.getDeviceList(payload);
    }

    public deRegisterDevice(deviceId: any): any {
        const req = {
            deviceId: deviceId,
        };
        return this.service.deRegisterDevice(req).pipe(
            tap((res: any) => {
                if (res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification('Request sent for approval.', 'success');
                } else {
                    this.utilService.displayNotification(res.message, 'error');
                }
            })
        );
    }

    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
