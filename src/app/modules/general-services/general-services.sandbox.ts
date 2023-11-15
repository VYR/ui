import { Injectable, OnDestroy } from '@angular/core';
import { GeneralServicesService } from './general-services.service';
import { Observable, Subject, BehaviorSubject, forkJoin, tap, map, catchError, throwError } from 'rxjs';
import { UtilService } from 'src/app/utility/utility.service';
import * as moment from 'moment';
import { ApplicationContextService } from '../../shared/services/application-context.service';
import { CacheService } from 'src/app/cache/cache.service';
@Injectable({
    providedIn: 'root',
})
export class GeneralServicesSandbox implements OnDestroy {
    private unsubscribe$ = new Subject<void>();
    private _accounts = new BehaviorSubject<Array<any>>([]);
    private _requestsTableData = new BehaviorSubject<any>(null);
    public accounts: Observable<Array<any>>;
    public requestsTableData: Observable<any>;
    public currentUser: any;
    public channelsList: any = ['cardsRequested', 'cibPendingCardsRequested', 'primeCardsRequested'];
    constructor(
        private service: GeneralServicesService,
        private utilService: UtilService,
        private appContext: ApplicationContextService,
        private cache: CacheService
    ) {
        this.accounts = this._accounts.asObservable();
        this.requestsTableData = this._requestsTableData.asObservable();
        this.appContext.currentUser.subscribe((res: any) => {
            this.currentUser = res;
        });
    }

    getDataOnPageLoad() {
        return forkJoin([this.service.getAccounts(), this.service.getCategoryCodesAccounts()]).pipe(
            tap((res: any) => {
                if (res[0].data && res[1].data) {
                    const accounts = this.filterOnlyAccountlist(res[1].data.transactionAccounts, res[0].data.accounts);
                    this._setAccounts(accounts);
                }
            })
        );
    }

    private _getAccounts() {
        if (this._accounts.value && this._accounts.value.length) return this._accounts.value;
        return JSON.parse(this.cache.get('ACCOUNTS') || []);
    }

    private _setAccounts(data: any) {
        this.cache.set('ACCOUNTS', JSON.stringify(data));
        this._accounts.next(data);
    }

    getAccountListFiltered(validCur: Array<any>, validAcc: Array<any>): Observable<any> {
        return new Observable((subscribe) => {
            const accounts = this._getAccounts().filter((al: any) => {
                return (
                    ((validCur.length > 0 && validCur.indexOf(al.currency) !== -1) ||
                        (validCur.length == 0 && validCur.indexOf(al.currency) === -1)) &&
                    validAcc.indexOf(al.category.description) !== -1
                );
            });
            subscribe.next(this._parseAccounts(accounts));
        });
    }

    getChequeBookCharges(queryParam: any) {
        return this.service.getChequeBookCharges(queryParam);
    }

    chequeImages(queryParam: any) {
        return this.service.chequeImages(queryParam);
    }

    getUserStatusDetails() {
        return this.service.getUserStatusDetails();
    }

    sendChequeBookRequest(postParams: any) {
        return this.service.sendChequeBookRequest(postParams);
    }

    sendEStatementRequest(postParams: any) {
        return this.service.sendEStatementRequest(postParams);
    }

    getCurrencyList() {
        return this.service.getCurrencyList();
    }
    requestUserStatus(postParams: any) {
        return this.service.requestUserStatus(postParams);
    }

    balConfFileUpload(postParams: any) {
        return this.service.balConfFileUpload(postParams);
    }

    sendBalanceConfirmationRequest(postParams: any) {
        return this.service.sendBalanceConfirmationRequest(postParams);
    }
    getBalanceConfirmationCharges(params: any) {
        return this.service.getBalanceConfirmationCharges(params);
    }

    sendCreditCardRequest(postParams: any) {
        return this.service.sendCreditCardRequest(postParams);
    }
    getCategoryCodesAccounts() {
        return this.service.getCategoryCodesAccounts();
    }

    getRequests(queryParam: any) {
        return this.service.getRequests(queryParam).pipe(tap((res: any) => {}));
    }
    getFileSize(size: any, type: any) {
        let updatedSize = size;
        switch (type.toLowerCase()) {
            case 'kb':
                updatedSize = (size / 1024).toFixed(2);
                break;
            case 'mb':
                updatedSize = (size / (1024 * 1024)).toFixed(2);
                break;
            case 'gb':
                updatedSize = (size / (1024 * 1024 * 1024)).toFixed(2);
                break;
            case 'tb':
                updatedSize = (size / (1024 * 1024 * 1024 * 1024)).toFixed(2);
                break;
        }
        return updatedSize;
    }
    getFileExtension(fileName: any) {
        return fileName.substr(fileName.lastIndexOf('.') + 1);
    }

