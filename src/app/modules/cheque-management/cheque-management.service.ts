import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class ChequeManagementService {
    constructor(private http: ServerInteractionService) {}

    getPositivePayAccounts() {
        return this.http.get(Operations.GET_POSITIVE_PAY_ACCOUNTS);
    }

    addPositivePay(payload: any) {
        return this.http.post(Operations.ADD_POSITIVE_PAY, payload);
    }

    getPDCAccounts() {
        return this.http.get(Operations.GET_PDC_ACCOUNTS);
    }

    getPDC(payload: any) {
        return this.http.post(Operations.GET_PDC, payload);
    }

    getAccountCategoryList() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }
}
