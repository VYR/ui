import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { USER_TYPE } from 'src/app/shared/enums';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class KycRemediationService {
    constructor(private http: ServerInteractionService) {}

    getKycRemediation() {
        return this.http.get(Operations.GET_KYC_REMEDIATION);
    }

    saveKycRemediation(req: any, type: any) {
        return this.http.post(Operations.SAVE_KYC_REMEDIATION, req, undefined, undefined);
    }
}
