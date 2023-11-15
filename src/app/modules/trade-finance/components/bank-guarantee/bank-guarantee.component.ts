import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import {
    AMEND_GUARANTEE_AMOUNT,
    BANK_FORMATS,
    BANK_MARGINS,
    PRODUCT_TYPES,
    SCREEN_MODE_BG,
} from '../../contants/meta-data';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { LcPreviewComponent } from '../lc-preview/lc-preview.component';

@Component({
    selector: 'app-bank-guarantee',
    templateUrl: './bank-guarantee.component.html',
    styleUrls: ['./bank-guarantee.component.scss'],
})
export class BankGuaranteeComponent implements OnInit, AfterViewChecked {
    bgForm!: UntypedFormGroup;
    amendmendForm!: UntypedFormGroup;
    ischeckBoxBGSelected: boolean = false;
    ischeckBoxAmendSelected: boolean = false;
    productsType = PRODUCT_TYPES;
    bankFormats: any = BANK_FORMATS;
    bankMargins: any = BANK_MARGINS;
    amendGuaranteeAmount: any = AMEND_GUARANTEE_AMOUNT;
    currenciesList: any = [];
    bgPageTitleHeading: any;
    downloadFileName = 'LG_TERMS';
    sampleurl = 'assets/content/LG_Terms.pdf';
    bgApplicationId: any = '';
    bgContractType: any = 'CA';
    bgExpiryminDate = new Date();
    bgTenor: any;
    selectedFiles: any = [];
    commentHistory: any = [];
    selectedBG: any;
    increaseGuaranteeAmount: boolean = false;
    amendNewExpiryMinDate = new Date();
    uploadedDocuments: any = [];
    beneficiaryMaxLength: number = 0;
    mode: SCREEN_MODE_BG = SCREEN_MODE_BG.CREATE_BG;
    SCREEN_MODE = SCREEN_MODE_BG;
    showCloseIcon: boolean = false;
    bgStatus: any = 'bgInitiation';
    showSaveDraftAlert: boolean = false;
    ischeckBoxBGAddSelected: boolean = false;
    bgCurrencyCode: any;

