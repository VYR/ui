import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SYSTEM_CONFIG } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { BankadminDashboardSandbox } from '../../bank-admin-dashboard.sandbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-application-config',
    templateUrl: './application-config.component.html',
    styleUrls: ['./application-config.component.scss'],
})
export class ApplicationConfigComponent implements OnInit {
    allowedDaysConfig: any;
    fxConfig: any;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private appContext: ApplicationContextService,
        private sandBox: BankadminDashboardSandbox
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    ngOnInit() {
        for (let index = 0; index < 30; index++) {
            this.days.push((index + 1).toString());
        }

        this.userContext.sysConfigAllInfo.forEach((info) => {
            if (info.key === SYSTEM_CONFIG.BACK_DATE) {
                this.allowedDaysConfig = info;
            }
            if (info.key === SYSTEM_CONFIG.FX_DISCLAIMER) {
                this.fxConfig = info;
            }
        });

        this.form = this.fb.group({
            day: [this.allowedDaysConfig?.value || 30, Validators.required],
            fxDisclaimer: [this.fxConfig?.value === 'YES' ? true : false],
        });
    }

    userContext!: UserContext;
    days: any = [];

    form!: UntypedFormGroup;

    submit() {
        this.allowedDaysConfig.value = this.form.controls['day'].value;
        this.fxConfig.value = this.form.controls['fxDisclaimer'].value ? 'YES' : 'NO';
        let payload = {
            systemConfigurations: [this.allowedDaysConfig, this.fxConfig],
        };

        this.sandBox.updateSysConfig(payload).subscribe((res: any) => {
            this.router.navigate(['home/admin/my-queue']);
        });
    }
}
