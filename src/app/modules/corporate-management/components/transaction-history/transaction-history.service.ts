import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class TransactionHistoryService {
    constructor(private http: ServerInteractionService) {}

    getFailureHistory(startDate: any, endDate: any) {
        let params = new HttpParams();
        params.set('startDate', startDate);
        params.set('endDate', endDate);
        return this.http.get(Operations.GET_FAILURE_HISTORY, params);
    }
}