    constructor(
        private fb: UntypedFormBuilder,
        private sandBox: TradeFinanceSandbox,
        private dialogService: CibDialogService,
        private utilService: UtilService,
        private router: Router,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getCurrencyList();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    intialiseForm() {
        this.bgForm = this.fb.group({
            bgProductType: [null, [Validators.required]],
            bgCurrency: ['QAR', [Validators.required]],
            bgPrincipalAmount: [null, [Validators.required]],
            guaranteeInFavourOf: [null],
            bgGuaranteeIssuedIn: ['Bank standard format', [Validators.required]],
            bgGuaranteeIssuedAgainst: [null, [Validators.required]],
            bgExpiryDate: [null, [Validators.required]],
            bgDealDate: [null],
            principalAmountInWords: [null, [Validators.required, Validators.pattern(/^[ A-Za-z0-9./+--()?,':]*$/)]],
            bgComments: [null],
            bgGuaranteeInConnectionWith: [null, [Validators.required]],
            bgBeneficiaryName: [null, [Validators.required, Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)]],
            selected: [null, [Validators.required]],
        });

        this.amendmendForm = this.fb.group({
            typeOfPrincipalAmt: [null],
            bgNewAmount: [null],
            bgExpiryDate: [null],
            guaranteeDetails: [null, [Validators.required]],
            bgAdditionalText: [null],
        });

        this.sandBox.selectedBG.subscribe((res: any) => {
            if (Object.keys(res).length === 0) {
                this.bgActionType(this.bgStatus);
            } else {
                this.bgStatus = res.type;
                this.bgActionType(res.type, res.data);
            }
        });
    }

    bgActionType(action: any, bgDetails?: any) {
        switch (action) {
            case 'bgInitiation':
                this.mode = SCREEN_MODE_BG.CREATE_BG;
                this.bgPageTitleHeading = 'REQUEST A NEW GUARANTEE';
                break;
            case 'bgDrafts':
                this.bgPageTitleHeading = 'Editing ' + bgDetails.id + ' draft';
                this.showSaveDraftAlert = true;
                this.setBGDetails(bgDetails);
                break;
            case 'bgEdit':
                this.bgPageTitleHeading = 'Editing ' + bgDetails.id + ' details';
                this.setBGDetails(bgDetails);
                break;
            case 'bgAmend':
                this.mode = SCREEN_MODE_BG.AMEND_BG;
                this.increaseGuaranteeAmount = true;
                this.bgPageTitleHeading = 'Request to Amend Guarantee Number ' + bgDetails.bgRefNo;
                this.amendmendForm.patchValue({ typeOfPrincipalAmt: 'principalAmountIncrease' });
                this.setBGDetails(bgDetails);
                break;
            case 'bgCopy':
                this.bgPageTitleHeading = 'BG INITIATION';
                this.setBGDetailsForCopy(bgDetails);
                break;
            case 'bgAmendEdit':
                this.mode = SCREEN_MODE_BG.AMEND_BG;
                this.increaseGuaranteeAmount = true;
                this.bgPageTitleHeading = 'Request to Amend Guarantee Number ' + bgDetails.id;
                this.amendmendForm.patchValue({ typeOfPrincipalAmt: 'principalAmountIncrease' });
                this.setBGDetails(bgDetails);
                this.setAmendedBGDetails(bgDetails);
                break;
            default: {
                this.bgPageTitleHeading = 'REQUEST A NEW GUARANTEE';
                this.mode = SCREEN_MODE_BG.CREATE_BG;
                break;
            }
        }
    }

    getCurrencyList() {
        this.sandBox.getCurrencyList().subscribe((res: any) => {
            if (res) {
                let list: any = [];
                Object.keys(res).forEach((property: any) => {
                    let temp: any = {};
                    temp.id = res[property].code;
                    temp.name = res[property].name;
                    list.push(temp);
                });
                this.currenciesList = list;
                this.intialiseForm();
            }
        });
    }

    onFileSelected(files: any, fileUpload: any) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                this.selectedFiles.push(files[i]);
            }
        }
        fileUpload.file = null;
    }

    deleteSelectedFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    deleteuploadedDocuments(file: any, index: any) {
        let data = {
            header: '<div>Delete Document</div>',
            body: '<div>Would you like to delete this Document</div>',
        };
        let dialogRef = this.dialogService.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                let payload = { id: file.id };
                this.sandBox.deleteIndividualDocument(payload).subscribe((res: any) => {
                    this.utilService.displayNotification('Deleted successfully', 'success');
                    this.uploadedDocuments.splice(index, 1);
                });
            }
        });
    }

    isCheckBoxSelected(event: any) {
        this.ischeckBoxBGSelected = event.checked;
    }

    // added 1.25% FX fee for LC and LG
    checkboxValue(eventVal: any) {
        this.ischeckBoxBGAddSelected = eventVal || false;
    }
    // added 1.25% FX fee for LC and LG
    getCurrency(eventValue: any) {
        this.bgCurrencyCode = '';
        this.ischeckBoxBGAddSelected = true;
        if (eventValue === 'USD') {
            this.bgCurrencyCode = eventValue;
            this.ischeckBoxBGAddSelected = false;
        }
    }

    isCheckBoxAmendSelected(event: any) {
        this.ischeckBoxAmendSelected = event.checked;
        if (this.bgCurrencyCode === 'USD') this.ischeckBoxBGAddSelected = false;
    }

    selectCommencingData(ev: any) {
        this.bgExpiryminDate = this.bgForm.value.bgDealDate;
        if (this.bgForm.value.bgDealDate && this.bgForm.value.bgExpiryDate) {
            this.calculateTenor();
        }
    }

    togglePrincipalAmtChange(event: any) {
        if (this.amendmendForm.value.typeOfPrincipalAmt === 'principalAmountIncrease') {
            this.increaseGuaranteeAmount = true;
        } else {
            this.increaseGuaranteeAmount = false;
        }
    }

    calculateTenor() {
        let dealDate = new Date(this.bgForm.value.bgDealDate);
        let expiryDate = new Date(this.bgForm.value.bgExpiryDate);
        let timeDiff = Math.abs(expiryDate.getTime() - dealDate.getTime());
        this.bgTenor = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    bankGuarantee(operation: any) {
        let selectedProduct: any = this.productsType.filter(
            (prod: any) => prod.code === this.bgForm.value.bgProductType
        );
        let payload: any = {
            bgBeneficiaryName: this.bgForm.value.bgBeneficiaryName,
            bgContractType: this.bgContractType,
            bgCurrency: this.bgForm.value.bgCurrency,
            bgDealDate: this.bgForm.value.bgDealDate
                ? moment(this.bgForm.value.bgDealDate).format('YYYY-MM-DD')
                : moment(new Date()).format('YYYY-MM-DD'),
            bgExpiryDate: this.bgForm.value.bgExpiryDate
                ? moment(this.bgForm.value.bgExpiryDate).format('YYYY-MM-DD')
                : '',
            bgPrincipalAmount: Number(this.bgForm.value.bgPrincipalAmount),
            bgProductId: selectedProduct[0].id,
            bgProductType: selectedProduct[0].code,
            bgProductTypeText: selectedProduct[0].name,
            bgTenor: this.bgTenor,
            bgApplicationId: this.bgApplicationId,
            guaranteeInFavourOf: this.bgForm.value.guaranteeInFavourOf,
            bgGuaranteeIssuedIn: this.bgForm.value.bgGuaranteeIssuedIn,
            bgGuaranteeIssuedAgainst: this.bgForm.value.bgGuaranteeIssuedAgainst,
            bgGuaranteeInConnectionWith: this.bgForm.value.bgGuaranteeInConnectionWith,
            principalAmountInWords: this.bgForm.value.principalAmountInWords,
            action: 'CONFIRM',
            validateOTPRequest: {
                softTokenUser: false,
                otp: '',
            },
        };
        Object.keys(payload).forEach((v) => {
            if (!payload[v]) {
                delete payload[v];
            }
        });

        if (operation === 'SAVE') {
            payload['bgAction'] = 'SAVE';
            this.sandBox.saveORCreateBankGuarantee(payload).subscribe((res: any) => {
                if (res.data.id) {
                    if (this.selectedFiles.length > 0) {
                        this.uploadFiles(res.data.id).subscribe((res: any) => {
                            this.utilService.displayNotification('Application saved successfully', 'success');
                            this.router.navigate([APP_ROUTES.BG_DRAFT]);
                        });
                    } else {
                        this.utilService.displayNotification('Application saved successfully', 'success');
                        this.router.navigate([APP_ROUTES.BG_DRAFT]);
                    }
                    this.showSaveDraftAlert = false;
                    this.resetForm();
                }
            });
        } else if (operation === 'SUBMIT') {
            payload['thresholdExceeded'] = this.bgCurrencyCode === 'USD';
            payload['bgAction'] = 'SAVE';
            this.sandBox.saveORCreateBankGuarantee(payload).subscribe((res: any) => {
                if (res.data.id) {
                    if (this.selectedFiles.length > 0) {
                        this.uploadFiles(res.data.id).subscribe((res: any) => {});
                    }
                    this.submitBankGuarantee(payload, res.data.id);
                }
            });
        } else if (operation === 'PREVIEW') {
            payload['bgAction'] = 'PREVIEW';
            this.sandBox.previewBankGuarantee(payload).subscribe((res: any) => {
                if (res.data.length > 0) {
                    this.dialogService.openOverlayPanel('Preview', LcPreviewComponent, { content: res.data });
                }
            });
        }
    }

    submitBankGuarantee(payload: any, bgApplicationId: any) {
        payload['bgApplicationId'] = bgApplicationId;
        payload['bgAction'] = 'SUBMIT';
        payload['bgDealDate'] = this.bgForm.value.bgDealDate
            ? moment(this.bgForm.value.bgDealDate).format('YYYY-MM-DD')
            : null;
        this.showSaveDraftAlert = false;
        payload['thresholdExceeded'] = this.bgCurrencyCode === 'USD';
        let commentsObject: any = {};
        if (this.bgForm.value.bgComments) {
            commentsObject.comments = this.bgForm.value.bgComments;
            this.commentHistory.push(commentsObject);
        }
        payload['bankGuaranteeNotes'] = this.commentHistory;
        this.sandBox.submitBankGuarantee(payload).subscribe((res: any) => {
            this.utilService.displayNotification('Request has been submitted successfully for processing', 'success');
            this.resetForm();
            this.router.navigate([APP_ROUTES.BG_STATUS]);
        });
    }

    uploadFiles(bgApplicationId: any) {
        let payload = { bgApplicationId: bgApplicationId };
        let uploadFormData = new FormData();
        this.selectedFiles.forEach((file: any) => {
            uploadFormData.append('files', file);
        });
        return this.sandBox.uploadBankGuaranteeFiles(uploadFormData, payload);
    }

    getBeneficiaryLength(ev: any) {
        this.beneficiaryMaxLength = ev.target.value.length;
    }

    setBGDetailsForCopy(bgDetails: any) {
        this.showCloseIcon = true;
        this.uploadedDocuments = bgDetails.documents ? bgDetails.documents : [];
        this.bgTenor = bgDetails.tenor;
        this.bgForm.patchValue({
            bgProductType: bgDetails.productType,
            bgCurrency: bgDetails.currency,
            bgPrincipalAmount: bgDetails.principalAmount,
            guaranteeInFavourOf: bgDetails.guaranteeInFavourOf,
            bgGuaranteeIssuedIn: bgDetails.bgGuaranteeIssuedIn,
            bgGuaranteeIssuedAgainst: bgDetails.bgGuaranteeIssuedAgainst,
            bgExpiryDate: bgDetails.expiryDate,
            bgDealDate: bgDetails.dealDate,
            principalAmountInWords: bgDetails.principalAmountInWords,
            bgGuaranteeInConnectionWith: bgDetails.bgGuaranteeInConnectionWith,
            bgBeneficiaryName: bgDetails.beneficiaryName,
        });
    }

    setBGDetails(bgDetails: any) {
        bgDetails.documents = bgDetails.documents !== null ? bgDetails.documents : [];
        this.selectedBG = bgDetails ? bgDetails : {};
        this.bgCurrencyCode = this.selectedBG?.currency;
        this.ischeckBoxBGAddSelected = false;
        this.bgApplicationId = bgDetails.id;
        this.bgTenor = bgDetails.tenor;
        this.uploadedDocuments = bgDetails?.documents ? bgDetails?.documents : [];
        this.bgForm.patchValue({
            bgProductType: bgDetails.productType,
            bgCurrency: bgDetails.currency,
            bgPrincipalAmount: bgDetails.principalAmount,
            guaranteeInFavourOf: bgDetails.guaranteeInFavourOf,
            bgGuaranteeIssuedIn: bgDetails.bgGuaranteeIssuedIn,
            bgGuaranteeIssuedAgainst: bgDetails.bgGuaranteeIssuedAgainst,
            bgExpiryDate: bgDetails.expiryDate,
            bgDealDate: bgDetails.dealDate,
            principalAmountInWords: bgDetails.principalAmountInWords,
            bgGuaranteeInConnectionWith: bgDetails.bgGuaranteeInConnectionWith,
            bgBeneficiaryName: bgDetails.beneficiaryName,
        });
    }

    setAmendedBGDetails(bgDetails: any) {
        this.amendmendForm.patchValue({
            typeOfPrincipalAmt: 'principalAmountIncrease',
            bgNewAmount: bgDetails.principalAmount,
            bgExpiryDate: bgDetails.expiryDate,
            guaranteeDetails: bgDetails.guaranteeDetails,
        });
        this.uploadedDocuments = bgDetails.documents ? bgDetails.documents : [];
    }

    amendBankGuarantee(action: any) {
        let commentsObject: any = {};
        let tempObj = this.selectedBG;
        let bgAppId;
        let parBG;
        let newAmount;
        let newBgAmount;
        let newExpiry;
        if (this.amendmendForm.value.bgAdditionalText) {
            commentsObject.comments = this.amendmendForm.value.bgAdditionalText;
            this.commentHistory.push(commentsObject);
        }

        if (tempObj.isAmmended === 'Y') {
            bgAppId = tempObj.id;
            parBG = tempObj.parentBg ? tempObj.parentBg : tempObj.bankRef;
        } else {
            bgAppId = '';
            parBG = tempObj.id ? tempObj.id : tempObj.bankRef;
        }

        if (this.amendmendForm.value.bgNewAmount) {
            if (this.amendmendForm.value.typeOfPrincipalAmt === 'principalAmountIncrease') {
                newAmount = this.amendmendForm.value.bgNewAmount;
                newBgAmount = this.amendmendForm.value.bgNewAmount;
            } else {
                newAmount = -this.amendmendForm.value.bgNewAmount;
                newBgAmount = -this.amendmendForm.value.bgNewAmount;
            }
        } else {
            newAmount = tempObj.principalAmount;
        }

        if (this.amendmendForm.value.bgExpiryDate) {
            newExpiry = this.amendmendForm.value.bgExpiryDate;
        } else {
            newExpiry = tempObj.expiryDate;
        }
        this.bgCurrencyCode = tempObj.currency;
        let payload: any = {
            bgBeneficiaryName: tempObj.beneficiaryName,
            bgContractType: tempObj.contractType,
            bgCurrency: tempObj.currency,
            bgDealDate: moment(tempObj.dealDate).format('YYYY-MM-DD'),
            bgExpiryDate: moment(newExpiry).format('YYYY-MM-DD'),
            bgPrincipalAmount: Number(newAmount),
            bgProductId: tempObj.productId,
            bgProductType: tempObj.productType,
            bgProductTypeText: tempObj.bgProductTypeText,
            bgTenor: tempObj.tenor,
            parentBg: parBG,
            bgApplicationId: bgAppId,
            bankRef: tempObj.bankRef,
            bgRefNo: tempObj.bgRefNo,
            bgGuaranteeIssuedIn: tempObj.bgGuaranteeIssuedIn,
            bgGuaranteeIssuedAgainst: tempObj.bgGuaranteeIssuedAgainst,
            bgGuaranteeInConnectionWith: tempObj.bgGuaranteeInConnectionWith,
            principalAmountInWords: tempObj.principalAmountInWords,
            guaranteeDetails: this.amendmendForm.value.guaranteeDetails,
            guaranteeInFavourOf: tempObj.bgGuaranteeInFavourOf,
            bgAction: 'SUBMIT',
            action: 'CONFIRM',
            thresholdExceeded: this.bgCurrencyCode === 'USD',
            validateOTPRequest: {
                softTokenUser: false,
                otp: '',
            },
            bankGuaranteeNotes: this.commentHistory,
            bgAmount: newBgAmount ? Number(newBgAmount) : null,
            expiryDate: this.amendmendForm.value.bgExpiryDate
                ? moment(this.amendmendForm.value.bgExpiryDate).format('YYYY-MM-DD')
                : '',
        };

        Object.keys(payload).forEach((v) => {
            if (!payload[v]) {
                delete payload[v];
            }
        });
        if (action === 'SUBMIT') {
            this.sandBox.amendBankGuarantee(payload).subscribe((res: any) => {
                let refNumber = res.data.referenceNumber ? res.data.referenceNumber : res.data;
                if (refNumber) {
                    if (this.selectedFiles.length > 0) {
                        this.uploadFiles(refNumber).subscribe((res: any) => {
                            this.utilService.displayNotification(
                                'Request has been submitted successfully for processing',
                                'success'
                            );
                            this.resetAmendForm();
                            this.router.navigate([APP_ROUTES.BG_STATUS]);
                        });
                    } else {
                        this.utilService.displayNotification(
                            'Request has been submitted successfully for processing',
                            'success'
                        );
                        this.resetAmendForm();
                        this.router.navigate([APP_ROUTES.BG_STATUS]);
                    }
                }
            });
        } else if (action === 'PREVIEW') {
            this.sandBox.bankGuaranteeAmendPreview(payload).subscribe((res: any) => {
                if (res.data.length > 0) {
                    this.dialogService.openOverlayPanel('Preview', LcPreviewComponent, { content: res.data });
                }
            });
        }
    }

    resetForm() {
        if (this.showSaveDraftAlert) {
            let data = {
                header: '<div>Please save your work.</div>',
                body: '<div>All your changes will be lost if not saved?</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.bankGuarantee('SAVE');
                }
            });
        } else {
            this.bgForm.reset();
            this.amendmendForm.reset();
            this.bgActionType('bgInitiation');
            this.selectedFiles = [];
            this.uploadedDocuments = [];
            this.bgApplicationId = '';
            this.sandBox._selectedBG.next({
                type: 'bgInitiation',
                data: [],
            });
        }
    }

    resetAmendForm() {
        this.bgForm.reset();
        this.amendmendForm.reset();
        this.bgActionType('bgInitiation');
        this.selectedFiles = [];
        this.uploadedDocuments = [];
        this.bgApplicationId = '';
        this.sandBox._selectedBG.next({
            type: 'bgInitiation',
            data: [],
        });
    }

    ngOnDestroy() {
        this.sandBox._selectedBG.next({
            type: 'bgInitiation',
            data: [],
        });
    }
}
