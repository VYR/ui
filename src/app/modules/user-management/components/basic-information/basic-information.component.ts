import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SCREEN_MODE, USER_TYPE } from 'src/app/shared/enums';
import { UsermanagementSandbox } from '../../user-management.sandbox';

@Component({
    selector: 'app-basic-information',
    templateUrl: './basic-information.component.html',
    styleUrls: ['./basic-information.component.scss'],
})
export class BasicInformationComponent implements OnInit {
    @Input() form!: FormGroup;
    @Input() options!: any;
    @Input() screenMode: SCREEN_MODE = SCREEN_MODE.CREATE;
    @Input() userRimInfo: any = [];
    SCREEN_MODE = SCREEN_MODE;
    USER_TYPE = USER_TYPE;
    rimList: any;
    businessName: any;
    rimRole: any = [];
    constructor(private sandbox: UsermanagementSandbox) {}

    ngOnInit(): void {
        if (this.userRimInfo !== undefined) {
            this.userRimInfo.forEach((x: any) => {
                let selectRole = this.options.userTypes.find((role: any) => {
                    return role.value == x.role.type;
                });
                this.rimRole.push({ rimRole: x.customer.uniqueUserId + '(' + selectRole.label + ')' });
            });
            this.rimList = this.rimRole?.map((item: any) => item.rimRole).join();
            this.businessName = this.userRimInfo[0]?.customer.business.businessName;
        }
        this.updateValidators();
    }

    checkAvailability() {
        const email = this.form.controls['email'].value.trim();
        if (email.length < 6 || this.form.controls['email'].invalid) return;
        this.sandbox.checkUserName(email).subscribe((res: any) => {
            this.form.controls['isUserNameValidated'].setValue(res.statusCode === 200 ? true : null);
            this.form.controls['isUserNameValidated'].updateValueAndValidity();
        });
    }

    updateValidators() {
        if (!this.form.controls['enabled'].value) this.form.controls['comments'].setValidators([Validators.required]);
        else this.form.controls['comments'].clearValidators();

        this.form.controls['comments'].updateValueAndValidity();
    }
}
