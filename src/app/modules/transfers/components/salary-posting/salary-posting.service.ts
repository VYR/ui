import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class SalaryPostingService {
    constructor(private http: ServerInteractionService) {}

    addSalaryPostingData(payload: any) {
        return this.http.post(Operations.ADD_SALARY_POSTING_DATA, payload);
    }

    getFromAccountsList(type: any) {
        const httpParams = new HttpParams().set('product', type);
        return this.http.get(Operations.GET_FROM_ACCOUNT_LIST, httpParams);
    }
}
