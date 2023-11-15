import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
    selector: 'app-validate-otp',
    templateUrl: './validate-otp.component.html',
    styleUrls: ['./validate-otp.component.scss'],
})
export class ValidateOtpComponent {
    otpConfig: any = {};
    otpProvided = false;
    otp = '';
    constructor(private router: Router, private sandox: AuthenticationSandbox) {
        this.otpConfig = this.sandox.getLoginOTPConfig();
    }

    validateOtp() {
        this.sandox.validateOtp(this.otp);
    }

    onCancelClick() {
        this.router.navigate(['login']);
    }

    onOtpValueEnter(otp: string) {
        this.otp = otp;
    }
}
