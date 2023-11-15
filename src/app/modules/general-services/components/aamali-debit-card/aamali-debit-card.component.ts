import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DECISION } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { CardsSandbox } from '../../../cards/cards.sandbox';
import { AamaliDebitCardRequestConfirmationComponent } from '../aamali-debit-card-request-confirmation/aamali-debit-card-request-confirmation.component';

@Component({
    selector: 'app-aamali-debit-card',
    templateUrl: './aamali-debit-card.component.html',
    styleUrls: ['./aamali-debit-card.component.scss'],
})
export class AamaliDebitCardComponent implements OnInit {
    userContext!: UserContext;
    public files: any = [null];
    isReadyToUpload: boolean = false;
    public aamalieCardForm!: UntypedFormGroup;
    accountList: any[] = [];
    selectedAccount: any = {};
    minDate = new Date();
    charges: any = '';
    showCardForm: boolean = true;
    public documentsList = [
        {
            fileName: null,
            isDelete: false,
            label: 'QID of partners, authorized signatures and cardholders',
        },
    ];
    cardsRequested = 0;
    commRegNo: string = '';
    isRequestSuccess: boolean = false;
    requestSuccessData: any;
    isCRExpired: boolean = false;
    termsFileName = '';
    termsUrl = '';
    ischeckBoxSelected: boolean = false;
    islimitReached: boolean = false;
    approverList: Array<any> = [];
    showForm: boolean = false;
    selectedApprovers: Array<any> = [];
    isStpUser: boolean = false;
    accountCategoryCodes: any;
    showAamaliCardHistory: boolean = false;

    constructor(
        public fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private utilService: UtilService,
        private appContext: ApplicationContextService,
        private cardsSandbox: CardsSandbox
    ) {
        this.appContext.currentUser.subscribe((res) => {
            this.userContext = res;
        });
        this.termsFileName = this.cardsSandbox.termsFileName;
        this.termsUrl = this.cardsSandbox.termsUrl;
    }

    ngOnInit(): void {
        this.isStpUser = this.userContext.stpUser;
        this.aamalieCardForm = this.fb.group({
            account: [null, [Validators.required]],
            companyNameOnCard: ['', [Validators.required, Validators.maxLength(20)]],
            crExpiryDate: [null, [Validators.required]],
            buildingNo: [null, [Validators.required]],
            streetNo: [null, [Validators.required]],
            zoneNo: [null, [Validators.required]],
            poBoxNo: [null, [Validators.required]],
            cards: this.fb.array([]),
        });
        this.getAamaliCardList();
    }

    getAamaliCardList() {
        this.setCompanyInfo(this.userContext.organizationSelected);
        this.getCategoryCodesAccounts();
    }

    public getCategoryCodesAccounts() {
        this.cardsSandbox.getCategoryCodesAccounts().subscribe((res: any) => {
            if (res.data) {
                this.accountCategoryCodes = {
                    savingsAcc: res.data.savingsCategory || [],
                    currentAcc: res.data.currentCategory || [],
                };
                this.getAccountsList();
            }
        });
    }

    getAccountsList() {
        this.cardsSandbox.getAccounts().subscribe((res: any) => {
            this.accountList = res?.data?.accounts || [];
            this.getApprovers();
        });
    }

    getApprovers() {
        this.cardsSandbox.getApprovers().subscribe((res: any) => {
            this.approverList = res.data;
            this.approverList = this.approverList.sort((a, b) => {
                return a.username - b.username;
            });
        });
    }

    setCompanyInfo(companyDetails: any) {
        let crExpDate: any = companyDetails.legaldocExpDate
            ? moment(companyDetails.legaldocExpDate, 'YYYYMMDD').format('DD-MMM-YYYY')
            : new Date();
        this.isCRExpired = new Date(Date.parse(crExpDate)) < new Date();
        this.commRegNo = companyDetails.legalId;
        let companyName = companyDetails.firstName + ' ' + companyDetails.lastName;
        companyName = companyName.substring(0, 20);
        this.aamalieCardForm.patchValue({
            crExpiryDate: new Date(crExpDate),
            buildingNo: companyDetails.address1,
            streetNo: companyDetails.address2,
            zoneNo: companyDetails.address3,
            poBoxNo: companyDetails.pobox,
            companyNameOnCard: companyName,
        });
    }

