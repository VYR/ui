import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { UtilService } from 'src/app/utility';
import { LiquidityManagementService } from './liquidity-management.service';

interface LiquidityInit {
    accounts: any;
    catList: any;
}
@Injectable({
    providedIn: 'root',
})
export class LiquidityManagementSandbox {
    constructor(private lmService: LiquidityManagementService, private util: UtilService) {}

    _initialData!: LiquidityInit;

    initData() {
        const services: Observable<any> = forkJoin([this.getAutocoverAccounts(), this.getAccountCategoryList()]).pipe(
            map(([accs, catList]) => {
                return { accs, catList };
            })
        );

        return services;
    }

    get initialData(): LiquidityInit {
        return this._initialData;
    }

    set initialData(initData: LiquidityInit) {
        this._initialData = initData;
    }

    getAutocoverAccounts() {
        return this.lmService.getAutocoverAccounts();
    }

    getAutocoverAccountList() {
        return this.lmService.getAutocoverAccountList();
    }

    createAutocoverAccount(payload: any, action: string) {
        return this.lmService.createAutocoverAccount(payload).pipe(
            tap((res: any) => {
                this.notify(res, action, 'Auto cover has been created Successfully');
            })
        );
    }

    getAccountCategoryList() {
        return this.lmService.getAccountCategoryList();
    }

    getSweepAccountList() {
        return this.lmService.getSweepAccountList();
    }

    handleSweepActions(payload: any, operation: string, action: string) {
        switch (operation) {
            case 'CREATE': {
                return this.lmService.addAutoSweep(payload).pipe(
                    tap((res: any) => {
                        this.notify(res, action, 'Sweep setup has been created Successfully');
                    })
                );
            }
            case 'UPDATE': {
                return this.lmService.updateAutoSweep(payload).pipe(
                    tap((res: any) => {
                        this.notify(res, action, 'Sweep setup has been updated Successfully');
                    })
                );
            }
            case 'DELETE': {
                return this.lmService.deleteAutoSweep(payload).pipe(
                    tap((res: any) => {
                        this.notify(res, action, 'Sweep setup has been updated Successfully');
                    })
                );
            }
            default: {
                return null;
            }
        }
    }

    notify(res: any, action: string, msg: string) {
        if (action === 'CONFIRM') {
            if (res?.data?.requestId || res.status === 'APPROVAL_REQUESTED') {
                msg = 'Request has been sent for approval';
            }
            this.util.displayNotification(msg, 'success');
        }
    }

    showErr(msg: string) {
        this.util.displayNotification(msg, 'error');
    }
}
