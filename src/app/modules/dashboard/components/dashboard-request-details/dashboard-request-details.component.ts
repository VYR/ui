import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { DashboardSandbox } from '../../dashboard.sandbox';

@Component({
    selector: 'app-dashboard-request-details',
    templateUrl: './dashboard-request-details.component.html',
    styleUrls: ['./dashboard-request-details.component.scss'],
})
export class DashboardRequestDetailsComponent implements OnInit {
    constructor(
        private sandBox: DashboardSandbox,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DashboardRequestDetailsComponent>
    ) {}
    transactions: Array<any> = [];
    mode: DECISION = DECISION.VIEW;
    DECISION = DECISION;
    otp: any = '';
    notes: string = '';
    isDisclaimerChecked: boolean = true;
    hasFXDisclaimer: boolean = false;
    hasThresholdDisclaimer: boolean = false;
    showActivityHistory = false;
    pendingWith: any[] = [];

    ngOnInit(): void {
        let fxCount = 0;
        let thresholdCount = 0;
        this.transactions = [];
        if (!this.data.data) return;
        this.mode = this.data.mode;
        this.data.data.forEach((data: any) => {
            let requestObject: any = {
                bulkPayments: [],
            };
            requestObject.type = data.uuid;
            requestObject.id = data.id;
            requestObject.requestType = data.requestType;
            requestObject.requestDescription = data.requestDescription;
            requestObject.currency = data.currency || 'QAR';
            requestObject.amount = data.txnAmount > 0 ? data.txnAmount : null;
            requestObject.cibRef = data.cibRef;
            requestObject.created = data.created;
            requestObject.createdBy = data.createdBy;
            requestObject.updated = data.updated;
            requestObject.updatedBy = data.updatedBy;

            if (data.responseData) {
                const responseData = data.responseData;
                if (responseData.data) {
                    requestObject['referenceNumber'] = responseData.data.referenceNumber;
                }
                if (responseData.errors && responseData.errors.length > 0)
                    requestObject['remark'] = responseData.errors[0]?.message;
                else requestObject['remark'] = responseData.status;
            }

            if (data.requestAction?.length > 0) {
                let completeActivityCount = 0;
                requestObject.requestAction = data.requestAction || [];
                requestObject.requestAction.forEach((action: any) => {
                    if (action.complete) {
                        completeActivityCount++;
                    }
                    if (action.action.name === 'APPROVE') {
                        requestObject.approvalId = action.id;
                    }
                    if (action.action.name === 'REJECT') {
                        requestObject.rejectId = action.id;
                    }
                    requestObject.actionName = action.action.name;
                });
                this.showActivityHistory = completeActivityCount > 0;
            }

            if (data.pendingHistory?.length > 0) {
                this.pendingWith = data.pendingHistory || [];
            }

            // ACCOUNT_OPENING_MUDARABA_TERM_DEPOSIT && ACCOUNT_OPENING_CERTIFICATE_OF_DEPOSIT
            if (
                ['ACCOUNT_OPENING_MUDARABA_TERM_DEPOSIT', 'ACCOUNT_OPENING_CERTIFICATE_OF_DEPOSIT'].indexOf(
                    data.requestType
                ) !== -1
            ) {
                if (data?.requestData?.additionalProperties?.hasOwnProperty('AccountCreateRequest')) {
                    const additionalProperties = data.requestData.additionalProperties.AccountCreateRequest;
                    requestObject['fromAccount'] = additionalProperties?.debitAccountNumber;
                    requestObject['principalCurrency'] = additionalProperties?.currency;
                    requestObject['principalAmount'] = additionalProperties?.principalAmount;
                    requestObject['autoRollOver'] = additionalProperties?.autoRollOver;
                    requestObject['tenor'] = additionalProperties?.tenor;
                    requestObject['profitRate'] = additionalProperties?.expectedProfitRate + ' %';
                }
            }

            // PAYMENT_PAY_KAHRAMAA
            if (data.requestType === 'PAYMENT_PAY_KAHRAMAA') {
                if (data?.requestData?.transferData) {
                    requestObject.noOfTransfers = data.requestData.transferData?.length;
                    data.requestData.transferData.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['debitAmount'] = transaction.amount;
                        tempObject['debitCurrency'] = 'QAR';
                        tempObject['fromAccount'] = transaction.fromAccount;
                        tempObject['qatarId'] = transaction.qatarId;
                        tempObject['electricityNumber'] = transaction.serviceNumber;
                        tempObject['referenceNumber'] = transaction.referenceNumber;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }

            //PAYMENT_PAY_DHAREEBA_BILL
            if (data.requestType === 'PAYMENT_PAY_DHAREEBA_BILL') {
                if (data?.requestData) {
                    const dhareebaData = data?.requestData;
                    requestObject['debitAmount'] = dhareebaData.amount;
                    requestObject['debitCurrency'] = dhareebaData.currency;
                    requestObject['fromAccount'] = dhareebaData.fromAccount;
                    requestObject['tinNumber'] = dhareebaData.tinNumber;
                    requestObject['dueDate'] = dhareebaData.dueDate?.split(' ')[0] || '';
                    requestObject['billNumber'] = dhareebaData.billNumber;
                }
            }

            //PAYMENT_PAY_OOREDOO_BILL
            if (data.requestType === 'PAYMENT_PAY_OOREDOO_BILL') {
                if (data?.requestData) {
                    const dhareebaData = data?.requestData;
                    requestObject['debitAmount'] = dhareebaData.amount;
                    requestObject['debitCurrency'] = dhareebaData.currency;
                    requestObject['fromAccount'] = dhareebaData.fromAccount;
                    requestObject['serviceNumber'] = dhareebaData.phoneNumber;
                }
            }

            //PAYMENT_CREDIT_CARD
            if (data.requestType === 'PAYMENT_CREDIT_CARD') {
                if (data?.requestData) {
                    const cardData = data?.requestData;
                    requestObject['debitAmount'] = cardData.amount;
                    requestObject['debitCurrency'] = cardData.currency;
                    requestObject['fromAccount'] = cardData.fromAccount;
                    requestObject['maskedCardNumber'] = cardData.maskedCardNumber;
                }
            }

            //CREDITCARD_PAYMENTS_MULTIPLE
            if (data.requestType === 'CREDITCARD_PAYMENTS_MULTIPLE') {
                if (data?.requestData?.transferData) {
                    requestObject.noOfTransfers = data.requestData.transferData?.length;
                    data.requestData.transferData.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['debitAmount'] = transaction.amount;
                        tempObject['debitCurrency'] = transaction.currency;
                        tempObject['fromAccount'] = transaction.fromAccount;
                        tempObject['maskedCardNumber'] = transaction.cardNumberMasked || transaction.cardNumber;
                        tempObject['referenceNumber'] = transaction.referenceNumber;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }

            //STO_WITH_IN_QIB && STO_WITH_IN_QATAR && STO_INTERNATIONAL && TRANSFER_WITH_IN_ACCOUNT && TRANSFER_WITH_IN_QATAR && TRANSFER_INTERNATIONAL
            if (
                [
                    'STO_WITH_IN_QIB',
                    'STO_WITH_IN_QATAR',
                    'STO_INTERNATIONAL',
                    'TRANSFER_WITH_IN_ACCOUNT',
                    'TRANSFER_INTERNATIONAL',
                    'TRANSFER_WITH_IN_QATAR',
                    'TRANSFER_WITH_IN_QIB',
                ].indexOf(data.requestType) !== -1
            ) {
                if (data?.requestData) {
                    const transferData = data?.requestData;
                    requestObject['debitCurrency'] = transferData.currency;
                    requestObject['debitAmount'] = transferData.amount;
                    requestObject['fromAccount'] = transferData.fromAccount;
                    requestObject['toAccount'] = transferData.toAccount;
                    requestObject['beneficiaryName'] = transferData.beneficiaryName;
                    requestObject['chargeType'] = transferData.chargeType;
                    requestObject['purposeValue'] = transferData.purposeValue;
                    requestObject['payeeType'] = transferData.transactionType || transferData.payeeType;
                    requestObject['description'] = transferData.description;
                    requestObject['sourceOfIncome'] = transferData.sourceOfIncome;
                    requestObject['invoiceNumber'] = transferData.invoiceNumber;
                    requestObject['execTime'] = transferData.execTime;
                    requestObject['frequency'] = transferData.frequency;
                    requestObject['occurrence'] = transferData.occurrence;
                    requestObject['recurring'] = transferData.recurring;
                    requestObject['startDate'] = transferData.startDate;
                    if (transferData?.hasOwnProperty('charges')) {
                        Object.keys(transferData.charges).forEach((key) => {
                            requestObject[key] = transferData.charges[key];
                        });
                    }
                    if (transferData.fxTransaction) fxCount++;
                    if (transferData.thresholdExceeded) thresholdCount++;
                }
            }

            //TRANSFER_MULTIPLE
            if (data.requestType === 'TRANSFER_MULTIPLE') {
                if (data?.requestData?.transferData) {
                    requestObject.noOfTransfers = data.requestData.transferData?.length;
                    data.requestData.transferData.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['debitAmount'] = transaction.amount;
                        tempObject['debitCurrency'] = transaction.currency;
                        tempObject['fromAccount'] = transaction.fromAccount;
                        tempObject['toAccount'] = transaction.toAccount;
                        tempObject['beneficiaryName'] = transaction.beneficiaryName;
                        tempObject['chargeType'] = transaction.chargeType;
                        tempObject['purposeValue'] = transaction.purposeValue;
                        tempObject['payeeType'] = transaction.transactionType || transaction.payeeType;
                        tempObject['description'] = transaction.description;
                        tempObject['sourceOfIncome'] = transaction.sourceOfIncome;
                        tempObject['invoiceNumber'] = transaction.invoiceNumber;
                        tempObject['referenceNumber'] = transaction.referenceNumber;
                        if (transaction?.hasOwnProperty('charges')) {
                            Object.keys(transaction.charges).forEach((key) => {
                                tempObject[key] = transaction.charges[key];
                            });
                        }
                        if (transaction.fxTransaction) fxCount++;
                        if (transaction.thresholdExceeded) thresholdCount++;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }

            //TRANSFER_BULK
            if (data.requestType === 'TRANSFER_BULK') {
                if (data?.requestData?.fileJSON) {
                    requestObject.noOfTransfers = data?.requestData.fileJSON?.length;
                    data.requestData.fileJSON.forEach((transaction: any) => {
                        if (transaction.fxTransaction === 'Y') fxCount++;
                        if (transaction.thresholdExceeded === 'Y') thresholdCount++;
                    });
                    // show pop up
                }
            }

            //AUTO_COVER
            if (data.requestType === 'AUTO_COVER') {
                if (data?.requestData) {
                    const autoData = data?.requestData;
                    requestObject['coverAccount'] = autoData.linkedAccounts;
                    requestObject['transactionAccounts'] = autoData.accounts;
                }
            }

            //AUTO_SWEEP
            if (data.requestType === 'AUTO_SWEEP') {
                if (data?.requestData?.sweepData) {
                    requestObject.noOfSweeps = data.requestData.sweepData?.length;
                    requestObject.totalThresholdAmount = data.requestData.totalAmount;
                    data.requestData.sweepData.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['fromAccount'] = transaction.fromAccount;
                        tempObject['toAccount'] = transaction.toAccount;
                        tempObject['thresholdCurrency'] = transaction.currency;
                        tempObject['thresholdAmount'] = transaction.thresholdAmount;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }

            //AUTO_SWEEP_UPDATE && AUTO_SWEEP_DELETE
            if (['AUTO_SWEEP_UPDATE', 'AUTO_SWEEP_DELETE'].indexOf(data.requestType) !== -1) {
                if (data?.requestData) {
                    const sweepData = data?.requestData;
                    requestObject['fromAccount'] = sweepData.fromAccount;
                    requestObject['toAccount'] = sweepData.toAccount;
                    requestObject['thresholdCurrency'] = sweepData.currency;
                    requestObject['thresholdAmount'] = sweepData.thresholdAmount;
                }
            }

            //AUTO_SWEEP
            if (data.requestType === 'POSITIVE_PAY_ADD_DATA') {
                if (data?.requestData?.positivePayData) {
                    requestObject.noOfCheques = data.requestData.positivePayData?.length;
                    requestObject.totalChequeAmount = data.requestData.totalAmount;
                    requestObject.type = data.requestData.type === 'single' ? 'Single/Multiple Entries' : 'Bulk Upload';
                    data.requestData.positivePayData.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['chequeAccount'] = transaction.accountNo;
                        tempObject['chequeNum'] = transaction.chequeNum;
                        tempObject['chequeCurrency'] = transaction.currencyCode;
                        tempObject['chequeAmount'] = transaction.amount;
                        tempObject['issueDate'] = transaction.issueDate;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }

            // Request Cheque Book
            if (data.requestType === 'GENERAL_SERVICE_CHEQUE_BOOK') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['fromAccount'] = requestData?.accountNumber;
                    requestObject['numberOfLeaves'] = requestData?.numberOfLeaves;
                    requestObject['charges'] = requestData?.charge;
                    requestObject['chargeCurrency'] = requestData?.currency;
                }
            }

            // Request e-statement
            if (data.requestType === 'GENERAL_SERVICE_E_STATEMENT') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['fromAccount'] = requestData?.accountNumber;
                    requestObject['period'] = requestData?.period;
                    requestObject['emailId'] = requestData?.emailId;
                    requestObject['alternateEmailId'] = requestData?.alternateEmailId;
                }
            }

            // Request e-statement
            if (data.requestType === 'GENERAL_SERVICE_CREDIT_CARD') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['fromAccount'] = requestData?.accountNumber;
                    requestObject['cardType'] = requestData?.cardType;
                    requestObject['embossingName'] = requestData?.embossingName;
                    requestObject['mobileNumber'] = requestData?.mobileNumber;
                    requestObject['limit'] = requestData?.limit;
                    requestObject['limitCurrency'] = requestData?.currency;
                }
            }

            //GENERAL_SERVICE_USER_STATUS
            if (data.requestType === 'GENERAL_SERVICE_USER_STATUS') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['userStatus'] = requestData?.toggleToStatus;
                    requestObject['userName'] = requestData?.userName;
                    requestObject['userId'] = requestData?.userId;
                }
            }