    checkECValidity(ev: any) {
        this.isCRExpired = new Date(Date.parse(this.aamalieCardForm.value.crExpiryDate)) < new Date();
    }

    onFileSelected(file: any, index: number) {
        this.isReadyToUpload = false;
        if (file) {
            this.files[index] = file;
            this.documentsList[index].fileName = file?.name;
            this.isReadyToUpload = true;
        }
    }

    get cardsFormArray(): FormArray {
        return this.aamalieCardForm.controls['cards'] as FormArray;
    }

    addCard() {
        const mobile = this.userContext?.mobilePhone || '';
        let cardHolderName = this.userContext?.firstName + ' ' + this.userContext?.lastName || '';
        cardHolderName = cardHolderName.toUpperCase();
        const cardForm = this.fb.group({
            approver: [{ value: '', disabled: this.isStpUser }, [Validators.required]],
            cardHolderName: [
                { value: this.isStpUser ? cardHolderName.substring(0, 25) : '', disabled: true },
                [Validators.required, Validators.maxLength(25)],
            ],
            mobile: [
                { value: this.isStpUser ? mobile.substring(0, 11) : '', disabled: false },
                [
                    Validators.required,
                    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                    Validators.maxLength(11),
                    Validators.minLength(8),
                ],
            ],
            qatarId: [
                { value: '', disabled: false },
                [
                    Validators.required,
                    Validators.pattern(/^-?(0|[1-9]\d*)?$/),
                    Validators.maxLength(11),
                    Validators.minLength(11),
                ],
            ],
            isValidQid: [true],
        });
        this.cardsFormArray.push(cardForm);
    }

    alloNumbersOnly(event: any) {
        return this.cardsSandbox.alloNumbersOnly(event);
    }

    restrictInputLength(event: any, length: number) {
        return this.cardsSandbox.restrictInputLength(event, length);
    }

    aamaliCardDocumentsUpload(action: string) {
        let uploadFormData = new FormData();
        uploadFormData.append('files', this.files);
        return this.cardsSandbox.aamaliCardDocumentsUpload(uploadFormData);
    }

    selectedAccountNumber(event: any) {
        this.cardsFormArray.clear();
        this.selectedApprovers = [];
        this.selectedAccount = event.value;
        this.showCardForm = true;
        this.getAmaliRequestCount(this.selectedAccount.account_no);
    }

    getAmaliRequestCount(accountNo: any) {
        this.cardsSandbox.getAmaliRequestCount({ accountNumber: accountNo }).subscribe((res: any) => {
            this.cardsRequested = res.data.noOfCardIssued;
            this.charges = res.data?.chargeAmount || '';
            if (this.cardsRequested < 3) {
                this.islimitReached = false;
                this.showForm = true;
                this.addCard();
            } else {
                this.islimitReached = true;
                this.utilService.displayNotification(
                    'Maximum of 3 Aamaly debit cards have been requested to this account.',
                    'error'
                );
                this.showForm = false;
                this.cardsFormArray.clear();
            }
        });
    }

    isCheckBoxSelected(event: any) {
        this.ischeckBoxSelected = event.checked;
    }

    updateFields(event: any) {
        const cardForm = this.cardsFormArray.at(0) as FormGroup;
        const approver = event.value;
        let mobile = approver?.mobilePhone || '';
        let cardHolderName = approver?.firstNameEng + ' ' + approver?.lastNameEng || '';
        cardHolderName = cardHolderName.toUpperCase();
        cardForm.patchValue({
            cardHolderName: cardHolderName.substring(0, 25),
            mobile: mobile.substring(0, 11),
            isValidQid: true,
        });
    }

