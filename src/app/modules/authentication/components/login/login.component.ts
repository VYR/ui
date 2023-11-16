import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    userLoginForm: UntypedFormGroup = new UntypedFormGroup({});
    otpConfig: any = {};

    ngOnInit(): void {
        this.loginFormBuilder();
    }
    constructor(
        private router: Router,
        private _formBuilder: UntypedFormBuilder,
        private sandox: AuthenticationSandbox
    ) {
        this.otpConfig = this.sandox.getLoginOTPConfig();
    }

    login() {
        this.sandox.authenticate(this.userLoginForm.value).subscribe();
    }

    onForgotPasswordClick() {
        this.router.navigate(['forgot-password']);
    }

    onUnlockPasswordClick() {
        this.router.navigate(['unlock-user']);
    }

    onCancelClick() {
        this.userLoginForm.reset();
    }

    loginFormBuilder() {
        return (this.userLoginForm = this._formBuilder.group({
            email: [null, Validators.required],
            password: [null, Validators.required],
        }));
    }

    onLoginOtpFormSubmit() {
        this.router.navigate(['dashboard']);
    }
}