            //GENERAL_SERVICE_BALANCE_CONFIRMATION
            if (data.requestType === 'GENERAL_SERVICE_BALANCE_CONFIRMATION') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['fromAccount'] = requestData?.debitAccountNumber;
                    requestObject['charges'] = requestData?.charge;
                    requestObject['chargeCurrency'] = requestData?.currency;
                    requestObject['description'] = requestData?.description;
                    requestObject['auditorAddress'] = requestData?.auditorAddress;
                    requestObject['auditorEmailId'] = requestData?.auditorEmailId;
                    requestObject['auditorName'] = requestData?.auditorName;
                    requestObject['faxNumber'] = requestData?.faxNumber;
                    requestObject['phoneNumber'] = requestData?.phoneNumber;
                    requestObject['requestDate'] = requestData?.requestDate;
                }
                if (data?.requestData?.hasOwnProperty('requestDetails')) {
                    const requestDetails = data.requestData.requestDetails;
                    requestObject['documentUploadDetails'] = {
                        customerFileName: requestDetails?.customerFileName,
                        fileType: requestDetails?.fileType,
                        id: requestDetails?.id,
                    };
                }
            }

            // GENERAL_SERVICE_DEPOSIT_CARD && DEBIT_CARD_REQUEST
            if (['GENERAL_SERVICE_DEPOSIT_CARD', 'DEBIT_CARD_REQUEST'].indexOf(data.requestType) !== -1) {
                if (data?.requestData?.externalCardRequestsMeta) {
                    const requestData = data?.requestData?.externalCardRequestsMeta;
                    requestObject.noOfDepositCards = requestData.noOfCards;
                    requestObject.fromAccount = requestData.linkCurrentAcc || requestData.linkSavingAcc;
                    requestObject.companyName = requestData.companyName;
                    requestObject.crExpiryDate = requestData.crExpiryDate;
                    requestObject.commRegNo = requestData.commRegNo;
                    let address: String[] = [];
                    if (requestData.addrLine1) address.push('Building No:' + ' ' + requestData.addrLine1);
                    if (requestData.addrLine2) address.push('Street No:' + ' ' + requestData.addrLine2);
                    if (requestData.addrLine3) address.push('Zone No:' + ' ' + requestData.addrLine3);
                    if (requestData.poBox) address.push('PO Box: ' + requestData.poBox);
                    requestObject.companyAddress = address.join(',');
                    requestData.externalCardRequestsMaster.forEach((transaction: any) => {
                        let tempObject: any = {};
                        tempObject['embossingName'] = transaction.embName;
                        tempObject['qatarId'] = transaction.qid;
                        tempObject['mobile'] = transaction.mobile;
                        requestObject.bulkPayments.push(tempObject);
                    });
                }
            }
            //GENERAL_SERVICE_FINANCE_REQUEST
            if (data.requestType === 'GENERAL_SERVICE_FINANCE_REQUEST') {
                if (data?.requestData?.hasOwnProperty('request')) {
                    const requestData = data.requestData.request;
                    requestObject['name'] = requestData?.name;
                    requestObject['amount'] = (requestData?.amount || '').toString().replace(/,/g, '');
                    requestObject['currency'] = requestData?.currency;
                    requestObject['comments'] = requestData?.comments;
                    requestObject['preferedTime'] =
                        requestData?.pfContactDate +
                        ', ' +
                        requestData?.pfContactTimeFrom +
                        ' - ' +
                        requestData?.pfContactTimeTo;
                    requestObject['mobileNumber'] = requestData?.contactNumber;
                }
            }

            if (
                [
                    'TRADEFINANCE_IMPORT_LC_SUBMIT',
                    'TRADEFINANCE_LC_AMEND_SUBMIT',
                    'BANK_GUARANTEE_AMMEND',
                    'BANK_GUARANTEE_SUBMIT',
                ].indexOf(data.requestType) !== -1
            ) {
                if (data?.requestData.thresholdExceeded === true) thresholdCount++;
            }
            this.hasThresholdDisclaimer = thresholdCount > 0;
            this.transactions.push(requestObject);
        });
    }

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    checkIfDisabled() {
        if (this.otp.length !== 6) return true;
        if (!this.isDisclaimerChecked) return true;
        if (this.mode === DECISION.REJECT && this.notes?.length === 0) return true;
        return false;
    }

    checkboxValueEvent(isChecked: boolean) {
        this.isDisclaimerChecked = isChecked;
    }
}
