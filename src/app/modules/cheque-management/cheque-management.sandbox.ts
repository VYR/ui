import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { UtilService } from 'src/app/utility';
import { ChequeManagementService } from './cheque-management.service';

@Injectable({
    providedIn: 'root',
})
export class ChequeManagementSandbox {
    constructor(private cmService: ChequeManagementService, private util: UtilService) {}

    getPositivePayAccounts() {
        return this.cmService.getPositivePayAccounts();
    }

    addPositivePay(payload: any, action: string) {
        return this.cmService.addPositivePay(payload).pipe(
            tap((res: any) => {
                this.notify(action, res, 'Positive pay setup has been submitted successfully');
            })
        );
    }

    notify(action: string, res: any, msg: string) {
        if (action === 'CONFIRM') {
            if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                msg = 'Request has been sent for approval';
            }
            this.util.displayNotification(msg, 'success');
        }
    }

    showError(msg: string) {
        this.util.displayNotification(msg, 'error');
    }

    getPDCAccounts() {
        return this.cmService.getPDCAccounts();
    }

    getPDC(payload: any) {
        return this.cmService.getPDC(payload);
    }

    getAccountCategoryList() {
        return this.cmService.getAccountCategoryList();
    }
}