    isFileTypeAllowed(fileName: any, types: Array<any>) {
        types = types.map((type: any) => {
            return type.toLowerCase();
        });
        return types.includes(this.getFileExtension(fileName).toLowerCase());
    }

    isFileSizeAllowed(size: any, allowedSize: any, type: any) {
        return this.getFileSize(size, type) <= allowedSize;
    }

    generateExcelData(data: any) {
        this.utilService.exportAsExcelFile(this.formatDataForExcel(data || []), 'SERVICE_REQUEST_REPORT');
        this.utilService.displayNotification('Report generated successfully!', 'success');
    }

    sortData(data: any) {
        return data.sort((a: any, b: any) => {
            return b.requestDateTime - a.requestDateTime;
        });
    }

    filterOnlyAccountlist(codes: Array<any>, accounts: Array<any>) {
        return accounts.filter((al: any) => {
            return codes.indexOf(al.category.transactionRef) !== -1;
        });
    }

    private _parseAccounts(accounts: Array<any>) {
        accounts.map((x: any) => {
            x.balance = x.available_bal;
            x.accountNumber = x.account_no;
            x.description = (x.category && x.category.description) || x.nickName;
        });
        return accounts;
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    formatDataForExcel(excelList: any) {
        let customizedData: any = [];
        excelList.forEach((value: any) => {
            var tempObject: any = {};
            tempObject.DATE = moment(value.requestDateTime).format('DD-MM-YYYY HH:mm:ss');
            tempObject.REQUEST_ID = value.requestId;
            tempObject.DESCRIPTION = value.requestDescription;
            tempObject.STATUS = value.status;
            customizedData.push(tempObject);
        });
        return customizedData;
    }

    _getDepositCardHistory() {
        return this.service._getDepositCardHistory();
    }

    getDepositCardList() {
        let cardsRequested = 0;
        let accountNumber = '';
        let qids: any = [];
        const limitReached: boolean = true;
        return this.service.getDepositCardList().pipe(
            map(
                (res: any) => {
                    let data = res.data;
                    this.channelsList.forEach((channel: any) => {
                        if (data.hasOwnProperty(channel)) {
                            cardsRequested += data[channel];
                        }
                    });
                    if (data.serviceRequests.length > 0) {
                        const req = data.serviceRequests[0];
                        const currentAccount = req.info1.replace('Current Account : ', '');
                        const savingsAccount = req.info1.replace('Saving Account : ', '');
                        accountNumber = currentAccount === 'null' ? savingsAccount : currentAccount;
                        qids = data.serviceRequests.map((x: any) => x.info3.replace('QID : ', ''));
                    } else {
                        if (data.hasOwnProperty('currentAccountNumber')) {
                            accountNumber = data.currentAccountNumber;
                        }
                        if (data.hasOwnProperty('savingsAccountNumber')) {
                            accountNumber = data.savingsAccountNumber;
                        }
                    }

                    if (cardsRequested >= 20) {
                        return {
                            limitReached,
                        };
                    } else
                        return {
                            cardsRequested,
                            accountNumber,
                            qids,
                        };
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    getCaseAccounts(accountNo?: any) {
        return this.service.getAccounts().pipe(
            map(
                (res: any) => {
                    let accountList: any = [];
                    res.data.accounts.forEach((x: any) => {
                        if (['6050', '6060', '1050', '1070'].includes(x.category.transactionRef)) {
                            x.type = ['6050', '6060'].includes(x.category.transactionRef) ? 'SA' : 'CA';
                            accountList.push(x);
                        }
                    });

                    if (accountNo) {
                        const index = accountList.findIndex((acc: any) => acc.account_no === accountNo);
                        return {
                            accountList,
                            selectedaccount: index !== -1 ? accountList[index] : {},
                            hasAccountSelected: index !== -1,
                        };
                    } else {
                        const index = accountList.findIndex((acc: any) => acc.account_no === accountNo);
                        return {
                            accountList,
                            selectedaccount: false,
                            hasAccountSelected: false,
                        };
                    }
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    saveDepositCards(payload: any) {
        return this.service.saveDepositCards(payload);
    }

    depositCardDocumentsUpload(payload: any) {
        return this.service.depositCardDocumentsUpload(payload);
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.utilService.downloadFile(res, fileName, fileType);
                this.utilService.displayNotification(`File generated successfully.`, 'success');
            })
        );
    }

    public ngOnDestroy() {
        this.cache.remove('ACCOUNTS');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
