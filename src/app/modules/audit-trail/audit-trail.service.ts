import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { USER_TYPE } from 'src/app/shared/enums';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class AuditTrailService {
    constructor(private http: ServerInteractionService) {}

    getUsersUnderRim(rim: any, userType: any) {
        let httpParams = new HttpParams().set('rim', rim);
        if (userType === USER_TYPE.BANK_ADMIN) return this.http.get(Operations.GET_USERS_UNDER_RIM, httpParams);
        else return this.http.get(Operations.GET_RIM_DETAILS);
    }

    getAuditReport(payload: any, userType: any) {
        if (userType === USER_TYPE.BANK_ADMIN) return this.http.post(Operations.GET_AUDIT_REPORT, payload);
        else return this.http.post(Operations.GET_ADMIN_AUDIT_REPORT, payload);
    }
}
