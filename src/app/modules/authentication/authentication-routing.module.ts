import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ValidateOtpComponent } from './components/validate-otp/validate-otp.component';
import { UnlockUserComponent } from './components/unlock-user/unlock-user.component';

const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
                pathMatch: 'full',
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                pathMatch: 'full',
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
                pathMatch: 'full',
            },
            {
                path: 'validate-otp',
                component: ValidateOtpComponent,
                pathMatch: 'full',
            },
            {
                path: 'unlock-user',
                component: UnlockUserComponent,
                pathMatch: 'full',
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
