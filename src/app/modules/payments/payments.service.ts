import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class PaymentsService {
    constructor(private http: ServerInteractionService) {}

    getAccountsList(accountype: any) {
        const httpParams = new HttpParams().set('product', accountype);
        return this.http.get(Operations.GET_ACCOUNTS_LIST, httpParams);
    }
    getCategoryCodesAccounts() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }

    getPaymentsList(type: any) {
        const httpParams = new HttpParams().set('type', type);
        return this.http.get(Operations.GET_PAYMENTS_LIST, httpParams);
    }

    getKahramaaList() {
        return this.http.get(Operations.GET_KAHRAMAA_LIST);
    }

    getKahramaaBill(serviceNo: any, qatarId: any, benId: any) {
        const httpParams = new HttpParams()
            .set('serviceNumber', serviceNo)
            .set('qatarId', qatarId)
            .set('beneficiaryId', benId);

        return this.http.get(Operations.GET_KAHRAMAA_BILL, httpParams);
    }

    addNewCustomer(req: any) {
        return this.http.post(Operations.ADD_NEW_CUSTOMER, req);
    }

    deleteCustomer(req: any) {
        return this.http.put(Operations.DELETE_CUSTOMER, req);
    }

    editCustomer(req: any) {
        return this.http.put(Operations.EDIT_CUSTOMER, req);
    }

    viewOoredooBill(type: any, val: any) {
        let httpParams;
        if (type === 'crn') {
            httpParams = new HttpParams().set('crn', val);
        } else {
            httpParams = new HttpParams().set('phoneNumber', val);
        }

        return this.http.get(Operations.VIEW_OOREDOO_BILL, httpParams);
    }

    payOoredooBill(req: any) {
        return this.http.post(Operations.PAY_OOREDOO_BILL, req);
    }

    payKahramaaBill(req: any) {
        return this.http.post(Operations.PAY_KAHRAMAA_BILL, req);
    }
    getDhareenaTinList(queryParams: any) {
        var httpParams;
        httpParams = new HttpParams().set('pageSize', queryParams.pageSize).set('pageNumber', queryParams.pageNumber);
        return this.http.get(Operations.DHAREEBA_TIN_SUMMERY, httpParams);
    }

    getDhareenaBillList(tin: any) {
        const httpParams = new HttpParams().set('tin', tin);
        return this.http.get(Operations.DHAREEBA_BILL_LIST, httpParams);
    }

    addTinNumber(tinPayload: any) {
        return this.http.post(Operations.ADD_DHAREEBA_TIN_NUMBER, tinPayload);
    }

    deleteTinNumber(tinPayload: any) {
        return this.http.put(Operations.DELETE_DHAREEBA_TIN_NUMBER, tinPayload);
    }

    payDhareebaBill(billPayload: any) {
        return this.http.post(Operations.PAY_DHAREEBA_BILL, billPayload);
    }
}
