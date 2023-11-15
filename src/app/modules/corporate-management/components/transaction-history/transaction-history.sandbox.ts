import { Injectable } from '@angular/core';
import { TransactionHistoryService } from './transaction-history.service';

@Injectable({
    providedIn: 'root',
})
export class TransactionHistorySandbox {
    constructor(private service: TransactionHistoryService) {}

    getFailureHistory(startDate: any, endDate: any) {
        return this.service.getFailureHistory(startDate, endDate);
    }
}
