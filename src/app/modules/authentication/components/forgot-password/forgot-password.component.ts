import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthenticationSandbox } from '../../authentication.sandbox';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    otp: any;
    email: string = '';
    constructor(
        private router: Router,
        private _formBuilder: UntypedFormBuilder,
        private sandox: AuthenticationSandbox
    ) {}

    ngOnInit(): void {
        this.forgotPasswordFormBuilder();
        this.userRIMSelectionFormBuilder();
    }

    isOtpfilled = false;
    isPasswordMismatch = false;
    isRequestPassword = false;
    forgotPasswordForm: UntypedFormGroup = new UntypedFormGroup({});
    userRIMSelectionForm: UntypedFormGroup = new UntypedFormGroup({});

    onOtpValueEnter(value: any) {
        this.otp = value;
        this.isOtpfilled = true;
    }

    onRequestPasswordClick() {
        const payload = {
            email: this.forgotPasswordForm.controls['userName'].value.toUpperCase(),
            action: 'VERIFY',
        };

        this.sandox.forgotPasswordReq(payload).subscribe((response: any) => {
            if (response.statusCode === 200) {
                this.email = payload.email;
                this.isRequestPassword = true;
            }
        });
    }

    onForgotPasswordConfirm() {
        this.sandox.forgotPasswordConfirm(this.userRIMSelectionForm.value, this.otp, this.forgotPasswordForm.value);
    }

    onCancelClick() {
        this.router.navigate(['login']);
    }

    forgotPasswordFormBuilder() {
        return (this.forgotPasswordForm = this._formBuilder.group({
            userName: [null, Validators.required],
        }));
    }

    userRIMSelectionFormBuilder() {
        return (this.userRIMSelectionForm = this._formBuilder.group({
            newPasswrd: ['', Validators.required],
            confirmPasswrd: ['', Validators.required],
        }));
    }

    onPasswordInput() {
        if (this.userRIMSelectionForm.get('newPasswrd') !== this.userRIMSelectionForm.get('confirmPasswrd')) {
            this.isPasswordMismatch = true;
        } else {
            this.isPasswordMismatch = false;
        }
    }
}
