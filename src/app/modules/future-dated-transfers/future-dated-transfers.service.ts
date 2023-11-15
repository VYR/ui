import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from '../../shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class FutureDatedTransferService {
    constructor(private http: ServerInteractionService) {}

    getPurposeCodes() {
        return this.http.get(Operations.GET_PURPOSE_CODES);
    }

    getTimeFreq() {
        return this.http.get(Operations.GET_TIME_FREQ);
    }

    verifySTO(payload: any, pathVar: string) {
        return this.http.post(Operations.VERIFY_STO, payload, pathVar);
    }
}
