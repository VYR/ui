import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SgsComponentsModule } from 'src/app/sgs-components/sgs-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthenticationSandbox } from './authentication.sandbox';
import { ValidateOtpComponent } from './components/validate-otp/validate-otp.component';
import { PreLoginHeaderComponent } from './components/pre-login-header/pre-login-header.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
    declarations: [
        AuthenticationComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ValidateOtpComponent,
        PreLoginHeaderComponent,
        ResetPasswordComponent,
    ],
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        MatButtonModule,
        MatIconModule,
        SgsComponentsModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatTooltipModule,
        MatToolbarModule,
        SlickCarouselModule,
    ],
    providers: [AuthenticationSandbox],
})
export class AuthenticationModule {}
