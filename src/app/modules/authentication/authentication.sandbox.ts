import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil, tap } from 'rxjs/operators';
import { DECISION } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { LoginCredentials } from 'src/app/shared/models/common.models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UtilService } from 'src/app/utility';
import { EncryptDecryptService } from 'src/app/utility/encrypt-decrypt.service';
import { ConfigService } from './../../configuration/config.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationSandbox implements OnDestroy {
    private unsubscribe$ = new Subject<void>();
    public currentUser!: UserContext;

    constructor(
        private configService: ConfigService,
        private authenticationService: AuthenticationService,
        private appContext: ApplicationContextService,
        private encryptDecrypt: EncryptDecryptService,
        private router: Router,
        private utilService: UtilService
    ) {
        this.appContext.currentUser.subscribe((res) => {
            this.currentUser = res;
        });
    }

    getVerticalSliderConfig() {
        return this.configService.get('verticalSlider');
    }

    getLoginOTPConfig() {
        return this.configService.get('loginOtp');
    }

    resetPassword(req: any, action: DECISION, userName: string) {
        const encrypted: any = {
            newPassword: this.encryptDecrypt.encrypt(req.newPassword),
            oldPassword: this.encryptDecrypt.encrypt(req.currentPassword),
            email: userName,
            action,
        };
        if (action === DECISION.CONFIRM) {
            encrypted.validateOTPRequest = {
                softTokenUser: false,
                otp: req.otp,
            };
        }
        return this.authenticationService.resetPassword(encrypted).pipe(
            tap((res: any) => {
                if (action === DECISION.CONFIRM && res.statusCode === 200) {
                    this.utilService.displayNotification('Password has been changed successfully!', 'success');
                    this.router.navigate(['login']);
                }
            })
        );
    }

    public authenticate(creds: LoginCredentials): any {
        const req = new LoginCredentials();
        req.email = creds.email;
        req.password =creds.password;
        return this.authenticationService.authenticate(req).pipe(
            takeUntil(this.unsubscribe$),
            tap((response: any) => {
                console.log(response);
                this.appContext.setUserLogin(response, req.email);
            })
        );
    }

    public validateOtp(otp: string): any {
        const req = {
            email: this.currentUser.userName,
            rimNumber: this.currentUser.selectedUserId,
            validateOTPRequest: {
                otp: otp,
                softTokenUser: true,
            },
        };
        this.authenticationService
            .validateOtp(req)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response: any) => {
                this.appContext.setValidatedUser(response.data);
            });
    }

    public forgotPasswordReq(payLoad: any): any {
        return this.authenticationService.forgotPasswordReq(payLoad).pipe(takeUntil(this.unsubscribe$));
    }

    public forgotPasswordConfirm(passwordInfo: any, otp: string, userInfo: any): any {
        const payload = {
            email: userInfo.userName.toUpperCase(),
            action: 'CONFIRM',
            newPassword: this.encryptDecrypt.encrypt(passwordInfo.confirmPasswrd),
            validateOTPRequest: {
                softTokenUser: '',
                otp: otp,
            },
        };
        this.authenticationService
            .forgotPasswordReq(payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response: any) => {
                this.utilService.displayNotification('Password has been changed successfully!', 'success');
                this.router.navigate(['login']);
            });
    }

    public unlockUserReq(payLoad: any): any {
        return this.authenticationService.unlockUserReq(payLoad).pipe(takeUntil(this.unsubscribe$));
    }

    public unlockUserConfirm(otp: string, userInfo: any): any {
        const payload = {
            email: userInfo.userName.toUpperCase(),
            action: 'CONFIRM',
            validateOTPRequest: {
                softTokenUser: '',
                otp: otp,
            },
        };
        this.authenticationService
            .unlockUserReq(payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((response: any) => {
                this.utilService.displayNotification('Username has been unlocked successfully!', 'success');
                this.router.navigate(['login']);
            });
    }

    logout() {
        return this.authenticationService.logout().pipe(
            tap((res: any) => {
                this.appContext.logout();
            })
        );
    }

    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
