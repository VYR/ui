import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core/server-interaction.service';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class CorporateManagementService {
    constructor(private http: ServerInteractionService) {}

    searchForCorporate(rim: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('rim', rim).set('mandate', true);
        return this.http.get(Operations.SEARCH_RIMS, paramsSet);
    }

    updateCorporate(payload: any) {
        return this.http.post(Operations.UPDATE_CORPORATE, payload);
    }

    downloadFile(params: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('applicationId', params.applicationId).set('responseType', 'arraybuffer');
        return this.http.get(Operations.DOWNLOAD_FILE, paramsSet);
    }

    uploadCorporateFile(formdata: any, queryParams: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('id', queryParams.id).set('moduleName', queryParams.moduleName);
        return this.http.post(Operations.UPLOAD_CORPORATE_FILE, formdata, {}, null, paramsSet);
    }

    searchForCorporateGroup(GroupName: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('businessName', GroupName);
        return this.http.get(Operations.BUSINESS_GROUPS, paramsSet);
    }

    deleteCorporateGroup(businessId: any, businessName: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('businessId', businessId).set('businessName', businessName);
        return this.http.delete(Operations.BUSINESS_GROUPS, paramsSet);
    }

    addCorporateGroup(payload: any) {
        return this.http.post(Operations.BUSINESS_GROUPS, payload);
    }

    updateCorporateGroup(payload: any) {
        return this.http.put(Operations.SEARCH_RIMS_BY_BUSINESSID, payload);
    }

    deleteCorporateMappedRim(payload: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet
            .set('businessId', payload.businessId)
            .set('rim', payload.rim)
            .set('businessName', payload.businessName);
        return this.http.delete(Operations.SEARCH_RIMS_BY_BUSINESSID, paramsSet);
    }

    getRimsForCorporateGroup(businessId: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('businessId', businessId);
        return this.http.get(Operations.SEARCH_RIMS_BY_BUSINESSID, paramsSet);
    }

    getRimsOnSearch(rim: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('rim', rim).set('registered', true);
        return this.http.get(Operations.SEARCH_RIMS, paramsSet);
    }

    searchForCustomTemplate(rim: any) {
        let paramsSet = new HttpParams();
        paramsSet = paramsSet.set('rim', rim);
        return this.http.get(Operations.CUSTOM_TEMPLATE, paramsSet);
    }

    updateTemplate(payload: any) {
        return this.http.post(Operations.CUSTOM_TEMPLATE, payload);
    }

    getPositivePayPerRim(rim: any) {
        let param = new HttpParams().set('rim', rim);
        return this.http.get(Operations.GET_POSTIVE_PAY_PER_RIM, param);
    }
    registerPositivePay(payload: any) {
        return this.http.post(Operations.REGISTER_POSITIVE_PAY, payload);
    }

    updateH2hCustomerDetails(payload: any, isRegistered: any) {
        if (isRegistered) return this.http.put(Operations.UPDATE_H2H_CUSTOMER_DETAILS, payload);
        else return this.http.post(Operations.UPDATE_H2H_CUSTOMER_DETAILS, payload);
    }

    getH2hCustomerDetails(rim: any) {
        let param = new HttpParams().set('rimNumber', rim);
        return this.http.get(Operations.GET_H2H_CUSTOMER_DETAILS, param);
    }

    getH2hUsers(rim: any) {
        let param = new HttpParams().set('rim', rim);
        return this.http.get(Operations.GET_H2H_USERS, param);
    }

    getHostToHostDetails(query: any) {
        let httpParams = new HttpParams()
            .set('rim', query.rimNumber)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('status', query.status || '')

            .set('sortField', query.sortField || 'created');

        if (query.fileName) {
            httpParams = httpParams.append('fileName', query.fileName);
        }

        return this.http.get(Operations.GET_H2H_DETAILS, httpParams);
    }

    getDeviceList(payload: any) {
        let httpParams = new HttpParams();
        if (payload.rim) {
            httpParams = httpParams.append('rim', payload.rim);
        }

        if (payload.userName) {
            httpParams = httpParams.append('userName', payload.userName);
        }

        if (payload.deviceModel) {
            httpParams = httpParams.append('deviceModel', payload.deviceModel);
        }

        return this.http.get(Operations.GET_DEVICE_LIST, httpParams);
    }

    deRegisterDevice(deviceInfo: any) {
        return this.http.post(Operations.BANKADMIN_DE_REGISTER_DEVICE, deviceInfo);
    }
}
