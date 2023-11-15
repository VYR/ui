import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { REQUEST_LIST_TYPE } from 'src/app/shared/enums/';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-cheque-book',
    templateUrl: './cheque-book.component.html',
    styleUrls: ['./cheque-book.component.scss'],
})
export class ChequeBookComponent implements OnInit {
    module: any;
    accounts: any = []; // For account drop down
    isChargesReady: boolean = false; // To display charges on calling API
    charges: any = 0; // To display in UI after changes API call
    selectedCurrency: string = ''; //To display in UI after changes API call
    noOfLeaves: any = 0; //To display in UI after changes API call
    isRequestSuccess: boolean = false; // To show success message card in UI
    statusData: any = { statusTitle: 'CHEQUEBOOK REQUEST STATUS', requestType: 'cheque' }; //Notification Data
    chequeBookRequestForm!: UntypedFormGroup; //For form creation
    constructor(
        private sandBox: GeneralServicesSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService
    ) {}

    ngOnInit(): void {
        this.sandBox.getAccountListFiltered(['QAR'], ['Current Account']).subscribe((accounts: Array<any>) => {
            this.accounts = accounts || [];
            this.chequeBookRequestForm = this.fb.group({
                fromAccount: [null, [Validators.required]],
                noOfLeaves: [null, [Validators.required]],
            });
        });
        this.module = SERVICE_REQUEST_TYPES[1];
    }

    onTypeChange(event: any) {
        let formData = this.chequeBookRequestForm.value;
        this.noOfLeaves = event.value;
        let queryParams = {
            accountNumber: formData.fromAccount.account_no,
            numberOfLeaves: formData.noOfLeaves,
            requestType: 1,
            description: '',
        };
        this.sandBox.getChequeBookCharges(queryParams).subscribe((res: any) => {
            let leaves: Array<any> = res?.data || [];
            if (leaves.length > 0) {
                this.isChargesReady = true;
                this.charges = res.data[0].charges;
            }
        });
    }
    public processChequeBookRequest() {
        let formData = this.chequeBookRequestForm.value;
        let payload = {
            request: {
                accountNumber: formData.fromAccount.account_no,
                numberOfLeaves: this.noOfLeaves,
                currency: formData.fromAccount.currency,
                charge: this.charges,
            },
            action: 'VERIFY',
        };
        this.sandBox.sendChequeBookRequest(payload).subscribe((res: any) => {
            if (res) {
                const isOTPReceived = true;
                this.openPopup(isOTPReceived, formData);
            }
        });
    }
    openPopup(isOTPReceived: boolean, data: any) {
        const payLoad = {
            details: {
                data: {
                    requestType: '1',
                    accountNo: data.fromAccount.account_no,
                    currency: data.fromAccount.currency,
                    info6: data.noOfLeaves,
                    charges: this.charges,
                    isOTPEnabled: isOTPReceived,
                },
            },
        };
        const ref = this.dialog.openDrawer('Chequebook Request Summary', GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                let postParams: any = {
                    request: {
                        accountNumber: data.fromAccount.account_no,
                        numberOfLeaves: data.noOfLeaves,
                        currency: data.fromAccount.currency,
                        charge: this.charges,
                        swifCharge: 'TRUE',
                    },
                    action: 'CONFIRM',
                    validateOTPRequest: {
                        softTokenUser: false,
                        otp: result.data.otp,
                    },
                };
                this.sandBox.sendChequeBookRequest(postParams).subscribe((res: any) => {
                    if (res.data) {
                        this.isRequestSuccess = true;
                        this.statusData.requestType = '1';
                        this.statusData.accountNo = data.fromAccount?.account_no || '';
                        this.statusData.info6 = data.noOfLeaves;
                        this.statusData.currency = data.fromAccount?.currency || '';
                        this.statusData.charges = this.charges;
                        this.statusData.statusMessage = res.data.requestId
                            ? 'Your Request has been sent for approval. Request ID #: ' + res.data.requestId
                            : 'Your Request has been created successfully. Request ID #' + res.data;
                    }
                });
            }
        });
    }
}