    preparePayload() {
        let tempCards: any = [];
        let currAcc = '';
        let savingAcc = '';
        if (this.accountCategoryCodes?.currentAcc.indexOf(this.selectedAccount.category.transactionRef) !== -1)
            currAcc = this.selectedAccount.account_no;
        else savingAcc = this.selectedAccount.account_no;
        const card = this.aamalieCardForm.value.cards[0];
        const cardForm = this.cardsFormArray.at(0) as FormGroup;
        const cardHolderName = cardForm.controls['cardHolderName'].getRawValue() || '';
        tempCards.push({
            currentAccountNo: currAcc,
            savingAccountNo: savingAcc,
            embName: cardHolderName,
            qid: card.qatarId,
            mobile: card.mobile,
            failureReason: 'NIL',
            cardNumber: '',
            approverUserId: this.isStpUser ? this.userContext.userId : card.approver.userId,
        });
        let payload = {
            externalCardRequestsMeta: {
                companyName: this.aamalieCardForm.value.companyNameOnCard,
                commRegNo: this.commRegNo,
                crExpiryDate: moment(this.aamalieCardForm.value.crExpiryDate).format('DD-MM-YYYY'),
                linkSavingAcc: savingAcc,
                linkCurrentAcc: currAcc,
                addrLine1: this.aamalieCardForm.value.buildingNo,
                addrLine2: this.aamalieCardForm.value.streetNo,
                addrLine3: this.aamalieCardForm.value.zoneNo,
                noOfCards: 1,
                poBox: this.aamalieCardForm.value.poBoxNo,
                rim: this.userContext?.organizationSelected.rimNumber,
                documentId: '',
                rejectReason: '',
                externalCardRequestsMaster: tempCards,
            },
            userAction: this.isStpUser ? 'CREATE_STP' : 'CREATE',
            serviceRequestId: '',
            comments: '',
            charges: this.charges,
            action: DECISION.VERIFY,
        };
        return payload;
    }

    sendRequest() {
        let payload = this.preparePayload();
        this.confirmSaveAmaliRequest(payload.action, payload);
    }

    public confirmSaveAmaliRequest(action: any, payload: any, isOTPReceived = false, otp = '') {
        payload.action = action;
        payload.validateOTPRequest = isOTPReceived ? { softTokenUser: false, otp: otp } : {};
        if (action === 'VERIFY') {
            this.cardsSandbox.saveAmaliCard(payload).subscribe((res: any) => {
                let isOTPReceived = res.data?.tokenSent || false;
                payload.action = DECISION.CONFIRM;
                this.openPopup(isOTPReceived, payload);
            });
        } else {
            let uploadFormData = new FormData();
            this.files.forEach((x: any) => {
                uploadFormData.append('files', x);
            });
            this.cardsSandbox.uploadAmaliDocs(uploadFormData).subscribe((fileUpload: any) => {
                if (fileUpload?.data?.documents?.length > 0) {
                    payload.externalCardRequestsMeta.documentId = fileUpload?.data?.documents[0].contractId;
                    this.cardsSandbox.saveAmaliCard(payload).subscribe((res: any) => {
                        if (res.data) {
                            this.isRequestSuccess = true;
                            this.requestSuccessData = {
                                statusMessage:
                                    res.data?.length > 0
                                        ? 'Your Request has been sent for approval to the respective approver'
                                        : 'Your request has been submitted to branch',
                                data: payload.externalCardRequestsMeta,
                            };
                        }
                    });
                } else this.utilService.displayNotification('Unable to upload files', 'error');
            });
        }
    }

    openPopup(isOTPReceived: boolean, payload: any) {
        let data = {
            ...payload.externalCardRequestsMeta,
            ...{ charges: payload.charges },
            ...{ action: payload.action },
        };
        const ref = this.dialog.openDrawer(
            'Aamaly Debit Card Request Summary',
            AamaliDebitCardRequestConfirmationComponent,
            data
        );
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmSaveAmaliRequest(result.decision, payload, isOTPReceived, result.data.otp);
            }
        });
    }

    goToHistory() {
        this.showAamaliCardHistory = true;
    }

    closeHistory() {
        this.showAamaliCardHistory = false;
    }
}
