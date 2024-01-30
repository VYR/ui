import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ValidateOtpComponent } from './components/validate-otp/validate-otp.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent,
        children: [
            {
                path: '',
                component: LoginComponent,
                pathMatch: 'full',
            },
            {
                path: 'signup',
                component: SignupComponent,
                pathMatch: 'full',
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'validate-otp',
                component: ValidateOtpComponent,
                pathMatch: 'prefix',
            },
            {
                path: '**',
                redirectTo: '/',
                pathMatch: 'prefix',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
