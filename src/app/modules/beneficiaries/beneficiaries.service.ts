import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class BeneficiariesService {
    constructor(private http: ServerInteractionService) {}

    getBeneficiaryList() {
        return this.http.get(Operations.GET_BENEFICIARY_LIST);
    }

    getCountryList() {
        return this.http.get(Operations.GET_COUNTRY_LIST);
    }

    getCurrencyList() {
        return this.http.get(Operations.GET_CURRENCY_LIST);
    }

    getBankListQatar() {
        return this.http.get(Operations.GET_BANK_LIST_QATAR);
    }

    getBeneficiaryRelations() {
        return this.http.get(Operations.GET_BENEFICIARY_RELATIONS);
    }

    addBeneficiary(req: any) {
        return this.http.post(Operations.ADD_BENEFICIARY, req);
    }

    updateBeneficiary(req: any) {
        return this.http.put(Operations.UPDATE_BENEFICIARY, req);
    }

    deleteBeneficiary(req: any) {
        return this.http.put(Operations.DELETE_BENEFICIARY, req);
    }

    validateSwiftCode(queryParam: any) {
        return this.http.get(Operations.VALIDATE_SWIFT_CODE, queryParam);
    }

    verifyIbanOrAccount(queryParam: any) {
        return this.http.get(Operations.VERIFY_IBAN_OR_ACCOUNT, queryParam);
    }

    getBeneficiaryAuditlog(benId: string) {
        let params = new HttpParams();
        params = params.set('beneficiaryId', benId);
        return this.http.get(Operations.GET_BENEFICIARY_AUDIT, params);
    }
}
