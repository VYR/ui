import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';
import { LoginCredentials } from 'src/app/shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: ServerInteractionService) {}

    authenticate(request: LoginCredentials) {
        return this.http.post(Operations.LOGIN, request);
    }

    validateOtp(request: any) {
        return this.http.post(Operations.VALIDATE_OTP, request);
    }

    forgotPasswordReq(request: any) {
        return this.http.post(Operations.FORGOT_PASSWORD_REQ, request);
    }

    resetPassword(req: any) {
        return this.http.post('Operations.RESET_PASSWORD_REQ', req);
    }

    unlockUserReq(request: any) {
        return this.http.put('Operations.UNLOCK_USER_REQ', request);
    }

    logout() {
        return this.http.post(Operations.LOGOUT, null);
    }
}
