import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  otp: any;
  email: string = '';
  constructor(
      private router: Router,
      private _formBuilder: UntypedFormBuilder,
      private sandox: AuthenticationSandbox
  ) {}

  ngOnInit(): void {
      this.signupFormBuilder();
      this.createPasswordFormBuilder();
  }

  isOtpfilled = false;
  isPasswordMismatch = false;
  isRequestPassword = false;
  signupForm: UntypedFormGroup = new UntypedFormGroup({});
  createPasswordForm: UntypedFormGroup = new UntypedFormGroup({});

  onOtpValueEnter(value: any) {
      this.otp = value;
      this.isOtpfilled = true;
  }

  onRequestPasswordClick() {
      const payload = this.signupForm.value;
      this.sandox.signUpPasswordReq(payload).subscribe((response: any) => {
          if (response) {
              this.email = payload.email;
              this.isRequestPassword = true;
          }
      });
  }

  onForgotPasswordConfirm() {
      this.sandox.signUpPasswordConfirm(this.createPasswordForm.value, this.otp, this.signupForm.value);
  }

  onCancelClick() {
      this.router.navigate(['login']);
  }

  signupFormBuilder() {
      return (this.signupForm = this._formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, [Validators.required,Validators.email]],
      }));
  }

  createPasswordFormBuilder() {
      return (this.createPasswordForm = this._formBuilder.group({
          newPasswrd: ['', Validators.required],
          confirmPasswrd: ['', Validators.required],
      }));
  }

  onPasswordInput() {
      if (this.createPasswordForm.get('newPasswrd') !== this.createPasswordForm.get('confirmPasswrd')) {
          this.isPasswordMismatch = true;
      } else {
          this.isPasswordMismatch = false;
      }
  }
}
