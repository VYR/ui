import { Injectable } from '@angular/core';
import { ManualTransfersService } from './manual-transfers.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ManualTransfersSandbox {
    private unsubscribe$ = new Subject<void>();

    private manualTransfer = new BehaviorSubject<any>(null);
    manualTransferData = this.manualTransfer.asObservable();

    constructor(private service: ManualTransfersService) {}

    getFromAccountsList() {
        return this.service.getFromAccountsList('TRANSFER_ACCOUNTS');
    }

    setManualTransferData(data: any) {
        this.manualTransfer.next(data);
    }

    getManualTransferList() {
        return this.service.listManualTransfers();
    }

    deleteManualTransfer(queryParam: any) {
        return this.service.updateManualTransfer(queryParam);
    }

    getCountryList() {
        return this.service.getCountryList();
    }

    getBankListQatar() {
        return this.service.getBankListQatar();
    }

    getManualTransferRelations() {
        return this.service.getManualTransferRelations();
    }

    getCurrencyList() {
        return this.service.getCurrencyList();
    }

    addManualTransfer(req: any) {
        return this.service.addManualTransfer(req);
    }

    updateManualTransfer(req: any) {
        return this.service.updateManualTransfer(req);
    }

    getPurposeCodes() {
        return this.service.getPurposeCodes();
    }

    getIncomeSources() {
        return this.service.getIncomeSources();
    }

    validateSwiftCode(queryParam: any) {
        return this.service.validateSwiftCode(queryParam);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
