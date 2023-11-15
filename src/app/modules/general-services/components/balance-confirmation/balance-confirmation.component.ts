import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { CONFIG } from 'src/app/shared/enums/';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility/utility.service';
import { DECISION } from 'src/app/shared/enums';
import * as moment from 'moment';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-balance-confirmation',
    templateUrl: './balance-confirmation.component.html',
    styleUrls: ['./balance-confirmation.component.scss'],
})
export class BalanceConfirmationComponent implements OnInit {
    accounts: any = [];
    allowedFileTypes = ['png', 'JPG', 'jpeg', 'PDF'];
    isChargesReady: boolean = false;
    charges: any = 0;
    selectedCurrency: string = '';
    fileErrMsg: string = '';
    fileSuccessMsg: string = '';
    selectedFile: any;
    isRequestSuccess: boolean = false;
    balanceConfirmationRequestForm!: UntypedFormGroup;
    minDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 45);
    maxDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    statusData: any = { statusTitle: 'Balnace Confirmation Request Status', requestType: 'balance' }; //Notification Data
    module: any;
    dateFilter: any = 'daily';
    constructor(
        private sandBox: GeneralServicesSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.sandBox
            .getAccountListFiltered([], ['Current Account', 'Call Account', 'Savings Account'])
            .subscribe((accounts: Array<any>) => {
                this.accounts = accounts || [];
            });
        this.balanceConfirmationRequestForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
            requestDate: [null, [Validators.required]],
            period: ['daily', [Validators.required]],
            auditorName: [null, [Validators.required]],
            auditorAddress: [null, [Validators.required]],
            auditorContactNumber: [null, [Validators.required]],
            faxNumber: [null, [Validators.required]],
            auditorEmail: [null, [Validators.email]],
        });
        this.module = SERVICE_REQUEST_TYPES[3];
    }

    isLastDayOfMonth(date: Date | null): boolean {
        date = date ?? new Date();
        const dayOfMonth = date.getDate();
        const lastDayOfMonth = getLastDayOfMonth(date);
        return dayOfMonth === lastDayOfMonth;
    }

    onValChange(val: any) {
        if (val === 'daily') {
            this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 45);
            this.maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            this.dateFilter = val;
        } else {
            this.minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 365);
            this.maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            this.dateFilter = val;
        }
    }

    onFileSelected(file: any) {
        this.selectedFile = file;
    }

    onAccountChange(account: any) {
        let queryParams = {
            account: account.account_no,
            code: CONFIG.BALANCE_CNF_CHARGES_CODE,
            description: CONFIG.BALANCE_CNF_CHARGES_DESCRIPTION,
        };
        this.sandBox.getBalanceConfirmationCharges(queryParams).subscribe((res: any) => {
            if (res.data) {
                this.isChargesReady = true;
                this.charges = res.data.chargeAmount;
                this.selectedCurrency = res.data.chargeCurrency;
            }
        });
    }

    public sendRequest() {
        let formData = this.balanceConfirmationRequestForm.value;
        let payload = {
            request: {
                documentId: '', //updates after file upload
                auditorName: formData.auditorName,
                auditorAddress: formData.auditorAddress,
                phoneNumber: formData.auditorContactNumber,
                faxNumber: formData.faxNumber,
                auditorEmailId: formData.auditorEmail,
                debitAccountNumber: formData.fromAccount.account_no,
                period: formData.period,
                currency: this.selectedCurrency,
                charge: this.charges,
                description: CONFIG.BALANCE_CNF_CHARGES_DESCRIPTION,
                code: CONFIG.BALANCE_CNF_CHARGES_CODE,
                requestDate: moment(formData.requestDate).format('DD-MM-YYYY'),
            },
            requestDetails: {}, //updates after file upload
            action: 'VERIFY',
        };

        this.sandBox.sendBalanceConfirmationRequest(payload).subscribe((resp: any) => {
            if (resp) {
                let isOTPReceived = true;
                this.openPopup(formData, payload, isOTPReceived);
            }
        });
    }

    openPopup(formData: any, verifyPayLoad: any, isOTPReceived: boolean) {
        let payLoad: any = {
            details: {
                data: {
                    requestType: '6',
                    charges: verifyPayLoad.request.charge,
                    currency: verifyPayLoad.request.currency,
                    debitAccountNo: formData.fromAccount.account_no,
                    mobileNo: formData.auditorContactNumber,
                    info1: formData.auditorEmail,
                    info2: formData.auditorName,
                    info4: formData.auditorAddress,
                    info3: formData.period,
                    info7: formData.faxNumber,
                    execStartDate: moment(formData.requestDate).format('DD-MM-YYYY'),
                    isOTPEnabled: isOTPReceived,
                },
            },
        };
        payLoad.details.data = { ...formData, ...payLoad.details.data };
        payLoad.details.data['charges'] = verifyPayLoad.request.charge;
        payLoad.details.data['currency'] = verifyPayLoad.request.currency;

        const ref = this.dialog.openDrawer('Balance Confirmation Summary', GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                verifyPayLoad = {
                    ...verifyPayLoad,
                    ...{
                        action: 'CONFIRM',
                        ...{
                            validateOTPRequest: {
                                softTokenUser: false,
                                otp: result.data.otp,
                            },
                        },
                    },
                };
                let uploadFormData = new FormData();
                uploadFormData.append('files', this.selectedFile);
                this.sandBox.balConfFileUpload(uploadFormData).subscribe((res: any) => {
                    if (res?.data?.documents?.length > 0) {
                        let documents = res.data.documents;
                        verifyPayLoad.request.documentId = documents[0].id || '';
                        verifyPayLoad.requestDetails = documents[0];
                        this.sandBox.sendBalanceConfirmationRequest(verifyPayLoad).subscribe((res: any) => {
                            if (res.data) {
                                this.isRequestSuccess = true;
                                (this.statusData.requestType = '6'),
                                    (this.statusData.charges = verifyPayLoad.request.charge),
                                    (this.statusData.currency = verifyPayLoad.request.currency),
                                    (this.statusData.debitAccountNo = formData.fromAccount.account_no),
                                    (this.statusData.mobileNo = formData.auditorContactNumber),
                                    (this.statusData.info1 = formData.auditorEmail),
                                    (this.statusData.info2 = formData.auditorName),
                                    (this.statusData.info4 = formData.auditorAddress),
                                    (this.statusData.info3 = formData.period),
                                    (this.statusData.info7 = formData.faxNumber),
                                    (this.statusData.execStartDate = moment(formData.requestDate).format('DD-MM-YYYY')),
                                    (this.statusData.statusMessage = res.data.requestId
                                        ? 'Your Request has been sent for approval. Request ID #: ' + res.data.requestId
                                        : 'Your Request has been created successfully. Request ID #' + res.data);
                                this.statusData = { ...this.statusData, ...payLoad.details.data };
                            }
                        });
                    } else this.utilService.displayNotification('Unable to upload file', 'error');
                });
            }
        });
    }
}

function getLastDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
