import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(private http: ServerInteractionService) {}

    getSTOList(query: any) {
        let httpParams!: any;

        if (query.downloadtype && query.downloadtype.length > 0 && !query.parentReferenceId) {
            httpParams = new HttpParams()
                .set('pageSize', query.pageSize)
                .set('pageNumber', query.pageIndex)
                .set('downloadType', query.downloadtype);
        } else if (query.parentReferenceId && query.parentReferenceId.length > 0) {
            httpParams = new HttpParams()
                .set('pageSize', query.pageSize)
                .set('pageNumber', query.pageIndex)
                .set('parentReferenceId', query.parentReferenceId)
                .set('downloadType', query.downloadtype);
        } else {
            httpParams = new HttpParams()
                .set('pageSize', query.pageSize)
                .set('pageNumber', query.pageIndex)
                .set('sort', query.sortDirection || 'DESC')
                .set('sortField', query.sortKey || 'createdOn');
        }
        return this.http.get(Operations.GET_STO_LIST, httpParams);
    }

    getBulkTransferList(query: any) {
        let httpParams = new HttpParams()
            .set('fromDate', query.fromDate)
            .set('toDate', query.toDate)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'created');

        if (query.fileName.length > 0) {
            httpParams.set('fileName', query.fileName);
            httpParams = httpParams.append('fileName', query.fileName);
        }
        if (query.description.length > 0) {
            httpParams = httpParams.append('description', query.description);
        }
        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        return this.http.get(Operations.GET_BULK_TRANSFER_LIST, httpParams);
    }

    getBulkTransferDetails(id: any, downloadType?: any) {
        let httpParams = new HttpParams().set('id', id);

        if (downloadType) {
            httpParams = httpParams.append('downloadType', downloadType);
        }

        return this.http.get(Operations.GET_BULK_TRANSFER_DETAILS, httpParams);
    }

    getAccountHistory(downloadType?: any) {
        if (downloadType) {
            let httpParams = new HttpParams().set('downloadType', downloadType);
            return this.http.get(Operations.GET_ACCOUNT_HISTORY, httpParams);
        } else return this.http.get(Operations.GET_ACCOUNT_HISTORY);
    }

    getPositivePayHistory(downloadType?: any) {
        let httpParams = new HttpParams().set('pageNumber', '0').set('pageSize', '1000');
        if (downloadType) {
            httpParams = httpParams.append('downloadType', downloadType);
            return this.http.get(Operations.GET_POSITIVE_PAY_HISTORY, httpParams);
        } else return this.http.get(Operations.GET_POSITIVE_PAY_HISTORY, httpParams);
    }

    getAutoHistory(downloadType?: any) {
        let httpParams = new HttpParams().set('pageNumber', '0').set('pageSize', '1000');
        if (downloadType) {
            httpParams = httpParams.append('downloadType', downloadType);
            return this.http.get(Operations.GET_AUTO_HISTORY, httpParams);
        } else return this.http.get(Operations.GET_AUTO_HISTORY, httpParams);
    }

    getSweepHistory(downloadType?: any) {
        let httpParams = new HttpParams().set('pageNumber', '0').set('pageSize', '1000');
        if (downloadType) {
            httpParams = httpParams.append('downloadType', downloadType);
            return this.http.get(Operations.GET_SWEEP_HISTORY, httpParams);
        } else return this.http.get(Operations.GET_SWEEP_HISTORY, httpParams);
    }

    getPositivePay(query: any) {
        let httpParams = new HttpParams()
            .set('fromDate', query.fromDate)
            .set('toDate', query.toDate)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'created');

        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        if (query.chequeNumber && query.chequeNumber.length > 0) {
            httpParams = httpParams.append('chequeNumber', query.chequeNumber);
        }

        return this.http.get(Operations.GET_POSITIVE_PAY_LIST, httpParams);
    }

    getDividendList(query: any) {
        let httpParams = new HttpParams()
            .set('fromDate', query.fromDate)
            .set('toDate', query.toDate)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'recordId');

        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        if (query.nin && query.nin.length > 0) {
            httpParams = httpParams.append('nin', query.nin);
        }

        if (query.status && query.status.length > 0) {
            httpParams = httpParams.append('status', query.status);
        }

        if (query.mode && query.mode.length > 0) {
            httpParams = httpParams.append('type', query.mode);
        }

        if (query.qatarId && query.qatarId.length > 0) {
            httpParams = httpParams.append('qatarId', query.qatarId);
        }

        return this.http.get(Operations.GET_DIVIDEND_LIST, httpParams);
    }

    deleteFdp(req: any) {
        return this.http.post(Operations.DELETE_FDP, req);
    }

    getCurrencyList() {
        return this.http.get(Operations.GET_CURRENCY_LIST);
    }

    getTransferList(query: any) {
        let httpParams = new HttpParams()
            .set('fromDate', query.fromDate)
            .set('toDate', query.toDate)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'created');

        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        if (query.type && query.type.length > 0) {
            httpParams = httpParams.append('type', query.type);
        }

        if (query.beneficiaryName && query.beneficiaryName.length > 0) {
            httpParams = httpParams.append('beneficiaryName', query.beneficiaryName);
        }

        if (query.referenceNumber && query.referenceNumber.length > 0) {
            httpParams = httpParams.append('referenceNumber', query.referenceNumber);
        }
        if (query.currency && query.currency.length > 0) {
            httpParams = httpParams.append('currency', query.currency);
        }

        return this.http.get(Operations.GET_TRANSFER_LIST, httpParams);
    }

    searchSwiftCopies(postParams: any) {
        return this.http.post(Operations.SEARCH_SWIFT_COPIES, postParams);
    }

    getSwiftPdf(postParams: any) {
        return this.http.post(Operations.GET_SWIFT_PDF, postParams);
    }

    getSalaryPostingList(query: any) {
        let httpParams = new HttpParams()
            .set('fromDate', query.fromDate)
            .set('toDate', query.toDate)
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'loadDate');

        if (query.fileName.length > 0) {
            httpParams.set('fileName', query.fileName);
            httpParams = httpParams.append('fileName', query.fileName);
        }
        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        return this.http.get(Operations.GET_SALARY_POSTING_LIST, httpParams);
    }

    getSalaryPostingListEntries(query: any) {
        let httpParams = new HttpParams()
            .set('pageNumber', query.pageIndex)
            .set('pageSize', query.pageSize)
            .set('sort', query.sort || 'DESC')
            .set('sortField', query.sortField || 'valueDate');

        if (query.fileName.length > 0) {
            httpParams.set('fileName', query.fileName);
            httpParams = httpParams.append('fileName', query.fileName);
        }
        if (query.downloadType && query.downloadType.length > 0) {
            httpParams = httpParams.append('downloadType', query.downloadType);
        }

        return this.http.get(Operations.GET_SALARY_POSTING_LIST_ENTRIES, httpParams);
    }
}
