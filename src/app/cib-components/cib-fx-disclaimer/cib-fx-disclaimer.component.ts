import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserContext } from 'src/app/shared/models';
import { SYSTEM_CONFIG } from 'src/app/shared/enums';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
    selector: 'app-cib-fx-disclaimer',
    templateUrl: './cib-fx-disclaimer.component.html',
    styleUrls: ['./cib-fx-disclaimer.component.scss'],
})
export class CibFxDisclaimerComponent implements OnInit {
    userContext!: UserContext;
    @Input() fxTransaction: boolean = false;
    @Input() fxThreshold: boolean = false;
    @Input() showCheckbox: boolean = true;
    @Input() fxThresholdTF: boolean = false;
    @Input() fxAdviceReport: boolean = false;
    @Input() fxRequestType: boolean = false;
    @Input() fxRequestTypeValid: any;
    @Output() checkboxValueEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    isDisclaimerChecked: boolean = true;
    showFxBasedOnRM: boolean = false;
    isThresholdTFChecked: boolean = false;
    showFXDisclaimerBasedOnConfig: boolean = false;
    isRequestTypeChecked: boolean = false;
    rmMsg: string = 'Your daily FX limit is USD 15,000 equivalent';

    constructor(private appContext: ApplicationContextService) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    ngOnInit() {
        this.isRequestTypeChecked = false;
        const organizationSelected = this.userContext?.organizationSelected;
        if ('1000'.indexOf(organizationSelected?.industry) === -1) {
            this.showFxBasedOnRM = true;
            if (Object.keys(this.userContext?.rmDetails).length !== 0)
                this.rmMsg = 'Your daily FX limit is USD 50,000 equivalent. You may contact your RM for further query';
        }
        if (this.userContext?.sysConfig[SYSTEM_CONFIG.FX_DISCLAIMER] === 'YES') {
            this.showFXDisclaimerBasedOnConfig = true;
            this.isDisclaimerChecked = !this.fxThreshold;
        }
        this.checkboxValueEvent.emit(this.isDisclaimerChecked);
        if (
            [
                'TRADEFINANCE_IMPORT_LC_SUBMIT',
                'TRADEFINANCE_LC_AMEND_SUBMIT',
                'BANK_GUARANTEE_AMMEND',
                'BANK_GUARANTEE_SUBMIT',
            ].indexOf(this.fxRequestTypeValid) !== -1
        ) {
            this.isRequestTypeChecked = true;
        }
    }

    onCheckBoxChange() {
        this.checkboxValueEvent.emit(this.isDisclaimerChecked);
    }

    onFxCheckBoxChange(event: any) {
        this.isThresholdTFChecked = event.checked;
        this.checkboxValueEvent.emit(this.isThresholdTFChecked);
    }
}
