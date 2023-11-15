import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility/utility.service';
import { DECISION } from 'src/app/shared/enums';
import * as moment from 'moment';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';
import { CorporateDepositCardRequestConfirmationComponent } from '../corporate-deposit-card-request-confirmation/corporate-deposit-card-request-confirmation.component';
@Component({
    selector: 'app-corporate-deposit-card',
    templateUrl: './corporate-deposit-card.component.html',
    styleUrls: ['./corporate-deposit-card.component.scss'],
})
export class CorporateDepositCardComponent implements OnInit {
    userContext!: UserContext;
    requestId: any = '';
    public files: any = [];
    public depositeCardForm!: UntypedFormGroup;
    regdQids: any = [];
    accountList: any = [];
    selectedAccount: any = {};
    minDate = new Date();
    public documentsList = [
        {
            fileName: null,
            label: 'Valid Commercial Registration',
        },
        {
            fileName: null,
            label: 'Establishment Card.',
        },
        {
            fileName: null,
            label: 'QID of partners, authorized signatures and cardholders',
        },
        {
            fileName: null,
            label: 'Trade license',
        },
    ];
    allowedCards = 20;
    cardsRequested = 0;
    hasAccountSelected = false;
    public cardsList: any = [];
    public channelsList: any = ['cardsRequested', 'cibPendingCardsRequested', 'primeCardsRequested'];
    companyName: string = '';
    commRegNo: string = '';
    invalidQid = -1;
    isRequestSuccess: boolean = false;
    requestSuccessData: any;
    isCRExpired: boolean = false;
    downloadFileName = 'Corporate-Deposit-Cards-Terms&Conditions';
    sampleurl = 'assets/content/Corporate-Deposit-Cards-Terms&Conditions.pdf';
    ischeckBoxSelected: boolean = false;
    showDepositCardHistory: boolean = false;
    islimitReached: boolean = false;

