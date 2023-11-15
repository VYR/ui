import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/utility/utility.service';
import { TransferService } from './transfers.service';
import * as moment from 'moment';
import { BULK_UPLOAD_HEADER } from './constants/meta-data';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UserContext } from 'src/app/shared/models';
import { DECISION, SYSTEM_CONFIG } from 'src/app/shared/enums';
import { BehaviorSubject, catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { SupportingDocCurrencyDialogComponent } from './components/supporting-doc-currency-dialog/supporting-doc-currency-dialog.component';
import { BulkUploadErrorsDialogComponent } from './components/bulk-upload-errors-dialog/bulk-upload-errors-dialog.component';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class TransferSandbox {
    private _fromAccounts: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    public fromAccounts: Observable<Array<any>>;
    private _draftTransfer: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
    public draftTransfer: Observable<Array<any>>;
    exDetails: any[] = [];
    forex: any[] = [];
    totalAmount = 0;
    backDate: any;
    h2hEnabled: boolean = false;
    countryMappingIban: any = {};
    validCountries: Array<string> = [];
    errorList: Array<string> = [];
    supportingDocCurrencyList: any = [];
    debitAccCurList: any = [];
    fxTransactionCount = 0;
    thresholdCount = 0;
    templateMappingData: any;
    public selectedBulkDraft: Observable<any>;
    private _selectedBulkDraft = new BehaviorSubject<any>({});
    private _rawData: any = [];
    constructor(
        private service: TransferService,
        private utilService: UtilService,
        private appContext: ApplicationContextService,
        private dialog: CibDialogService,
        private router: Router
    ) {
        this.selectedBulkDraft = this._selectedBulkDraft.asObservable();
        this.fromAccounts = this._fromAccounts.asObservable();
        this.draftTransfer = this._draftTransfer.asObservable();
    }

    public fetchDataOnLoad() {
        return forkJoin([
            this.service.getExchangeRates(),
            this.service.getFromAccountsList('TRANSFER_ACCOUNTS'),
            this.service.getTemplateMapping(),
            this.service.getCountryList(),
        ]).pipe(
            tap((res: any) => {
                this.forex = res[0].data;
                this._fromAccounts.next(res[1].data.accounts);
                this.templateMappingData = res[2].data;
                this._parseIbanAndCountryList(res[3].countries || []);
                this._getUserData();
            })
        );
    }

    private _parseIbanAndCountryList(countries: any) {
        this.countryMappingIban = {};
        this.validCountries = [];
        countries.forEach((x: any) => {
            this.countryMappingIban[x.code] = x.iban;
            this.validCountries.push(x.code);
        });
    }

    private _validateCountry(value: any) {
        var country = value['Beneficiary Bank Country']?.toString().trim() || '';
        const errors: any = [];
        if (!this.validCountries.includes(country)) {
            errors.push(`Restricted Beneficiary Country.`);
        }
        return errors;
    }

    private _getUserData() {
        return this.appContext.currentUser.subscribe((res: UserContext) => {
            const days = res?.sysConfig && res?.sysConfig[SYSTEM_CONFIG.BACK_DATE];
            this.backDate = moment().subtract(Number(days) || 30, 'days');
            this.h2hEnabled = res.h2hEnabled || false;
        });
    }

    getDraftsList(input: any) {
        return this.service.getDraftsList(input);
    }

    setDraftTransfer(data: any) {
        this._draftTransfer.next(data);
    }

    saveTransfers(payload: any) {
        return this.service.saveTransfers(payload).pipe(
            tap((res: any) => {
                if (res.statusCode === 200) {
                    this._draftTransfer.next([]);
                    this.utilService.displayNotification(`Transfers saved successfully!`, 'success');
                }
            })
        );
    }

    getFromAccountsList() {
        this.service.getFromAccountsList('TRANSFER_ACCOUNTS').subscribe((res: any) => {
            if (res.data) {
                this._fromAccounts.next(res.data.accounts);
            }
        });
    }

    public uploadData(files: any, selectedFileType: any) {
        return this.utilService.readFromExcel(files).pipe(
            map(
                (res: any) => {
                    if (res.data.length === 0) {
                        this.utilService.displayNotification('Please upload a file with Valid data', 'error');
                    }
                    this._rawData = JSON.parse(JSON.stringify(res.data));
                    return this._validateJSONData(res.data, selectedFileType, res.fileName);
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    public feedDraftData(data: any) {
        if ([2, 3, 4].includes(data.transferType)) {
            this._feedDraftDataXMLTXT(data);
        } else {
            this._selectedBulkDraft.next({
                uid: data.uid,
                drafts: this._validateJSONData(data.fileJSON, data.transferType, data.userFileName) || [],
            });
            this.router.navigate(['home/transfers/multiple-debit-bulk']);
        }
    }

    public clearDraftData(data: any) {
        this._selectedBulkDraft.next({
            uid: null,
            drafts: [],
        });
    }

    private _feedDraftDataXMLTXT(data: any) {
        this._parseCustomFileTransfer(data.fileJSON, data.fileName).subscribe((res: any) => {
            this._selectedBulkDraft.next({
                uid: data.uid,
                drafts: res || [],
            });
            this.router.navigate(['home/transfers/multiple-debit-bulk']);
        });
    }

    getPurposeCodes() {
        return this.service.getPurposeCodes();
    }

    public getIncomeSources() {
        return this.service.getIncomeSources();
    }

    _validateJSONData(json: any, selectedFileType: any, fileName: any) {
        const { data, errorsList } = this._validateFieldsCheck(json, selectedFileType);
        let output: any;

        if (errorsList.length) {
            this.utilService.displayNotification(
                'Unable to process the uploaded excel file due to some validation errors',
                'error'
            );
            const ref = this.dialog.openOverlayPanel(
                'Bulk Upload Data Errors',
                BulkUploadErrorsDialogComponent,
                errorsList,
                CibDialogType.large
            );
            ref.afterClosed().subscribe((result: any) => {
                output = {
                    fileName: '',
                    data: [],
                };
            });
        }

        if (this.supportingDocCurrencyList.length > 0 && !errorsList.length) {
            const ref = this.dialog.openDialog(
                CibDialogType.small,
                SupportingDocCurrencyDialogComponent,
                this.supportingDocCurrencyList
            );
            ref.afterClosed().subscribe((result: any) => {
                if (result?.decision === 'CANCEL') {
                    output.data = [];
                    output = {
                        data: [],
                    };
                }
            });
        }

        output = {
            totalRecords: data!.length || [],
            fileName,
            data,
            totalAmount: this.totalAmount,
            exDetails: this.exDetails,
            fxTransactionCount: this.fxTransactionCount,
            thresholdCount: this.thresholdCount,
            backDate: this.backDate,
            supportingDocCurrencyList: this.supportingDocCurrencyList,
        };
        return output;
    }

    private _validateFieldsCheck(data: Array<any>, selectedFileType: any): any {
        try {
            let errorsList: Array<any> = [];
            if (selectedFileType === 1) {
                data = this._setDataForCustomFile(data);
            }
            data.forEach((row: any, index: number) => {
                let errors = [
                    ...this._validateMandatoryFields(row, BULK_UPLOAD_HEADER),
                    ...this._validateFieldsbyTransactionType(row),
                    ...this._validateDebitAccount(row),
                    ...this._validatePaymentAmount(row),
                    ...this._validatePaymentDate(row),
                    ...this._validateCustomerReferenceNo(row),
                    ...this._validateIbanNo(row),
                    ...this._validateCrossCurrency(row),
                    ...this._validateCountry(row),
                ];
                if (errors.length)
                    errorsList.push({
                        transactionType: row['Txn Type'],
                        debitAccountNumber: row['Debit Account Number'],
                        paymentDate: row['Payment Date'],
                        referenceNo: row['Customer Reference'],
                        iban: row['Beneficiary Account or IBAN'],
                        benName: row['Beneficiary Name'],
                        index: index + 1,
                        errors,
                    });
            });

            this._addExtraColumns(data);
            this.totalAmount = this._parsePaymentAmount(data);
            this.exDetails = this.calculateExchangeRatesQAR(data);
            this.supportingDocCurrencyList = this._showSupportingCurrencyListPopUp(data);
            const output = this._setThresholdAndFxTransaction(data);
            this.debitAccCurList = output.currencies;
            this.fxTransactionCount = output.fxTransactionCount;
            this.thresholdCount = output.thresholdCount;
            this.errorList = errorsList;
            return { data: errorsList.length ? [] : data, errorsList };
        } catch (error) {
            this.utilService.displayNotification(
                'The uploaded excel file seems to be corrupted. Kindly upload a valid excel file as per QIB Bulk Upload specifications.',
                'error'
            );
            return { data: [], errorsList: [] };
        }
    }

    private _validateCustomerReferenceNo(value: any) {
        const errors: Array<string> = [];
        const regex = /[{}\[\]\\:;`'~=@+|\^?&%#<>$!*_"]/;
        if (regex.test(value['Customer Reference']))
            errors.push(`Invalid special character provided in customer reference field.`);
        if (value['Beneficiary Bank Country'] === 'ID') {
            value['Customer Reference'] = '1011//' + value['Customer Reference'];
        }
        return errors;
    }

    private _validateIbanNo(value: any) {
        var ibanNumber = value['Beneficiary Account or IBAN']?.toString().trim() || '';
        const errors = [];
        if (this.countryMappingIban[value['Beneficiary Bank Country']] === 'Y') {
            if (!(this._ibanRegxCheck(ibanNumber) && ibanNumber.substring(0, 2) === value['Beneficiary Bank Country']))
                errors.push(`Invalid IBAN number provided for Beneficiary Account.`);
        }
        value['Beneficiary Account or IBAN'] = ibanNumber;
        return errors;
    }

    // check for showing supporting doc pop up
    private _showSupportingCurrencyListPopUp(data: any) {
        const list: Array<string> = [];
        data.forEach((value: any) => {
            if (['MYR', 'CNY'].includes(value['Payment Currency']) && !list.includes(value['Payment Currency'])) {
                list.push(value['Payment Currency']);
            }
        });
        return list;
    }

    private _validateCrossCurrency(value: any) {
        const errors: Array<string> = [];
        let fromAccount = this._fromAccounts.value.filter((item: any) => {
            return value['Debit Account Number'] === item.account_no || value['Debit Account Number'] === item.t24_iban;
        });

        if (
            fromAccount?.[0].currency === 'QAR' &&
            value['Beneficiary Bank SWIFT CODE'] &&
            value['Beneficiary Bank SWIFT CODE'].toString().indexOf('QISBQAQA') !== -1 &&
            value['Payment Currency'] !== 'QAR'
        ) {
            errors.push(`QAR to a non QAR transfer is restricted for within RIM / within QIB accounts`);
        }

        return errors;
    }

    private _setThresholdAndFxTransaction(data: any) {
        let fxTransactionCount = 0;
        let thresholdCount = 0;
        const currencies: Array<string> = [];
        data.map((value: any) => {
            this._fromAccounts.value.forEach((obj: any) => {
                if (
                    value['Debit Account Number'] === obj.account_no ||
                    value['Debit Account Number'] === obj.t24_iban
                ) {
                    if (value['Txn Type'] === 'IST' && obj.currency === 'QAR') {
                        if (value['Payment Currency'] !== 'QAR') {
                            value['fxTransaction'] = 'Y';
                            fxTransactionCount++;
                        }

                        if (value['Payment Currency'] === 'USD') {
                            value['thresholdExceeded'] = 'Y';
                            thresholdCount++;
                        }
                    }

                    // push non unique debit account currency
                    if (!currencies.includes(obj.currency)) {
                        currencies.push(obj.currency);
                    }
                }
            });
        });

        return {
            fxTransactionCount,
            thresholdCount,
            currencies,
        };
    }

    private _ibanRegxCheck(str: any) {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\s]/g.test(str);
    }

    private _validatePaymentAmount(value: any) {
        const amount = (value['Payment Amount'] || '').toString().replace(/,/g, '');
        if (amount) {
            if (!isNaN(Number(amount)) && Number(amount) > 0) return [];
        }
        return [`Invalid Payment Amount provided.`];
    }

    private _validatePaymentDate(value: any) {
        const format = 'DD/MM/YYYY';
        // payment date check
        if (moment(value['Payment Date'], format, true).isValid()) {
            value['Payment Date'] = moment(value['Payment Date'], format).format('DD-MM-YYYY');
            //to do get the backdate value from config service.
            if (moment(value['Payment Date'], 'DD-MM-YYYY').diff(this.backDate, 'days') < 0) {
                return [`Invalid Payment date provided.`];
            }
            return [];
        } else {
            return [`Invalid Payment date format provided.`];
        }
    }

    private _addExtraColumns(data: Array<any>) {
        const columnInfo = [
            {
                key: 'Relation with Remitter',
                value: 'Business / Vendor Relationship',
            },
            {
                key: 'Source Of Income',
                value: 'Business Income',
            },
        ];
        columnInfo.forEach((column: any) => {
            data.map((x: any) => (x[column.key] = column.value));
        });
    }

    private _parsePaymentAmount(data: any) {
        let totalAmount = 0;
        data.map((value: any) => {
            if (value['Payment Amount'] && value['Payment Currency']) {
                value['Payment Amount'] = (value['Payment Amount'] || '').toString().trim().replace(/,/g, '');
                const valueAddedAmount = this.getQAREquivalent(value['Payment Amount'], value['Payment Currency']);
                value['Exchange Rate'] = valueAddedAmount.rate;
                totalAmount += valueAddedAmount.amount;
            }
        });

        return totalAmount;
    }

    // To check Mandatory fields && conditional validation of Beneficiary Bank SWIFT CODE and Clearing Code
    private _validateMandatoryFields(data: any, headers: any) {
        const errors: Array<string> = [];
        headers.forEach((header: any) => {
            if (
                header.mandatory &&
                data[header.key] != null &&
                data[header.key].toString().trim() === '' &&
                header.key !== 'Clearing Code' &&
                header.key !== 'Beneficiary Bank SWIFT CODE'
            ) {
                errors.push(`No data is present for field ${header.key}`);
            }
        });
        if (
            data['Beneficiary Country'] === 'IN' &&
            data['Payment Currency'] === 'INR' &&
            (data['Clearing Code'] === undefined || data['Clearing Code'] === '')
        ) {
            errors.push(`No data is present for field Clearing Code`);
        } else if (
            data['Beneficiary Country'] === 'IN' &&
            data['Payment Currency'] !== 'INR' &&
            (data['Beneficiary Bank SWIFT CODE'] === undefined || data['Beneficiary Bank SWIFT CODE'] === '')
        ) {
            errors.push(`No data is present for field Beneficiary Bank SWIFT CODE`);
        } else if (
            data['Beneficiary Country'] === 'CA' &&
            data['Payment Currency'] === 'CAD' &&
            (data['Clearing Code'] === undefined || data['Clearing Code'] === '')
        ) {
            errors.push(`No data is present for field Clearing Code`);
        } else if (
            data['Beneficiary Country'] === 'CA' &&
            data['Payment Currency'] !== 'CAD' &&
            (data['Beneficiary Bank SWIFT CODE'] === undefined || data['Beneficiary Bank SWIFT CODE'] === '')
        ) {
            errors.push(`No data is present for field Beneficiary Bank SWIFT CODE`);
        } else if (
            data['Beneficiary Country'] === 'AU' &&
            data['Payment Currency'] === 'AUD' &&
            (data['Clearing Code'] === undefined || data['Clearing Code'] === '')
        ) {
            errors.push(`No data is present for field Clearing Code`);
        } else if (
            data['Beneficiary Country'] === 'AU' &&
            data['Payment Currency'] !== 'AUD' &&
            (data['Beneficiary Bank SWIFT CODE'] === undefined || data['Beneficiary Bank SWIFT CODE'] === '')
        ) {
            errors.push(`No data is present for field Beneficiary Bank SWIFT CODE`);
        } else if (
            data['Beneficiary Country'] === 'US' &&
            data['Payment Currency'] === 'USD' &&
            (data['Clearing Code'] === undefined || data['Clearing Code'] === '')
        ) {
            errors.push(`No data is present for field Clearing Code`);
        } else if (
            data['Beneficiary Country'] === 'US' &&
            data['Payment Currency'] !== 'USD' &&
            (data['Beneficiary Bank SWIFT CODE'] === undefined || data['Beneficiary Bank SWIFT CODE'] === '')
        ) {
            errors.push(`No data is present for field Beneficiary Bank SWIFT CODE`);
        }

        console.log(errors);
        return errors;
    }

    private _validateDebitAccount(value: any) {
        const accountNo = (value['Debit Account Number'] || '').toString();
        let acc = this._fromAccounts.value.filter((obj: any) => {
            if ([obj.account_no, obj.t24_iban].includes(accountNo)) {
                value['Debit Account Number'] = obj.account_no;
                return true;
            }
            return false;
        });
        return acc.length > 0 ? [] : [`Invalid Debit Account Number.`];
    }

    private _validateFieldsbyTransactionType(value: any): Array<string> {
        const errors: Array<string> = [];
        const txnType = value['Txn Type']?.toString()?.toUpperCase();
        const swiftCode = value['Beneficiary Bank SWIFT CODE']?.toString()?.trim();
        if (!txnType) return [];

        // checking for QIB beneficiary
        if (swiftCode && swiftCode.indexOf('QISBQAQA') !== -1 && txnType !== 'IFT')
            errors.push(`You cannot make a Domestic or International Transfer to a QIB account.`);

        // check for payment
        if (txnType === 'IST' && value['Payment Currency'] == 'QAR')
            errors.push(`You cannot make an International transfer with payment currency QAR.`);

        // check for valid swift code
        if ((txnType === 'DFT' || txnType === 'IFT') && !(swiftCode && swiftCode.length === 8))
            errors.push(`Invalid SWIFT Code provided.`);

        // check for currency
        if (txnType === 'DFT' && value['Payment Currency'] !== 'QAR')
            errors.push(`You can make a Domestic Transfer with QAR payment currency only.`);

        // check for QDB currency
        if (swiftCode && swiftCode.indexOf('QIDBQAQA') !== -1 && value['Payment Currency'] !== 'QAR')
            errors.push(`You can make a QDB Transfer with QAR payment currency only.`);

        // check for beneficiary name
        const benefNameLength = value['Beneficiary Name'] ? value['Beneficiary Name'].length : 0;
        if ((txnType === 'DFT' && benefNameLength > 55) || (txnType === 'IST' && benefNameLength > 70))
            errors.push(
                `Beneficiary name cannot exceed 55 characters for Domestic and 70 characters for International Transfers.`
            );

        return errors;
    }

    getQAREquivalent(amount: any, cur: any) {
        let updatedAmount = amount.replace(/,/g, '');
        updatedAmount = parseFloat(updatedAmount);
        let exRate = '1';
        if (cur !== 'QAR') {
            const buyRate = this.forex.filter((obj: any) => {
                return obj.currency === cur;
            });
            if (buyRate.length) {
                updatedAmount = updatedAmount * parseFloat(buyRate[0].transferMidRate);
                exRate = buyRate[0].transferMidRate;
            }
        }
        return {
            amount: updatedAmount,
            rate: exRate,
        };
    }

    calculateExchangeRatesQAR(data: any) {
        let tempExDetails: any[] = [];
        data.map((value: any) => {
            if (value['Payment Amount'] && value['Payment Currency']) {
                let updatedAmount = value['Payment Amount'].replace(/,/g, '');
                value['Payment Amount'] = (value['Payment Amount'] || '').toString().trim().replace(/,/g, '');
                if (value['Payment Currency'] !== 'QAR') {
                    const buyRate = this.forex.filter((obj: any) => {
                        return obj.currency === value['Payment Currency'];
                    });
                    const exFound = tempExDetails.filter((obj: any) => {
                        return obj.currency === value['Payment Currency'];
                    });
                    if (exFound.length) {
                        const index = tempExDetails.indexOf(exFound[0]);
                        tempExDetails[index].rate = parseFloat(tempExDetails[index].rate) + parseFloat(updatedAmount);
                    } else {
                        tempExDetails.push({
                            currency: value['Payment Currency'],
                            exRate: buyRate[0].transferMidRate,
                        });
                    }
                }
            }
        });
        return tempExDetails;
    }

    initiateBulkTransfer(req: any) {
        return this.service.initiateBulkTransfer(req);
    }

    saveBulkDrafts(req: any) {
        req.data[0].fileJSON = this._rawData;
        return this.service.saveBulkDrafts(req, 'bulk');
    }

    uploadTXTandXMLfile(files: any, selectedFileType: any) {
        return this.utilService.readFile(files).pipe(
            map((output: any) => {
                if (!output.data) {
                    this.utilService.displayNotification('Please upload a file with Valid data', 'error');
                }
                const req = {
                    payload: output.data,
                    transferType: selectedFileType,
                };
                this._rawData = JSON.parse(JSON.stringify(req));
                return this._parseCustomFileTransfer(req, output.fileName);
            })
        );
    }

    private _parseCustomFileTransfer(req: any, fileName: string) {
        return this.service.parseCustomFileTransfer(req).pipe(
            map((res: any) => {
                let fileJSON = JSON.parse(JSON.stringify(res.data.fileJSON));
                fileJSON.forEach((value: any) => {
                    if (value['Payment Date']) {
                        value['Payment Date'] = moment(value['Payment Date'].toString(), 'DD-MM-YYYY').format(
                            'DD/MM/YYYY'
                        );
                    }
                });
                const data = this._validateJSONData(fileJSON, req.transferType, fileName);
                return data;
            })
        );
    }

    createTransfer(payload: any, action: DECISION) {
        return this.service.createTransfer(payload).pipe(
            tap((res: any) => {
                if (action === DECISION.CONFIRM && res.status === 'APPROVAL_REQUESTED') {
                    this.utilService.displayNotification(`Transfer request has been sent for approval!`, 'success');
                }
            })
        );
    }

    getTemplateMapping() {
        this.service.getTemplateMapping().subscribe((response: any) => {
            if (response.data) {
                this.templateMappingData = response.data;
            }
        });
    }

    deleteDraftsRequest(uid: any) {
        return this.service.deleteDraftsRequest(uid).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.utilService.displayNotification(`Draft is cleared successfully!`, 'success');
                }
            })
        );
    }

    //  _setDataForCustomFile for custom bulk transfer
    _setDataForCustomFile(customJSON: any) {
        if (this.templateMappingData.customMapping) {
            // QIB standard column names are mentioned here
            let templateKeys = Object.keys(this.templateMappingData.templateMapping);

            // all the custom template or default values are mentioned here
            let templateValues = Object.keys(this.templateMappingData.templateMapping).map((key) => {
                return this.templateMappingData.templateMapping[key];
            });

            // Replacing txnType values
            let txnTypeValues = Object.keys(this.templateMappingData.txnTypeMapping).map((key) => {
                return this.templateMappingData.txnTypeMapping[key];
            });

            let txnTypeKeys = Object.keys(this.templateMappingData.txnTypeMapping);

            // Replacing purpose of code values
            let ppValues = Object.keys(this.templateMappingData.purposeCodeMapping).map((key) => {
                return this.templateMappingData.purposeCodeMapping[key];
            });

            let ppKeys = Object.keys(this.templateMappingData.purposeCodeMapping);

            // setting up data for grid
            customJSON.forEach((value: any, rowNumber: any) => {
                var dataObj: any = {};
                for (var key in value) {
                    var purposeKey = this.templateMappingData.templateMapping['Purpose of Payment'];
                    var txnTypeKey = this.templateMappingData.templateMapping['Txn Type'];
                    if (key === txnTypeKey && txnTypeValues.indexOf(value[key]) !== -1) {
                        value[key] = txnTypeKeys[txnTypeValues.indexOf(value[key])];
                    }
                    if (key === purposeKey && ppValues.indexOf(value[key]) !== -1) {
                        value[key] = ppKeys[ppValues.indexOf(value[key])];
                    }

                    if (templateValues.indexOf(key) !== -1) {
                        // assign object property based on old property value
                        dataObj[templateKeys[templateValues.indexOf(key)]] = value[key];
                    }
                }

                //creating default column
                templateValues.forEach((val, indx) => {
                    if (val.indexOf('@DEFAULT') !== -1) {
                        dataObj[templateKeys[indx]] = val === '@DEFAULTNA' ? '' : val.replace('@DEFAULT', '');
                    }
                });
                customJSON[rowNumber] = dataObj;
            });

            return customJSON;
        }
    }

    getBenificiaries() {
        return this.service.getBenificiaries();
    }

    fetchKey() {
        return this.service.fetchKey();
    }
}
