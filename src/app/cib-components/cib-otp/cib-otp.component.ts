import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { CibComponentsSandbox } from '../cib-components.sandbox';

@Component({
    selector: 'app-cib-otp',
    templateUrl: './cib-otp.component.html',
    styleUrls: ['./cib-otp.component.scss'],
})
export class CibOtpComponent implements OnInit {
    @Output() otpValueEvent: EventEmitter<string> = new EventEmitter<string>();
    @Input() email: string = '';
    @Input() showMore: boolean = false;
    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

    otpResendTimeout: number = 0;
    count: number = 0;
    enableResend = false;
    otpConfig: any;

    constructor(private configService: ConfigService, private cibComponentsSandbox: CibComponentsSandbox) {
        this.otpConfig = this.configService.get('loginOtp');
        this.otpResendTimeout = this.otpConfig.resendTimeout;
    }

    ngOnInit() {
        setInterval(() => {
            if (this.count === 0) {
                this.enableResend = true;
            } else {
                this.enableResend = false;
            }
        }, this.otpResendTimeout);
    }

    onOtpChange(value: any) {
        this.otpValueEvent.emit(value);
    }

    onResendClick() {
        this.enableResend = false;
        this.cibComponentsSandbox.resendOtp(this.email);
    }
}
