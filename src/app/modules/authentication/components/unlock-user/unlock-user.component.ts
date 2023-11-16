import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
    selector: 'app-unlock-user',
    templateUrl: './unlock-user.component.html',
    styleUrls: ['./unlock-user.component.scss'],
})
export class UnlockUserComponent implements OnInit {
    otp: any;
    email: string = '';
    constructor(
        private router: Router,
        private _formBuilder: UntypedFormBuilder,
        private sandox: AuthenticationSandbox
    ) {}

    ngOnInit(): void {
        this.UnlockUserormBuilder();
    }

    isOtpfilled = false;
    isRequestUser = false;
    unlockUserForm: UntypedFormGroup = new UntypedFormGroup({});

    onOtpValueEnter(value: any) {
        this.otp = value;
        this.isOtpfilled = true;
    }

    onRequestUnlockUserClick() {
        const payload = {
            email: this.unlockUserForm.controls['userName'].value.toUpperCase(),
            action: 'VERIFY',
        };

        this.sandox.unlockUserReq(payload).subscribe((response: any) => {
            if (response.statusCode === 200) {
                this.email = payload.email;
                this.isRequestUser = true;
            }
        });
    }

    onUnlockUserConfirm() {
        this.sandox.unlockUserConfirm(this.otp, this.unlockUserForm.value);
    }

    onCancelClick() {
        this.router.navigate(['login']);
    }

    UnlockUserormBuilder() {
        return (this.unlockUserForm = this._formBuilder.group({
            userName: [null, Validators.required],
        }));
    }
}
