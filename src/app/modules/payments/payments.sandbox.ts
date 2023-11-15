import { Injectable } from '@angular/core';
import { PaymentsService } from './payments.service';
import { tap } from 'rxjs';
import { UtilService } from 'src/app/utility';

@Injectable({
    providedIn: 'root',
})
export class PaymentsSandbox {
    public accountList: any = [];
    constructor(private service: PaymentsService, private utilService: UtilService) {}

    getPaymentsList(type: any) {
        return this.service.getPaymentsList(type);
    }

    getKahramaaList() {
        return this.service.getKahramaaList();
    }

    getKahramaaBill(serviceNo: any, qatarId: any, benId: any) {
        return this.service.getKahramaaBill(serviceNo, qatarId, benId);
    }

    addNewCustomer(req: any) {
        return this.service.addNewCustomer(req);
    }

    deleteCustomer(req: any) {
        return this.service.deleteCustomer(req);
    }

    editCustomer(req: any) {
        return this.service.editCustomer(req);
    }

    viewOoredooBill(type: any, req: any) {
        return this.service.viewOoredooBill(type, req);
    }

    getAccountsList() {
        return this.service.getAccountsList('PAYMENT_ACCOUNTS').pipe(
            tap((res: any) => {
                if (res && res.data) {
                    this.accountList = res.data.accounts || [];
                }
            })
        );
    }

    getCategoryCodesAccounts() {
        return this.service.getCategoryCodesAccounts();
    }

    payOoredooBill(req: any) {
        return this.service.payOoredooBill(req);
    }

    payKahramaaBill(req: any) {
        return this.service.payKahramaaBill(req);
    }

    getDhareenaTinList(queryParams: any) {
        return this.service.getDhareenaTinList(queryParams);
    }

    getDhareenaBillList(tin: any) {
        return this.service.getDhareenaBillList(tin).pipe(
            tap((res: any) => {
                if (res && res.data && res.data.billItems.length == 0) {
                    this.utilService.displayNotification(res.data.errorDesc, 'error');
                }
            })
        );
    }

    addTinNumber(tinPayload: any) {
        return this.service.addTinNumber(tinPayload).pipe(
            tap((res: any) => {
                if (tinPayload.action === 'CONFIRM' && res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Added new Tin Number Successfully!`, 'success');
                }
            })
        );
    }

    deleteTinNumber(tinPayload: any) {
        return this.service.deleteTinNumber(tinPayload).pipe(
            tap((res: any) => {
                if (tinPayload.action === 'CONFIRM' && res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification('Tin Number Deleted Successfully!', 'success');
                }
            })
        );
    }

    payDhareebaBill(billPayload: any) {
        return this.service.payDhareebaBill(billPayload);
    }
}
