import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-e-statement',
    templateUrl: './e-statement.component.html',
    styleUrls: ['./e-statement.component.scss'],
})
export class EStatementComponent implements OnInit {
    accounts: any = []; // For account drop down
    isRequestSuccess: boolean = false; // To show success message card in UI
    alternateEmailList: Array<string> = [];
    eStatementRequestForm!: UntypedFormGroup; //For form creation
    statusData: any = { statusTitle: 'ESTATEMENT REQUEST STATUS', requestType: 'eStatement' }; //Notification data
    module: any;
    constructor(
        private sandBox: GeneralServicesSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService
    ) {}

    ngOnInit(): void {
        this.sandBox
            .getAccountListFiltered([], ['Current Account', 'Call Account', 'Savings Account'])
            .subscribe((accounts: Array<any>) => {
                this.accounts = accounts || [];
                this.eStatementRequestForm = this.fb.group({
                    fromAccount: [null, [Validators.required]],
                    period: [null, [Validators.required]],
                    email: [this.sandBox.currentUser?.organizationSelected?.businessemailid, [Validators.required]],
                });
            });
        this.module = SERVICE_REQUEST_TYPES[2];
    }

    getValues(emails: Array<any>) {
        this.alternateEmailList = emails;
    }

    getEmails() {
        const emails: any = (this.eStatementRequestForm.controls['email'].value || '').split(' ');
        return emails;
    }

    public processEStatementRequest() {
        let formData = this.eStatementRequestForm.value;
        const emailList = formData.email?.split(' ').concat(this.alternateEmailList);
        let payload = {
            request: {
                accountNumber: formData.fromAccount.account_no,
                alternateEmailId: this.alternateEmailList.toString(),
                emailId: formData.email,
                emailList: emailList.toString(),
                period: formData.period,
            },
            action: 'VERIFY',
            validateOTPRequest: {},
        };
        this.sandBox.sendEStatementRequest(payload).subscribe((res: any) => {
            if (res) {
                let isOTPReceived = true;
                this.openPopup(isOTPReceived, formData, payload);
            }
        });
    }
    openPopup(isOTPReceived: boolean, formData: any, payload: any) {
        const payLoad = {
            details: {
                data: {
                    requestType: '7',
                    accountNo: formData.fromAccount.account_no,
                    info1: formData.email,
                    info3: formData.period,
                    info5: this.alternateEmailList.toString(),
                    isOTPEnabled: isOTPReceived,
                },
            },
        };
        const ref = this.dialog.openDrawer('eStatement Request Summary', GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                payload['action'] = 'CONFIRM';
                payload['validateOTPRequest'] = {
                    softTokenUser: false,
                    otp: result.data.otp,
                };
                this.sandBox.sendEStatementRequest(payload).subscribe((res: any) => {
                    if (res.data) {
                        this.isRequestSuccess = true;
                        this.statusData.requestType = '7';
                        this.statusData.accountNo = formData.fromAccount.account_no || '';
                        this.statusData.info3 = formData.period;
                        this.statusData.info1 = formData.email;
                        this.statusData.info5 = this.alternateEmailList.toString();
                        this.statusData.statusMessage = res.data.requestId
                            ? 'Your Request has been sent for approval. Request ID #: ' + res.data.requestId
                            : 'Your Request has been created successfully. Request ID #' + res.data;
                    }
                });
            }
        });
    }
}
