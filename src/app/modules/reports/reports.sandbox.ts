import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { UtilService } from 'src/app/utility';
import { ReportsService } from './reports.service';
import { ApplicationContextService } from '../../shared/services/application-context.service';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ReportsSandbox {
    public accountList: any = [];
    constructor(
        private service: ReportsService,
        private utilService: UtilService,
        private as: ApplicationContextService
    ) {}

    filterPipe = new CIBDefinition();

    getSTOListExcel(query: any) {
        return this.service.getSTOList(query).subscribe((res: any) => {
            if (res.data.content) {
                this.utilService.exportAsExcelFile(
                    this.formatDataForExcel(res.data.content || []),
                    'FUTURE_DATED_TRANSFERS_EXTRACT'
                );
                this.utilService.displayNotification('Excel generated successfully!', 'success');
            }
        });
    }

    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['CREATED ON'] = ele.createdOn;
            tempObject['REFERENCE ID'] = ele.parentFDP;
            tempObject['STATUS'] = ele.status;
            tempObject['TYPE'] = ele.payeeType;
            tempObject['CURRENCY'] = ele.benefCurrency;
            tempObject['AMOUNT'] = ele.amount;
            tempObject['FROM ACCOUNT'] = ele.fromAccount;
            tempObject['TO ACCOUNT'] = ele.toAccount;
            tempObject['FREQUENCY'] = ele.frequencySet;
            tempObject['OCCURANCE'] = ele.occurence;
            tempObject['NEXT EXECUTION'] = ele.nextExecDate;
            tempObject['CUSTOMER REFERENCE'] = ele.purposeCustRef;
            tempObject['NOTE'] = ele.fxTransaction ? this.as.getFXDisclaimer() : '';
            temp.push(tempObject);
        });
        return temp;
    }

    getSTOList(query: any) {
        if (query.downloadtype && query.downloadtype.length > 0 && !query.parentReferenceId) {
            return this.service.getSTOList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'FUTURE_DATED_TRANSFERS_EXTRACT');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        } else if (query.parentReferenceId && query.parentReferenceId.length > 0) {
            return this.service.getSTOList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'FUTURE_DATED_TRANSFERS_EXTRACT');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.getSTOList(query);
    }

    getSTOPaymentListPDF(query: any) {
        this.service.getSTOList(query).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'FUTURE_DATED_TRANSFERS_EXTRACT');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    getAccountHistory(downloadType?: any) {
        if (!downloadType) {
            return this.service.getAccountHistory();
        } else {
            return this.service.getAccountHistory(downloadType).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'ACCOUNT_HISTORY_EXTRACT');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getPositivePayHistory(downloadType?: any) {
        if (!downloadType) {
            return this.service.getPositivePayHistory();
        } else if (downloadType && downloadType === 'excel') {
            return this.service.getPositivePayHistory().pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatPositivePayHistoryForExcel(res.data || []),
                            'POSITIVE_PAY_HISTORY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else {
            return this.service.getPositivePayHistory(downloadType).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'POSITIVE_PAY_HISTORY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getAutoCoverHistory(downloadType?: any) {
        if (!downloadType) {
            return this.service.getAutoHistory();
        } else if (downloadType && downloadType === 'excel') {
            return this.service.getAutoHistory().pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatAutoCoverHistoryForExcel(res.data || []),
                            'AUTO_COVER_HISTORY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else {
            return this.service.getAutoHistory(downloadType).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'AUTO_COVER_HISTORY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getSweepHistory(downloadType?: any) {
        if (!downloadType) {
            return this.service.getSweepHistory();
        } else if (downloadType && downloadType === 'excel') {
            return this.service.getSweepHistory().pipe(
                tap((response: any) => {
                    if (response.data && response.data.length > 0) {
                        response.data.forEach((resp: any) => {
                            resp.fromAccount = resp.requestData?.fromAccount;
                            resp.toAccount = resp.requestData?.toAccount;
                            resp.currency = resp.requestData?.currency;
                            resp.amount = resp.requestData?.amount;
                        });

                        this.utilService.exportAsExcelFile(
                            this.formatSweepHistoryForExcel(response.data || []),
                            'SWEEP_BALANCE_HISTORY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else {
            return this.service.getSweepHistory(downloadType).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'SWEEP_BALANCE_HISTORY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getBulkTransferList(query: any) {
        return this.service.getBulkTransferList(query);
    }

    getBulkTransferDetails(id: any) {
        return this.service.getBulkTransferDetails(id);
    }

    getBulkTransferDetailsPdf(id: any, downloadType: any) {
        this.service.getBulkTransferDetails(id, downloadType).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'BULK_TRANSFER_EXTRACT');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }

    getAccountHistoryExcel() {
        return this.service.getAccountHistory().subscribe((res: any) => {
            if (res.data) {
                this.utilService.exportAsExcelFile(
                    this.formatAccountDataForExcel(res.data || []),
                    'ACCOUNT_CREATION_HISTORY'
                );
                this.utilService.displayNotification('Excel generated successfully!', 'success');
            }
        });
    }

    formatAccountDataForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp = {
                created: moment(res.created).format('YYYY-MM-DD hh:mm A'),
                account: res.requestData.debitAccountNumber,
                currency: res.requestData.currency,
                amount: res.requestData.principalAmount,
                tenor: this.filterPipe.transform(res.requestData.tenor, 'TENOR'),
                rate: res.requestData.expectedProfitRate + '%',
                type: this.filterPipe.transform(res.requestData.type, 'ACCOUNT_TYPE'),
                status: res.status,
                reason: res.responseData.acctountId,
            };
            temps.push(temp);
        });
        return temps;
    }

    formatPositivePayHistoryForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['Date'] = moment(res.created).format('YYYY-MM-DD hh:mm A');
            temp['Account Number'] = res.accountNo;
            temp['Cheque Number'] = res.chequeNum;
            temp['Currency'] = res.currencyCode;
            temp['Amount'] = res.amount;
            temp['Cheque Date'] = moment(res.chequeIssueDate).format('YYYY-MM-DD hh:mm A');
            temp['Status'] = res.status;
            temp['Type'] = res.type;
            temp['Reason'] = res.statusDesc;
            temps.push(temp);
        });
        return temps;
    }

    formatAutoCoverHistoryForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['Date'] = moment(res.created).format('YYYY-MM-DD hh:mm A');
            temp['Cover Account'] = res.linkedAccountId;
            temp['Transaction Account'] = res.accountId;
            temp['Status'] = res.status;
            temp['Reason'] = res.statusDesc;
            temps.push(temp);
        });
        return temps;
    }

    formatSweepHistoryForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['Date'] = moment(res.created).format('YYYY-MM-DD hh:mm A');
            temp['From Account'] = res.fromAccount;
            temp['To Account'] = res.toAccount;
            temp['Currency'] = res.currency;
            temp['Threshold Amount'] = res.amount;
            temp['Action'] = res.action;
            temp['Status'] = res.status;
            temp['Reason'] = res.statusDesc;
            temps.push(temp);
        });
        return temps;
    }

    formatPositivePayDataForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['POSITIVE PAY UPLOAD DATE'] = moment(res.created).format('YYYY-MM-DD hh:mm A');
            temp['POSITIVE PAY ACCOUNT NUMBER'] = res.accountNo;
            temp['CHEQUE NUMBER'] = res.chequeNum;
            temp['CURRENCY'] = res.currencyCode;
            temp['CHEQUE AMOUNT'] = res.amount;
            temp['CHEQUE ISSUE DATE'] = res.formattedChequeDate;
            temp['TYPE'] = this.filterPipe.transform(res.type, 'TRANSFER_ENTRY');
            temps.push(temp);
        });
        return temps;
    }

    formatDividendPayDataForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['DIVIDEND PAYMENT DATE'] = moment(res.date).format('YYYY-MM-DD hh:mm A');
            temp['QATAR ID'] = res.qid;
            temp['NIN NUMBER'] = res.ninNo;
            temp['AMOUNT'] = res.amount;
            temp['BENEFICIARY ACCOUNT NO.'] = res.benAccountNumber;
            temp['STATUS'] = res.status;
            temp['TRANSACTION REF NO.'] = res.txnRef;
            temp['TYPE'] = res.type;
            temp['MODE'] = res.mode;
            temp['CLEARED DATE'] = moment(res.clearDate).format('YYYY-MM-DD hh:mm A');

            temps.push(temp);
        });
        return temps;
    }

    formatTransferDataForExcel(data: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            temp['DATE'] = moment(res.created).format('YYYY-MM-DD hh:mm A');
            temp['REFERENCE NUMBER'] = res.ftRef;
            temp['TYPE'] = res.payeeType;
            temp['REQUEST ID'] = res.requestId;
            temp['FROM ACCOUNT'] = res.fromAccount;
            temp['TO ACCOUNT'] = res.toAccount;
            temp['CURRENCY'] = res.currency;
            temp['AMOUNT'] = res.amount;
            temp['STATUS'] = res.status;
            temp['NOTE'] = res.fxTransaction ? this.as.getFXDisclaimer() : '';
            temps.push(temp);
        });
        return temps;
    }

    getPositivePay(query: any, excel?: any) {
        if (excel) {
            return this.service.getPositivePay(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.content.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatPositivePayDataForExcel(res.data.content || []),
                            'POSITIVE_PAY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else if (!query.downloadType) {
            return this.service.getPositivePay(query);
        } else {
            return this.service.getPositivePay(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'POSITIVE_PAY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    deleteFdp(req: any) {
        return this.service.deleteFdp(req).pipe(
            tap((res: any) => {
                if (res) {
                    this.utilService.displayNotification('STO has been deleted successfully !', 'success');
                }
            })
        );
    }

    getDividendList(query: any, excel?: any) {
        if (excel) {
            return this.service.getDividendList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.content.length > 0) {
                        this.utilService.exportAsExcelFile(
                            this.formatDividendPayDataForExcel(res.data.content || []),
                            'DIVIDEND_PAY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else if (!query.downloadType) {
            return this.service.getDividendList(query);
        } else {
            return this.service.getDividendList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'DIVIDEND_PAY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getTransferList(query: any, excel?: any) {
        if (excel) {
            return this.service.getTransferList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.content.length > 0) {
                        res.data.content.forEach((resp: any) => {
                            resp.requestId = resp.request?.cibRef;
                            if (
                                resp.beneficiaryId?.acccountHolderName &&
                                resp.beneficiaryId?.acccountHolderName.length > 0
                            )
                                resp.toAccount = resp.toAccount + '-' + resp.beneficiaryId?.acccountHolderName;

                            resp.payeeType = this.filterPipe.transform(resp.payeeType, 'PAYEE');
                        });

                        this.utilService.exportAsExcelFile(
                            this.formatTransferDataForExcel(res.data.content || []),
                            'TRANSFER_HISTORY'
                        );
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else if (!query.downloadType) {
            return this.service.getTransferList(query);
        } else {
            return this.service.getTransferList(query).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.utilService.downloadPdf(res.data, 'TRANSFER_HISTORY');
                        this.utilService.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        }
    }

    getCurrencyList() {
        return this.service.getCurrencyList();
    }

    searchSwiftCopies(postParams: any) {
        return this.service.searchSwiftCopies(postParams);
    }

    getSwiftPdf(queryParams: any) {
        return this.service.getSwiftPdf(queryParams);
    }

    getSalaryPostingList(query: any) {
        return this.service.getSalaryPostingList(query);
    }

    getSalaryPostingListEntries(query: any) {
        return this.service.getSalaryPostingListEntries(query);
    }

    formatSalaryPostingResponse(spList: Array<any>) {
        spList.forEach((ele: any) => {
            ele.currency = 'QAR';
            ele.creditAccountNo = ele.creditIbanNo;
            ele.refNo = '';
            ele.statusDesc = '';
            ele.txnStatus = '';
            if (ele.status) {
                if (ele.status?.toUpperCase() === 'SUCCESS') {
                    ele.txnStatus = 'SUCCESS';
                    ele.refNo = ele.ifx_reference_no || '';
                } else {
                    console.log(ele.status);
                    ele.statusDesc = ele.status.split('-')[2];
                    console.log(ele.status.split('-')[2]);
                    ele.txnStatus = 'FAILED';
                }
            } else {
                ele.txnStatus = 'PENDING';
            }
        });
        return spList;
    }
}
