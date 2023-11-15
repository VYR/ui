import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class LiquidityManagementService {
    constructor(private http: ServerInteractionService) {}

    getAutocoverAccounts() {
        return this.http.get(Operations.AUTOCOVER_ACCOUNTS);
    }

    // To get registered auto cover accounts
    getAutocoverAccountList() {
        return this.http.get(Operations.AUTOCOVER_ACCOUNT);
    }

    // To get registered sweep accounts
    getSweepAccountList() {
        return this.http.get(Operations.AUTOSWEEP_ACCOUNT);
    }

    createAutocoverAccount(payload: any) {
        return this.http.post(Operations.AUTOCOVER_ACCOUNT, payload);
    }

    getAccountCategoryList() {
        return this.http.get(Operations.GET_CATEGORY_CODES_ACCOUNTS);
    }

    addAutoSweep(payload: any) {
        return this.http.post(Operations.ADD_AUTOSWEEP, payload);
    }

    updateAutoSweep(payload: any) {
        return this.http.put(Operations.UPDATE_AUTOSWEEP, payload);
    }

    deleteAutoSweep(payload: any) {
        return this.http.put(Operations.DELETE_AUTOSWEEP, payload);
    }
}