    constructor(
        private sandBox: GeneralServicesSandbox,
        public fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private utilService: UtilService,
        private appContext: ApplicationContextService
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    ngOnInit(): void {
        this.depositeCardForm = this.fb.group({
            account: [null, [Validators.required]],
            companyNameOnCard: [null, [Validators.required]],
            crExpiryDate: [null, [Validators.required]],
            buildingNo: [null, [Validators.required]],
            streetNo: [null, [Validators.required]],
            zoneNo: [null, [Validators.required]],
            poBoxNo: [null, [Validators.required]],
            cards: this.fb.array([]),
        });
        this.getDepositCardList();
    }

    getDepositCardList() {
        this.sandBox.getDepositCardList().subscribe((res: any) => {
            if (res.limitReached) this.islimitReached = true;
            else {
                this.setCompanyInfo(this.userContext.organizationSelected);
                this.addCard();
                this.regdQids = res.qids || [];
                this.cardsRequested = res.cardsRequested;
                this.getAccountsList(res.accountNumber);
            }
        });
    }

    getAccountsList(accountNo: any) {
        this.sandBox.getCaseAccounts(accountNo).subscribe((res: any) => {
            this.accountList = res.accountList;
            if (res.hasAccountSelected) {
                this.selectedAccount = res.selectedaccount;
                this.hasAccountSelected = res.hasAccountSelected;
                this.depositeCardForm.patchValue({
                    account: res.selectedaccount.account_no,
                });
            }
        });
    }

    setCompanyInfo(companyDetails: any) {
        let crExpDate: any = companyDetails.legaldocExpDate
            ? moment(companyDetails.legaldocExpDate, 'YYYYMMDD').format('DD-MMM-YYYY')
            : new Date();
        this.isCRExpired = new Date(Date.parse(crExpDate)) < new Date();
        this.companyName = companyDetails.firstName + ' ' + companyDetails.middleName + ' ' + companyDetails.lastName;
        this.commRegNo = companyDetails.legalId;
        this.depositeCardForm.patchValue({
            crExpiryDate: new Date(crExpDate),
            buildingNo: companyDetails.address1,
            streetNo: companyDetails.address2,
            zoneNo: companyDetails.address3,
            poBoxNo: +companyDetails.pobox,
        });
    }

    checkECValidity(ev: any) {
        this.isCRExpired = new Date(Date.parse(this.depositeCardForm.value.crExpiryDate)) < new Date();
    }

    validateQid(index: any) {
        const cards = this.depositeCardForm.controls['cards'] as FormArray;
        const qids = cards.value.map((x: any, i: number) => index !== i && x.qatarId);
        const current = cards.at(index) as FormGroup;
        const isAdded = [...this.regdQids, ...qids].includes(current.value['qatarId']);
        current.controls['isValidQid'].setValue(!isAdded);
        current.controls['isValidQid'].updateValueAndValidity();
    }

    isValidQid(index: number) {
        const cards = this.depositeCardForm.controls['cards'] as FormArray;
        const current = cards.at(index) as FormGroup;
        return !current.controls['isValidQid'].value;
    }

    onFileSelected(files: any, index: number) {
        if (files) this.files.push(files);
        else this.files.splice(index, 1);
        this.documentsList[index].fileName = files?.name;
    }

    get cardsFormArray(): FormArray {
        return this.depositeCardForm.controls['cards'] as FormArray;
    }

    addCard() {
        const cardForm = this.fb.group({
            cardHolderName: [null, [Validators.required]],
            mobile: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            qatarId: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            isValidQid: [true],
        });
        this.cardsFormArray.push(cardForm);
    }

    deleteCard(index: number) {
        this.cardsFormArray.removeAt(index);
    }

    public confirmSaveDepositRequest(action: any, isOTPReceived = false, otp = '') {
        let tempCards: any = [];
        this.depositeCardForm.value.cards.forEach((card: any) => {
            tempCards.push({
                currentAccountNo: this.selectedAccount.type === 'CA' ? this.selectedAccount.account_no : null,
                savingAccountNo: this.selectedAccount.type === 'SA' ? this.selectedAccount.account_no : null,
                embName: card.cardHolderName,
                qid: card.qatarId,
                mobile: card.mobile,
                failureReason: 'NIL',
                cardNumber: '',
            });
        });
        let payload = {
            externalCardRequestsMeta: {
                companyName: this.depositeCardForm.value.companyNameOnCard,
                commRegNo: this.commRegNo,
                crExpiryDate: moment(this.depositeCardForm.value.crExpiryDate).format('DD-MM-YYYY'),
                linkSavingAcc: this.selectedAccount.type === 'SA' ? this.selectedAccount.account_no : '',
                linkCurrentAcc: this.selectedAccount.type === 'CA' ? this.selectedAccount.account_no : '',
                addrLine1: this.depositeCardForm.value.buildingNo,
                addrLine2: this.depositeCardForm.value.streetNo,
                addrLine3: this.depositeCardForm.value.zoneNo,
                noOfCards: this.depositeCardForm.value.cards.length,
                poBox: this.depositeCardForm.value.poBoxNo,
                rim: this.userContext?.organizationSelected.rimNumber,
                documentId: '',
                rejectReason: '',
                externalCardRequestsMaster: tempCards,
            },
            action: action,
            validateOTPRequest: isOTPReceived ? { softTokenUser: false, otp: otp } : {},
        };
        if (action === 'VERIFY') {
            this.sandBox.saveDepositCards(payload).subscribe((res: any) => {
                let isOTPReceived = res.data?.tokenSent || false;
                this.openPopup(isOTPReceived, payload.externalCardRequestsMeta);
            });
        } else {
            let uploadFormData = new FormData();
            this.files.forEach((x: any) => {
                uploadFormData.append('files', x);
            });
            this.sandBox.depositCardDocumentsUpload(uploadFormData).subscribe((fileUpload: any) => {
                if (fileUpload?.data?.documents?.length > 0) {
                    payload.externalCardRequestsMeta.documentId = fileUpload?.data?.documents[0].contractId;
                    this.sandBox.saveDepositCards(payload).subscribe((res: any) => {
                        if (res.data) {
                            if (res.data.requestId || res.status === 'APPROVAL_REQUESTED') {
                                this.isRequestSuccess = true;
                                this.requestSuccessData = {
                                    statusMessage:
                                        'Your Request has been sent for approval. Request ID: #' + res.data.requestId,
                                    data: payload.externalCardRequestsMeta,
                                };
                            } else {
                                this.isRequestSuccess = true;
                                this.requestSuccessData = {
                                    statusMessage:
                                        'Your Request has been submitted successfully for processing. Reference No: #' +
                                        res.data,
                                    data: payload.externalCardRequestsMeta,
                                };
                            }
                        }
                    });
                } else this.utilService.displayNotification('Unable to upload files', 'error');
            });
        }
    }

    openPopup(isOTPReceived: boolean, payload: any) {
        const ref = this.dialog.openDrawer(
            'Deposit Card Request Summary',
            CorporateDepositCardRequestConfirmationComponent,
            payload
        );
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmSaveDepositRequest('CONFIRM', isOTPReceived, result.data.otp);
            }
        });
    }

    depositCardDocumentsUpload(action: string) {
        let uploadFormData = new FormData();
        uploadFormData.append('files', this.files);
        return this.sandBox.depositCardDocumentsUpload(uploadFormData);
    }

    selectedAccountNumber(event: any) {
        this.selectedAccount = event.value;
    }

    isCheckBoxSelected(event: any) {
        this.ischeckBoxSelected = event.checked;
    }

    goToHistory() {
        this.showDepositCardHistory = true;
    }

    closeHistory() {
        this.showDepositCardHistory = false;
    }
}
