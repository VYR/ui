import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { UtilService } from 'src/app/utility/utility.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LcPreviewComponent } from '../lc-preview/lc-preview.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
@Component({
    selector: 'app-request-new-lc',
    templateUrl: './request-new-lc.component.html',
    styleUrls: ['./request-new-lc.component.scss'],
})
export class RequestNewLcComponent implements OnInit, OnDestroy {
    lcDocuments: Array<any> = [
        'Advance Payment Undertaking Form',
        "Beneficiary's shipping undertaking",
        'First Time dealing with beneficiary',
        'Food Guarantee',
        'Local Lc undertaking',
        'Terms and conditions',
        "Wa'd-e-Sharaa",
        'Wakalah Agreement',
    ];
    settings: any = { lcRequestedDocList: [] };
    ischeckBoxLCSelected: boolean = false;
    ischeckBoxAmendSelected: boolean = false;
    countries: any = [];
    currenciesList: any = [];
    uploadedDocuments: any = [];
    uploadedDocumentsAmend: any = [];
    selectedFiles: any = [];
    selectedFilesAmend: any = [];
    PathReportString: any = '';
    minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    form: FormGroup = new FormGroup({});
    amendForm: FormGroup = new FormGroup({});
    docsRequested: Array<any> = [];
    public selectedDocs: Array<any> = [];
    importLCRequestObject: any = {
        action: 'CONFIRM',
        validateOTPRequest: {
            otp: '',
            softTokenUser: false,
        },
    };
    files: any = [];
    amendFlag: boolean = false;
    action = 'lcInitiation';
    disabled: boolean = false;
    commentHistory: Array<any> = [];
    expandAmendFlag: boolean = false;
    pageTitle: any = 'REQUEST A NEW LC';
    toggleBankDetails = false;
    toggleBasicDetails = true;
    toggleCreditDetails = false;
    toggleShipmentDetails = false;
    toggleDocumentDetails = false;
    toggleSplInstructionDetails = false;
    validSwift: boolean = false;
    lcExpiryDate = null;
    lcAmendExpiryDate = null;
    lcLastShipmentDate = null;
    commentsHistory: Array<any> = [];
    commentsHistoryAmend: Array<any> = [];
    tfRef: any;
    selectedLc: any;
    parentLCForAmend: any;
    // added 1.25% FX fee for LC and LG
    ischeckBoxAddSelected: boolean = false;
    lcCurrency: any;
    @ViewChild('menuTrigger') trigger: any;
    constructor(
        private sandbox: TradeFinanceSandbox,
        private fb: UntypedFormBuilder,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService,
        private sanitizer: DomSanitizer
    ) {}
    ngOnDestroy() {
        this.sandbox.setLcRequest(null);
    }
    ngOnInit(): void {
        this.form.reset();
        this.amendForm.reset();
        this.getSettings();
        this.getCurrencyList();
        this.getCountries();
        this.amendForm = this.fb.group({
            lcAmendAmount: [this.importLCRequestObject?.lcbasicDetails?.lcAmount || null],
            lcAmendExpiryDate: [this.importLCRequestObject?.lcbasicDetails?.lcExpiryDate || null],
            lcAmendShipmentDate: [this.importLCRequestObject?.lcbasicDetails?.lcExpiryDate || null],
            narrative: [
                this.importLCRequestObject?.lcbasicDetails?.lcToBeAdvisedBy || null,
                [Validators.required, Validators.maxLength(1500)],
            ],
            lcComments: [
                this.importLCRequestObject?.lcbasicDetails?.selectedLcType || null,
                [Validators.maxLength(200)],
            ],
        });

        this.form = this.fb.group({
            lcbasicDetails: this.fb.group({
                lcOption: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcProductType: [{ value: null, disabled: this.disabled }],
                lcToBeAdvisedBy: [{ value: null, disabled: this.disabled }, [Validators.required]],
                selectedLcType: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcNfCurrenctLCOption: [{ value: null, disabled: this.disabled }],
                lcCreditAvailableBy: [{ value: null, disabled: this.disabled }],
                lcAmount: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcCurrency: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcAmountInWords: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcExpiryCountry: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcExpiryDate: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcConfirmation: [{ value: null, disabled: this.disabled }],
                lcChargesType: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcToleranceType: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcToleranceValue: [{ value: null, disabled: this.disabled }],
                lcAgainstMargin: [{ value: null, disabled: this.disabled }],
                lcTenor: [
                    { value: null, disabled: this.disabled },
                    [Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcMixedPaymentdetails: [
                    { value: null, disabled: this.disabled },
                    [Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
            }),
            lcAdvicingBankDetails: this.fb.group({
                lcSwiftCode: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcBankAddress: [
                    { value: null, disabled: this.disabled },
                    [Validators.required, Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcAdvisingBank: [
                    { value: null, disabled: this.disabled },
                    [Validators.required, Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcBeneficiaryName: [
                    { value: null, disabled: this.disabled },
                    [
                        Validators.required,
                        Validators.maxLength(140),
                        Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/),
                    ],
                ],
                lcCreditAvailableWith: [{ value: null, disabled: this.disabled }, [Validators.required]],
            }),
            lcShipmentDetails: this.fb.group({
                lcLastShipmentDate: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcGoodsServiceDesc: [
                    { value: null, disabled: this.disabled },
                    [Validators.required, Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcPeriodForPresentation: [
                    { value: null, disabled: this.disabled },
                    [Validators.required, Validators.maxLength(140)],
                ],
                lcPartialShipmentFlag: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcTransShipmentFlag: [{ value: null, disabled: this.disabled }],
                lcShippingMarksText: [
                    { value: null, disabled: this.disabled },
                    [Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcTransportOptions: [{ value: null, disabled: this.disabled }],
                selectedShippingMark: [{ value: null, disabled: this.disabled }, [Validators.required]],
                lcShipmentAirportOfDep: [{ value: null, disabled: this.disabled }],
                lcShipmentAirportDesc: [{ value: null, disabled: this.disabled }],
                lcInsuranceOwner: [{ value: null, disabled: this.disabled }],
                lcLegalization: [{ value: null, disabled: this.disabled }],
                lcGoodsOrigin: [
                    { value: null, disabled: this.disabled },
                    [Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcInsuranceApplicantDetails: [
                    { value: null, disabled: this.disabled },
                    [Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
                ],
                lcShipmentPortLanding: [{ value: null, disabled: this.disabled }],
                lcShipmentPortDischarge: [{ value: null, disabled: this.disabled }],
                lcShipmentPlaceOfRecipt: [{ value: null, disabled: this.disabled }],
                lcShipmentPlaceOfDelivery: [{ value: null, disabled: this.disabled }],
            }),
            lcDocumentDetails: this.fb.group({
                lcDocsRequested: [
                    { value: null, disabled: this.disabled },
                    [
                        Validators.required,
                        Validators.maxLength(3500),
                        Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/),
                    ],
                ],
            }),
            lcAdditionalInstructions: [
                { value: null, disabled: this.disabled },
                [Validators.required, Validators.maxLength(3500), Validators.pattern(/^[ A-Za-z0-9\n./+--()?,':]*$/)],
            ],
            lcComments: [{ value: null, disabled: this.disabled }],
        });
        this.sandbox.lcRequest.subscribe((res: any) => {
            if (res) {
                if (res.data) {
                    this.action = res.type;
                    this.importLCRequestObject.lcbasicDetails = res.data.lcbasicDetails;
                    this.importLCRequestObject.lcAdvicingBankDetails = res.data.lcAdvicingBankDetails;
                    this.importLCRequestObject.lcShipmentDetails = res.data.lcShipmentDetails;
                    this.importLCRequestObject.lcDocumentDetails = res.data.lcDocumentDetails;
                    this.importLCRequestObject.lcInstructions = res.data.lcInstructions;
                    this.importLCRequestObject.lcAdditionalInstructions = res.data.lcAdditionalInstructions;
                    this.switchAction(this.action, res.data);
                }
            } else {
                this.switchAction(this.action, null);
            }
        });
    }

    get lcbasicDetailsControls() {
        return this.form.get('lcbasicDetails') as FormGroup;
    }
    get lcAdvicingBankDetailsControls() {
        return this.form.get('lcAdvicingBankDetails') as FormGroup;
    }
    get lcShipmentDetailsControls() {
        return this.form.get('lcShipmentDetails') as FormGroup;
    }
    get lcDocumentDetailsControls() {
        return this.form.get('lcDocumentDetails') as FormGroup;
    }

    getLcExpiryDate(ev: any) {
        this.lcExpiryDate = ev;
        this.lcShipmentDetailsControls.controls['lcLastShipmentDate'].reset();
    }
    getLcAmendExpiryDate(ev: any) {
        this.lcAmendExpiryDate = ev;
    }
    getShipmentDate(ev: any) {
        this.lcLastShipmentDate = ev;
    }

    closeMatmenu() {
        this.trigger.closeMenu();
    }

    onFileSelected(files: any, fileUpload: any) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                this.selectedFiles.push(files[i]);
            }
        }
        fileUpload.file = null;
    }
    onFileSelectedAmend(files: any, fileUpload: any) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                this.selectedFilesAmend.push(files[i]);
            }
        }
        fileUpload.file = null;
    }
    deleteSelectedFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }
    deleteSelectedFileAmend(index: number) {
        this.selectedFilesAmend.splice(index, 1);
    }

    deleteuploadedDocuments(file: any, index: any) {
        let data = {
            header: '<div>Delete Document</div>',
            body: '<div>Would you like to delete this Document</div>',
        };
        let dialogRef = this.dialog.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                let payload = { id: file.id };
                this.sandbox.deleteIndividualDocument(payload).subscribe((res: any) => {
                    this.utilService.displayNotification('Deleted successfully', 'success');
                    this.uploadedDocuments.splice(index, 1);
                });
            }
        });
    }
    deleteuploadedDocumentsAmend(file: any, index: any) {
        let data = {
            header: '<div>Delete Document</div>',
            body: '<div>Would you like to delete this Document</div>',
        };
        let dialogRef = this.dialog.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                let payload = { id: file.id };
                this.sandbox.deleteIndividualDocument(payload).subscribe((res: any) => {
                    this.utilService.displayNotification('Deleted successfully', 'success');
                    this.uploadedDocumentsAmend.splice(index, 1);
                });
            }
        });
    }

    isCheckBoxSelected(event: any) {
        this.ischeckBoxLCSelected = event.checked;
    }

    // added 1.25% FX fee for LC and LG
    isCheckBoxAddSelected(event: any) {
        this.ischeckBoxAddSelected = event?.checked || false;
    }
    // added 1.25% FX fee for LC and LG
    getCurrency(eventValue: any) {
        this.lcCurrency = '';
        this.ischeckBoxAddSelected = true;
        if (eventValue === 'USD') {
            this.lcCurrency = eventValue;
            this.ischeckBoxAddSelected = false;
        }
    }

    isCheckBoxAmendSelected(event: any) {
        this.ischeckBoxAmendSelected = event.checked;
    }

    selectAllDocs(event: any) {
        this.settings.lcRequestedDocList = this.settings.lcRequestedDocList.map((obj: any) => {
            return { ...obj, selected: event.checked };
        });
        this.selectedDocs = this.settings.lcRequestedDocList;
        this.updateRequiredDocs();
    }

    changeSelection(event: any, type: any) {
        type.selected = event.checked;
        let users = this.settings.lcRequestedDocList.filter((obj: any) => obj.selected == true);
        this.selectedDocs = users;
        this.updateRequiredDocs();
    }
    updateRequiredDocs() {
        this.settings.lcRequestedDocList.forEach((obj: any, index: any) => {
            if (obj.selected && !this.docsRequested.includes(obj.name)) this.docsRequested.push(obj.name);
            if (!obj.selected && this.docsRequested.includes(obj.name))
                this.docsRequested.splice(this.docsRequested.indexOf(obj.name), 1);
        });
    }
    getCountries() {
        this.sandbox.getCountries().subscribe((res: any) => {
            this.countries = res.countries.map((v: any) => ({ name: v.name.toUpperCase() }));
        });
    }
    getCurrencyList() {
        this.sandbox.getCurrencyList().subscribe((res: any) => {
            if (res) {
                this.currenciesList = Object.keys(res).map((index: any) => {
                    return res[index];
                });
            }
        });
    }
    getSettings() {
        this.sandbox.getImportLCSettings().subscribe((res: any) => {
            this.settings = res;
            let docs = this.settings?.lcRequestedDocList || [];
            if (docs.length > 0) {
                this.settings.lcRequestedDocList = this.settings.lcRequestedDocList.map((obj: any) => {
                    return { ...obj, selected: this.docsRequested.includes(obj.name), fileName: null };
                });
            }
        });
    }

    switchAction(action: any, lcDetails: any) {
        if (!lcDetails) return;
        this.action = action;
        switch (action) {
            case 'lcInitiation':
                this.disabled = false;
                this.toggleBasicDetails = true;
                break;
            case 'lcDrafts':
                this.getLCDetails(lcDetails);
                this.disabled = false;
                this.toggleAllPanes();
                this.pageTitle = 'Editing Draft ' + lcDetails.applnId;
                break;
            case 'lcEdit':
                this.getLCDetails(lcDetails);
                this.disabled = false;
                this.toggleAllPanes();
                this.pageTitle = 'Editing ' + lcDetails.applnId + ' Details';
                break;
            case 'lcAmend':
                this.getLCDetails(lcDetails);
                this.tfRef = lcDetails.tfRef;
                this.disabled = true;
                this.amendFlag = true;
                this.expandAmendFlag = true;
                this.toggleBasicDetails = false;
                this.pageTitle = 'Request to Amend Letter Of Credit Number ' + lcDetails.lcRefNo;
                break;
            case 'lcCopy':
                this.getLCDetails(lcDetails);
                this.emptyReferencesForCopy();
                this.disabled = false;
                this.toggleAllPanes();
                break;
            case 'lcAmendEdit':
                this.getLCDetails(lcDetails);
                this.tfRef = lcDetails.tfRef;
                this.populateAmendedLCDetails(lcDetails); // for binding amended values and docs
                this.disabled = true;
                this.amendFlag = true;
                this.expandAmendFlag = true;
                this.toggleBasicDetails = false;
                this.pageTitle = 'Request to Amend Letter Of Credit Number ' + lcDetails.lcRefNo;
                break;
        }
    }
    getLCDetails(lcDetails: any) {
        if (!lcDetails) return;
        this.selectedLc = lcDetails;
        this.lcCurrency = this.selectedLc?.currency;
        this.importLCRequestObject['created'] = lcDetails.created;
        this.importLCRequestObject['applnId'] = lcDetails.applnId;
        this.importLCRequestObject['parentLC'] = lcDetails.parentLC;
        this.importLCRequestObject['txnRefNo'] = lcDetails.txnRefNo;
        //Adding lcRefNo for Amend LC as this is needed at Dashboard. part of CIBUAT-521
        this.importLCRequestObject['lcRefNo'] = lcDetails.lcRefNo;
        this.importLCRequestObject['isAmendRequest'] = lcDetails.isAmendRequest;
        this.form.patchValue({
            lcbasicDetails: lcDetails.lcbasicDetails,
            lcAdvicingBankDetails: lcDetails.lcAdvicingBankDetails,
            lcShipmentDetails: lcDetails.lcShipmentDetails,
            lcDocumentDetails: lcDetails.lcDocumentDetails,
            lcAdditionalInstructions: lcDetails.lcAdditionalInstructions,
        });
        let docsString: Array<any> = lcDetails.lcDocumentDetails.lcDocsRequired
            ? lcDetails.lcDocumentDetails.lcDocsRequired.split(',')
            : [];
        if (docsString.length > 0) this.docsRequested = docsString;
        this.commentsHistory = this.action === 'lcCopy' ? [] : lcDetails.lcInstructions;
        this.commentsHistoryAmend = lcDetails.lcInstructions;
        let files = lcDetails?.documents || [];
        this.uploadedDocuments = files.filter((i: any) => {
            return i.user.userType === 0; // filter only docs uploaded by maker
        });
        this.uploadedDocumentsAmend = files.filter((i: any) => {
            return i.user.userType === 0; // filter only docs uploaded by maker
        });
    }

    /**
     * toggleAllPanes(), to toggle all panes on lc edit
     */
    toggleAllPanes() {
        this.toggleBankDetails = true;
        this.toggleBasicDetails = true;
        this.toggleCreditDetails = true;
        this.toggleShipmentDetails = true;
        this.toggleDocumentDetails = true;
        this.toggleSplInstructionDetails = true;
    }
    emptyReferencesForCopy() {
        // all primary reference are made empty, to create a new LC.
        this.importLCRequestObject.applnId = '';
        this.importLCRequestObject.parentLC = '';
        this.importLCRequestObject.txnRefNo = '';
        this.importLCRequestObject.isAmendRequest = '';
        this.uploadedDocuments = [];
        this.commentHistory = [];
    }
    populateAmendedLCDetails(lcDetails: any) {
        this.amendForm.patchValue({
            lcAmendAmount: lcDetails.lcbasicDetails.lcAmount,
            lcAmendExpiryDate: lcDetails.lcbasicDetails.lcExpiryDate,
            lcAmendShipmentDate: lcDetails.lcShipmentDetails.lcLastShipmentDate,
            narrative: lcDetails.narrative,
        });
        this.uploadedDocumentsAmend = lcDetails.documents.filter((i: any) => {
            return i.user.userType === 0; // filter only docs uploaded by maker
        });
    }
    onLcOptionChange(event: any) {
        if (event.value === 'F') {
            this.lcbasicDetailsControls.get('lcProductType')?.setValidators(Validators.required);
            this.lcbasicDetailsControls.get('lcNfCurrenctLCOption')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcNfCurrenctLCOption')?.setValue(null);
        } else {
            this.lcbasicDetailsControls.get('lcProductType')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcProductType')?.setValue(null);
            this.lcbasicDetailsControls.get('lcNfCurrenctLCOption')?.setValidators(Validators.required);
        }
        this.lcbasicDetailsControls.get('lcProductType')?.updateValueAndValidity();
        this.lcbasicDetailsControls.get('lcNfCurrenctLCOption')?.updateValueAndValidity();
    }
    lcNfCurrenctLCOptionChange(event: any) {
        if (event.value === 'Against Margin') {
            this.lcbasicDetailsControls.get('lcAgainstMargin')?.setValidators(Validators.required);
        } else {
            this.lcbasicDetailsControls.get('lcAgainstMargin')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcAgainstMargin')?.setValue(null);
        }
        this.lcbasicDetailsControls.get('lcAgainstMargin')?.updateValueAndValidity();
    }
    lcToleranceTypeChange(event: any) {
        if (event.value === 'About') {
            this.lcbasicDetailsControls.get('lcToleranceValue')?.setValidators(Validators.required);
        } else {
            this.lcbasicDetailsControls.get('lcToleranceValue')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcToleranceValue')?.setValue(null);
        }
        this.lcbasicDetailsControls.get('lcToleranceValue')?.updateValueAndValidity();
    }
    selectedLcTypeChange(event: any) {
        this.lcbasicDetailsControls.get('lcCreditAvailableBy')?.setValidators(Validators.required);
        if (event.value === 'DEFPAY') {
            this.lcbasicDetailsControls.get('lcTenor')?.setValidators(Validators.required);
        } else {
            this.lcbasicDetailsControls.get('lcTenor')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcTenor')?.setValue(null);
        }
        this.lcbasicDetailsControls.get('lcTenor')?.updateValueAndValidity();
    }
    lcCreditAvailableByChange(event: any) {
        if (event.value === 'By Mixed Payment') {
            this.lcbasicDetailsControls.get('lcMixedPaymentdetails')?.setValidators(Validators.required);
        } else {
            this.lcbasicDetailsControls.get('lcMixedPaymentdetails')?.setValidators(null);
            this.lcbasicDetailsControls.get('lcMixedPaymentdetails')?.setValue(null);
        }
        this.lcbasicDetailsControls.get('lcMixedPaymentdetails')?.updateValueAndValidity();
    }
    /**
     * lcAdiviceChange(), to be executed on local/swift lc radio trigger.
     */
    lcAdiviceChange(event: any) {
        const advicedBy = event.value;
        if (advicedBy) {
            if (advicedBy != 'Swift') {
                this.lcShipmentDetailsControls.get('lcTransportOptions')?.disable();
                this.lcAdvicingBankDetailsControls.controls['lcSwiftCode'].setValue('QISBQAQA');
                this.validateSwift();
                this.lcAdvicingBankDetailsControls.controls['lcCreditAvailableWith'].setValue('Qatar Islamic Bank');
                this.lcShipmentDetailsControls.controls['lcTransportOptions'].setValue('TRUCK');

                this.lcShipmentDetailsControls.get('lcInsuranceOwner')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcLegalization')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcShippingMarksText')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcTranshipmentType')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcTransShipmentFlag')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcInsuranceOwner')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcLegalization')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcShippingMarksText')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcTranshipmentType')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcTransShipmentFlag')?.setValue(null);
                this.lcShipmentDetailsControls.get('selectedShippingMark')?.setValidators(Validators.required);

                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValidators(Validators.required);
            } else {
                this.lcShipmentDetailsControls.get('lcInsuranceOwner')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcLegalization')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcTranshipmentType')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcTransShipmentFlag')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('selectedShippingMark')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValidators(null);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValidators(null);
                this.lcShipmentDetailsControls.get('selectedShippingMark')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValue(null);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValue(null);

                this.lcShipmentDetailsControls.get('lcTransportOptions')?.enable();
                this.lcAdvicingBankDetailsControls.controls['lcSwiftCode'].setValue('');
                this.lcAdvicingBankDetailsControls.controls['lcBankAddress'].setValue('');
                this.lcAdvicingBankDetailsControls.controls['lcAdvisingBank'].setValue('');
            }
        }
        this.lcShipmentDetailsControls.get('lcInsuranceOwner')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcLegalization')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShippingMarksText')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcTranshipmentType')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcTransShipmentFlag')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('selectedShippingMark')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcCreditAvailableWith')?.updateValueAndValidity();
    }

    lcTransportOptionsChange(event: any) {
        const value = event.value;
        if (value) {
            //first clear all validations
            this.lcShipmentDetailsControls.get('lcShipmentAirportOfDep')?.setValidators(null);
            this.lcShipmentDetailsControls.get('lcShipmentAirportDesc')?.setValidators(null);
            this.lcShipmentDetailsControls.get('lcShipmentPortLanding')?.setValidators(null);
            this.lcShipmentDetailsControls.get('lcShipmentPortDischarge')?.setValidators(null);
            this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValidators(null);
            this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValidators(null);

            this.lcShipmentDetailsControls.get('lcShipmentAirportOfDep')?.setValue(null);
            this.lcShipmentDetailsControls.get('lcShipmentAirportDesc')?.setValue(null);
            this.lcShipmentDetailsControls.get('lcShipmentPortLanding')?.setValue(null);
            this.lcShipmentDetailsControls.get('lcShipmentPortDischarge')?.setValue(null);
            this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValue(null);
            this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValue(null);
            if (value === 'AIR') {
                this.lcShipmentDetailsControls.get('lcShipmentAirportOfDep')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcShipmentAirportDesc')?.setValidators(Validators.required);
            }
            if (value === 'SEA') {
                this.lcShipmentDetailsControls.get('lcShipmentPortLanding')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcShipmentPortDischarge')?.setValidators(Validators.required);
            }
            if (value === 'TRUCK') {
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.setValidators(Validators.required);
                this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.setValidators(Validators.required);
            }
        }
        this.lcShipmentDetailsControls.get('lcShipmentAirportOfDep')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentAirportDesc')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPortLanding')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPortDischarge')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPlaceOfRecipt')?.updateValueAndValidity();
        this.lcShipmentDetailsControls.get('lcShipmentPlaceOfDelivery')?.updateValueAndValidity();
    }
    /**
     * This is to redirect the user to lc status view
     */
    cancelEdit() {
        if (this.action === 'lcAmend' || this.action === 'lcAmendEdit') {
            this.router.navigate([APP_ROUTES.LC_STATUS]);
        } else {
            let data = {
                header: '<div>Cancel Edit</div>',
                body: '<div>Please save your work. All your changes will be lost if not saved?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandbox.setLcRequest(null);
                    if (this.action === 'lcDrafts') this.router.navigate([APP_ROUTES.LC_DRAFT]);
                    else this.router.navigate([APP_ROUTES.LC_STATUS]);
                }
            });
        }
    }

    updateRequestObjForAmend() {
        let amendFormData: any = this.amendForm.value;
        this.formLCRequest();
        this.importLCRequestObject.lcInstructions = [];
        this.importLCRequestObject.expiryDate = '';
        this.importLCRequestObject.shipmentDate = '';
        this.importLCRequestObject.lcbasicDetails
            ? (this.importLCRequestObject.lcbasicDetails.lcAmount = undefined)
            : '';

        if (!(this.importLCRequestObject.parentLC && this.importLCRequestObject.isAmendRequest === 'Y')) {
            // append appplication id as parent lc number and clear the application id
            this.parentLCForAmend = this.importLCRequestObject.applnId
                ? this.importLCRequestObject.applnId
                : this.importLCRequestObject.txnRefNo;
            this.importLCRequestObject.parentLC = this.importLCRequestObject.applnId
                ? this.importLCRequestObject.applnId
                : this.importLCRequestObject.txnRefNo;
            this.importLCRequestObject.applnId = '';
        }
        if (this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName) {
            this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName =
                this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName.replace('*', ' ');
        }
        if (amendFormData.lcAmendAmount) {
            this.importLCRequestObject.lcbasicDetails.lcAmount = amendFormData.lcAmendAmount;
        }
        if (amendFormData.lcAmendExpiryDate) {
            this.importLCRequestObject.lcbasicDetails.lcExpiryDate = moment(amendFormData.lcAmendExpiryDate).format(
                'YYYY-MM-DD'
            );
            this.importLCRequestObject.expiryDate = moment(amendFormData.lcAmendExpiryDate).format('YYYY-MM-DD');
        }
        if (amendFormData.lcAmendShipmentDate) {
            this.importLCRequestObject.lcShipmentDetails.lcLastShipmentDate = moment(
                amendFormData.lcAmendShipmentDate
            ).format('YYYY-MM-DD');
            this.importLCRequestObject.shipmentDate = moment(amendFormData.lcAmendShipmentDate).format('YYYY-MM-DD');
        }
        if (amendFormData.lcComments) {
            this.importLCRequestObject.lcInstructions.push({ lcComments: amendFormData.lcComments?.toUpperCase() });
        }
        if (amendFormData.narrative) {
            this.importLCRequestObject.narrative = amendFormData.narrative?.toUpperCase();
        }
    }

    formLCRequest() {
        let formData: any = this.form.value;
        this.importLCRequestObject.lcbasicDetails = this.mapInputRequestToFormData(formData.lcbasicDetails);

        if (formData.lcbasicDetails.lcExpiryDate) {
            this.importLCRequestObject.lcbasicDetails.lcExpiryDate = moment(
                formData.lcbasicDetails.lcExpiryDate
            ).format('YYYY-MM-DD');
        }
        if (
            this.importLCRequestObject.lcbasicDetails.lcOption &&
            this.importLCRequestObject.lcbasicDetails.lcOption === 'NF'
        ) {
            this.importLCRequestObject.lcbasicDetails.lcProductType = '';
        }
        if (
            this.importLCRequestObject.lcbasicDetails.selectedLcType &&
            this.importLCRequestObject.lcbasicDetails.selectedLcType === 'SIGHT'
        ) {
            this.importLCRequestObject.lcbasicDetails.lcTenor =
                this.importLCRequestObject.lcbasicDetails.selectedLcType;
        }
        if (
            this.importLCRequestObject.lcbasicDetails.lcCreditAvailableBy &&
            this.importLCRequestObject.lcbasicDetails.lcCreditAvailableBy != 'By Mixed Payment'
        ) {
            this.importLCRequestObject.lcbasicDetails.lcMixedPaymentdetails = '';
        }
        if (
            this.importLCRequestObject.lcbasicDetails.lcToleranceType &&
            this.importLCRequestObject.lcbasicDetails.lcToleranceType != 'About'
        ) {
            this.importLCRequestObject.lcbasicDetails.lcToleranceValue = '';
        }
        this.importLCRequestObject.lcAdditionalInstructions = formData.lcAdditionalInstructions;
        if (this.importLCRequestObject.lcAdditionalInstructions) {
            this.importLCRequestObject.lcAdditionalInstructions =
                this.importLCRequestObject.lcAdditionalInstructions?.toUpperCase();
        }
        this.importLCRequestObject.lcAdvicingBankDetails = this.mapInputRequestToFormData(
            formData.lcAdvicingBankDetails
        );
        if (formData.lcAdvicingBankDetails.lcSwiftCode) {
            this.importLCRequestObject.lcAdvicingBankDetails.lcSwiftCode =
                formData.lcAdvicingBankDetails?.lcSwiftCode?.toUpperCase();
        }
        this.importLCRequestObject.lcShipmentDetails = this.mapInputRequestToFormData(formData.lcShipmentDetails);

        if (formData.lcShipmentDetails.lcLastShipmentDate) {
            this.importLCRequestObject.lcShipmentDetails.lcLastShipmentDate = moment(
                formData.lcShipmentDetails.lcLastShipmentDate
            ).format('YYYY-MM-DD');
        }
        if (
            this.importLCRequestObject.lcShipmentDetails.lcInsuranceOwner &&
            this.importLCRequestObject.lcShipmentDetails.lcInsuranceOwner === 'Beneficiary'
        ) {
            this.importLCRequestObject.lcShipmentDetails.lcInsuranceApplicantDetails = '';
        }
        if (
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions &&
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions === 'AIR'
        ) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortLanding = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortDischarge = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfRecipt = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfDelivery = '';
        }
        if (
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions &&
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions === 'SEA'
        ) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfRecipt = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfDelivery = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportOfDep = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportDesc = '';
        }
        if (
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions &&
            this.importLCRequestObject.lcShipmentDetails.lcTransportOptions === 'TRUCK'
        ) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortLanding = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortDischarge = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportOfDep = '';
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportDesc = '';
        }

        this.importLCRequestObject['lcDocumentDetails'] = formData.lcDocumentDetails;

        if (this.docsRequested.length > 0) {
            this.importLCRequestObject.lcDocumentDetails['lcDocsRequired'] = this.docsRequested.toString();
        }
        this.importLCRequestObject['lcInstructions'] = [];
        if (formData.lcComments) {
            this.importLCRequestObject.lcInstructions.push({ lcComments: formData.lcComments?.toUpperCase() });
        }
        if (this.importLCRequestObject.lcbasicDetails.lcAmountInWords) {
            this.importLCRequestObject.lcbasicDetails.lcAmountInWords =
                this.importLCRequestObject.lcbasicDetails.lcAmountInWords?.toUpperCase();
        }
        if (this.importLCRequestObject.lcbasicDetails.lcTenor) {
            this.importLCRequestObject.lcbasicDetails.lcTenor =
                this.importLCRequestObject.lcbasicDetails.lcTenor?.toUpperCase();
        }
        if (this.importLCRequestObject.lcbasicDetails.lcMixedPaymentdetails) {
            this.importLCRequestObject.lcbasicDetails.lcMixedPaymentdetails =
                this.importLCRequestObject.lcbasicDetails.lcMixedPaymentdetails?.toUpperCase();
        }
        if (this.importLCRequestObject.lcAdvicingBankDetails.lcBankAddress) {
            this.importLCRequestObject.lcAdvicingBankDetails.lcBankAddress =
                this.importLCRequestObject.lcAdvicingBankDetails.lcBankAddress?.toUpperCase();
        }
        if (this.importLCRequestObject.lcAdvicingBankDetails.lcAdvisingBank) {
            this.importLCRequestObject.lcAdvicingBankDetails.lcAdvisingBank =
                this.importLCRequestObject.lcAdvicingBankDetails.lcAdvisingBank?.toUpperCase();
        }
        if (this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName) {
            this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName =
                this.importLCRequestObject.lcAdvicingBankDetails.lcBeneficiaryName?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportOfDep) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportOfDep =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportOfDep?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportDesc) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportDesc =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentAirportDesc?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentPortLanding) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortLanding =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentPortLanding?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentPortDischarge) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPortDischarge =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentPortDischarge?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfRecipt) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfRecipt =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfRecipt?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfDelivery) {
            this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfDelivery =
                this.importLCRequestObject.lcShipmentDetails.lcShipmentPlaceOfDelivery?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcInsuranceApplicantDetails) {
            this.importLCRequestObject.lcShipmentDetails.lcInsuranceApplicantDetails =
                this.importLCRequestObject.lcShipmentDetails.lcInsuranceApplicantDetails?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcGoodsServiceDesc) {
            this.importLCRequestObject.lcShipmentDetails.lcGoodsServiceDesc =
                this.importLCRequestObject.lcShipmentDetails.lcGoodsServiceDesc?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcPeriodForPresentation) {
            this.importLCRequestObject.lcShipmentDetails.lcPeriodForPresentation =
                this.importLCRequestObject.lcShipmentDetails.lcPeriodForPresentation?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcShippingMarksText) {
            this.importLCRequestObject.lcShipmentDetails.lcShippingMarksText =
                this.importLCRequestObject.lcShipmentDetails.lcShippingMarksText?.toUpperCase();
        }
        if (this.importLCRequestObject.lcShipmentDetails.lcGoodsOrigin) {
            this.importLCRequestObject.lcShipmentDetails.lcGoodsOrigin =
                this.importLCRequestObject.lcShipmentDetails.lcGoodsOrigin?.toUpperCase();
        }
        if (this.importLCRequestObject.lcDocumentDetails.lcDocsRequested) {
            this.importLCRequestObject.lcDocumentDetails.lcDocsRequested =
                this.importLCRequestObject.lcDocumentDetails.lcDocsRequested?.toUpperCase();
        }
    }
    isValid(input: any) {
        if (input === undefined) return false;
        else if (input === null) return false;
        else if (input === '') return false;
        return true;
    }
    mapInputRequestToFormData(formData: any) {
        let inputObj: any = {};
        Object.keys(formData).forEach((key: any) => {
            if (this.isValid(formData[key])) {
                inputObj[key] = formData[key];
            }
        });
        return inputObj;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    validateSwift() {
        const formData: any = this.lcAdvicingBankDetailsControls.value;
        if (formData.lcSwiftCode) {
            this.sandbox.validateSwiftCode({ swiftCode: formData.lcSwiftCode.toUpperCase() }).subscribe(
                (res: any) => {
                    if (res.data) {
                        const swiftData = res.data;
                        if (swiftData.institution && typeof swiftData === 'object') {
                            this.lcAdvicingBankDetailsControls.controls['lcBankAddress'].setValue(swiftData.city);
                            this.lcAdvicingBankDetailsControls.controls['lcAdvisingBank'].setValue(
                                swiftData.institution
                            );
                            this.validSwift = false;
                        } else {
                            this.lcAdvicingBankDetailsControls.controls['lcBankAddress'].setValue(null);
                            this.lcAdvicingBankDetailsControls.controls['lcAdvisingBank'].setValue(null);
                            this.validSwift = true;
                        }
                    } else {
                        this.validSwift = true;
                    }
                },
                (error: any) => {
                    this.validSwift = true;
                }
            );
        }
    }

    uploadFiles(operation: any) {
        // check whether the file is in queue for upload. IF yes, uploaf the files, else save or submit the LC
        if (this.selectedFiles.length) {
            // check if the application id is present to upload files.. if it not present, save the record first to generate lc number and upload the files
            if (this.importLCRequestObject.applnId) {
                // application id is present upload the files
                let uploadFormData: any = new FormData();
                this.selectedFiles.forEach((x: any) => {
                    uploadFormData.append('files', x);
                });
                this.sandbox
                    .uploadImportLC(uploadFormData, { lcApplicationId: this.importLCRequestObject.applnId })
                    .subscribe((response: any) => {
                        this.selectedFiles = [];
                        // once the file is uploaded successfully, save or submit the record based on user operation
                        if (operation === 'SAVE') {
                            this.saveLC();
                        } else if (operation === 'SUBMIT') {
                            this.saveAndSubmitLC();
                        }
                        this.uploadedDocuments = response.data.documents.filter((el: any) => {
                            return el.user.userType === 0; // filter only docs uploaded by maker
                        });
                    });
            } else {
                // application id is not present while trying to upload files, saving record first to generate app no.
                this.formLCRequest();
                this.importLCRequestObject.lcInstructions = []; //don't send for save, because submit is already sending.
                this.sandbox.saveImportLC(this.importLCRequestObject).subscribe((result: any) => {
                    this.importLCRequestObject.applnId = result.data.applnId;
                    // call the upload service if the record is saved successfully
                    this.uploadFiles(operation);
                });
            }
        } else {
            // No files present in queue for uploading, save or submit the lc
            if (operation === 'SAVE') {
                this.saveLC();
            } else if (operation === 'SUBMIT') {
                this.saveAndSubmitLC();
            }
        }
    }

    saveLC() {
        this.formLCRequest();
        // check the application reference number, for insertion or updation
        if (this.importLCRequestObject.applnId) {
            this.sandbox.updateImportLC(this.importLCRequestObject).subscribe((result: any) => {
                this.importLCRequestObject.applnId = result.data.applnId;
                this.utilService.displayNotification('LC application saved successfully', 'success');
                this.router.navigate([APP_ROUTES.LC_DRAFT]);
            });
        } else {
            this.sandbox.saveImportLC(this.importLCRequestObject).subscribe((result: any) => {
                this.importLCRequestObject.applnId = result.data.applnId;
                this.utilService.displayNotification('LC application saved successfully', 'success');
                this.router.navigate([APP_ROUTES.LC_DRAFT]);
            });
        }
    }

    checkboxValueEvent(event: any) {
        this.ischeckBoxAddSelected = event || false;
    }

    saveAndSubmitLC() {
        this.formLCRequest();
        // added fx fee
        this.importLCRequestObject.thresholdExceeded = this.lcCurrency === 'USD';
        this.sandbox.submitImportLC(this.importLCRequestObject).subscribe((result: any) => {
            this.utilService.displayNotification(
                'Your request has been submitted successfully for processing',
                'success'
            );
            this.router.navigate([APP_ROUTES.LC_STATUS]);
        });
    }

    previewLC(type: any) {
        this.formLCRequest();
        this.sandbox.previewLcPdf(this.importLCRequestObject).subscribe((result: any) => {
            if (result.status == 'SUCCESS') {
                if (type === 'view') {
                    this.dialog.openOverlayPanel('Preview', LcPreviewComponent, { content: result.data });
                } else {
                    this.utilService.downloadPdf(result.data, 'Import LC Application.pdf');
                    this.utilService.displayNotification('PDF generated successfully!', 'success');
                }
            }
        });
    }

    previewLCAmendment(type: any) {
        this.updateRequestObjForAmend();
        this.sandbox.previewLcAmentPdf(this.importLCRequestObject).subscribe((result: any) => {
            if (result.status == 'SUCCESS') {
                if (type === 'view') {
                    this.dialog.openOverlayPanel('Preview', LcPreviewComponent, { content: result.data });
                } else {
                    this.utilService.downloadPdf(result.data, 'Import LC Amendment Application');
                    this.utilService.displayNotification('PDF generated successfully!', 'success');
                }
            }
        });
    }

    submitAmendedLC() {
        this.updateRequestObjForAmend();
        this.sandbox.submitImportLCAmend(this.importLCRequestObject).subscribe(
            (result: any) => {
                // check whether the file is in queue for upload. IF yes, upload the files
                if (this.selectedFilesAmend.length > 0) {
                    let uploadFormData: any = new FormData();
                    this.selectedFilesAmend.forEach((x: any) => {
                        uploadFormData.append('files', x);
                    });
                    let refNumber = result.data.referenceNumber ? result.data.referenceNumber : result.data;
                    this.sandbox
                        .uploadImportLC(uploadFormData, { lcApplicationId: refNumber })
                        .subscribe((response: any) => {
                            this.utilService.displayNotification(
                                'Request has been submitted successfully for processing',
                                'success'
                            );
                            this.router.navigate([APP_ROUTES.LC_STATUS]);
                            this.selectedFilesAmend = [];
                            this.uploadedDocumentsAmend = response.data.documents.filter((i: any) => {
                                return i.user.userType === 0; // filter only docs uploaded by maker
                            });
                        });
                } else {
                    this.utilService.displayNotification(
                        'Request has been submitted successfully for processing',
                        'success'
                    );
                    this.router.navigate([APP_ROUTES.LC_STATUS]);
                }
            },
            (error: any) => {
                //When errored on any case, the parent ID should be persisted for the Ammed
                this.importLCRequestObject.applnId = this.parentLCForAmend;
            }
        );
    }
    downloadLCDocs() {
        let payload = {
            type: 'lcDocs',
            docs: this.lcDocuments,
        };
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, payload);
        ref.afterClosed().subscribe((res: any) => {});
    }
}
