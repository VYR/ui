import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class SgsComponentsService {
    constructor(private http: ServerInteractionService) {}

    resendOtp(req: any) {
        return this.http.post('Operations.RESEND_OTP', req);
    }
}
