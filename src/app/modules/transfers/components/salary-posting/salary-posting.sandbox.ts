import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { UtilService } from 'src/app/utility';
import { SalaryPostingService } from './salary-posting.service';

@Injectable({
    providedIn: 'root',
})
export class SalaryPostingSandbox {
    constructor(private cmService: SalaryPostingService, private util: UtilService) {}

    getFromAccountsList() {
        return this.cmService.getFromAccountsList('TRANSFER_ACCOUNTS');
    }

    addSalaryPostingData(payload: any, action: string) {
        return this.cmService.addSalaryPostingData(payload).pipe(
            tap((res: any) => {
                this.notify(action, res, 'Salary Posting setup has been submitted successfully');
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
}
