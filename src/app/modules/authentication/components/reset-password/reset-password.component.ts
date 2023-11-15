import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DECISION } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    otp: any;
    form!: FormGroup;
    isPasswordMismatch = false;
    currentUser!: UserContext;
    verify: boolean = false;
    DECISION = DECISION;
    constructor(
        private router: Router,
        private _formBuilder: UntypedFormBuilder,
        private sandox: AuthenticationSandbox,
        private appContext: ApplicationContextService
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
        this.appContext.currentUser.subscribe((res: any) => (this.currentUser = res));
    }

    action(decision: DECISION) {
        const req = this.form.value;
        req.otp = this.otp;
        this.sandox.resetPassword(req, decision, this.currentUser.userName).subscribe((res: any) => {
            if (decision === DECISION.VERIFY) {
                this.verify = true;
            }
        });
    }

    onCancelClick() {
        this.router.navigate(['login']);
    }
}
