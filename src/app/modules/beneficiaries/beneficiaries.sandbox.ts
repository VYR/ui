import { Injectable } from '@angular/core';
import { BeneficiariesService } from './beneficiaries.service';

@Injectable({
    providedIn: 'root',
})
export class BeneficiariesSandbox {
    constructor(private service: BeneficiariesService) {}

    getBeneficiaryList() {
        return this.service.getBeneficiaryList();
    }

    getCountryList() {
        return this.service.getCountryList();
    }

    getBankListQatar() {
        return this.service.getBankListQatar();
    }

    getBeneficiaryRelations() {
        return this.service.getBeneficiaryRelations();
    }

    getCurrencyList() {
        return this.service.getCurrencyList();
    }

    addBeneficiary(req: any) {
        return this.service.addBeneficiary(req);
    }

    updateBeneficiary(req: any) {
        return this.service.updateBeneficiary(req);
    }

    deleteBeneficiary(req: any) {
        return this.service.deleteBeneficiary(req);
    }

    validateSwiftCode(queryParam: any) {
        return this.service.validateSwiftCode(queryParam);
    }

    verifyIbanOrAccount(queryParam: any) {
        return this.service.verifyIbanOrAccount(queryParam);
    }

    getBeneficiaryAuditlog(benId: string) {
        return this.service.getBeneficiaryAuditlog(benId);
    }
}
