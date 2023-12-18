import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { DECISION, REQUEST_LIST_TYPE, REQUEST_STATUS } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { UtilService } from 'src/app/utility';
import { DashboardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardSandbox {
    userContext!: UserContext;
    constructor(
        private service: DashboardService,
        private appContext: ApplicationContextService,
        private util: UtilService
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    getNetwoth() {
        let networth: any = {
            total: [
                {
                    key: 'assets',
                    label: 'Total Assets',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'liabilities',
                    label: 'Total Liabilities',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'overall',
                    label: 'Overall',
                    show: false,
                    total: 0,
                    currency: '',
                },
            ],
            assets: [
                {
                    key: 'currentAccounts',
                    label: 'Current Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'savings',
                    label: 'Savings Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'callAccounts',
                    label: 'Call Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'vostroAccounts',
                    label: 'Vostro Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'marginAccounts',
                    label: 'Margin Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'corporateAccounts',
                    label: 'Corporate Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'mudarabaAccounts',
                    label: 'Mudaraba Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'shadowAccounts',
                    label: 'Shadow Accounts',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'fixedDeposits',
                    label: 'Fixed Deposits',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'certificateOfDeposits',
                    label: 'Certificate Of Deposits',
                    show: false,
                    total: 0,
                    currency: '',
                },
            ],
            liabilities: [
                {
                    key: 'finance',
                    label: 'Finance',
                    show: false,
                    total: 0,
                    currency: '',
                },
                {
                    key: 'cards',
                    label: 'Cards',
                    show: false,
                    total: 0,
                    currency: '',
                },
            ],
        };
        const rimNumber = this.userContext.organizationSelected?.uniqueUserId || "2";
        return this.service.getNetwoth({ rimNumber }).pipe(
            map((res: any) => {
                const info = res.data[rimNumber];
                if (info) {
                    Object.getOwnPropertyNames(networth).forEach((type: string) => {
                        networth[type].forEach((category: any) => {
                            if (info.hasOwnProperty(category.key)) {
                                category.total = info[category.key].QAR.total;
                                category.currency = info[category.key].QAR.currency;
                                category.show = true;
                            }
                        });
                    });
                }
                return networth;
            })
        );
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.util.downloadFile(res, fileName, fileType);
                this.util.displayNotification(`File downloaded successfully.`, 'success');
            })
        );
    }

    getRequestList(query: any, status: REQUEST_STATUS, type: REQUEST_LIST_TYPE) {
        let request: any = {
            pageSize: query.pageSize,
            pageNumber: query.pageIndex,
            searchByID: query.searchByID,
            searchByType: query.searchByType,
            sortField: query.sortKey,
            sort: query.sortDirection,
        };
        if (status === REQUEST_STATUS.PENDING) request.fetchAll = query.fetchAll;
        const role: string = this.userContext.role?.name || '';
        return this.service.getRequestList(request, status, type, role.toUpperCase()).pipe(
            map((res: any) => {
                const response: any = {};
                if (res.data && res.data.content) {
                    res.data.content.forEach((x: any) => {
                        if (
                            [
                                'BANK_GUARANTEE_SUBMIT',
                                'BANK_GUARANTEE_AMMEND',
                                'TRADEFINANCE_IMPORT_LC_SUBMIT',
                                'TRADEFINANCE_LC_AMEND_SUBMIT',
                                'BULK_TRANSFER_SALARY_POSTING',
                            ].indexOf(x.requestType) !== -1
                        ) {
                            x.currency = x.requestData?.currency || 'QAR';
                            x.txnAmount = x.requestData?.amount || 0;
                        }
                        x.currentState = x.currentState.name;
                    });
                    response.data = res.data.content;
                    response.totalRecords = res.data.totalElements;
                }
                return response;
            })
        );
    }

    deleteRequest(request: any) {
        return this.service.deleteRequest(request.id).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    this.util.displayNotification(`Request ${request.cibRef} is deleted successfully!`, 'success');
                }
            })
        );
    }

    actOnRequest(request: any, decision: DECISION, mode: DECISION) {
        return this.service.actOnRequest(request).pipe(
            tap((res: any) => {
                if (res && res.status === 'SUCCESS') {
                    if (decision !== DECISION.VERIFY) {
                        this.util.displayNotification(
                            `Request${request.actionId.length > 1 ? 's are' : ' is'} ${
                                mode == DECISION.APPROVE ? 'Approved' : 'Rejected'
                            } successfully!`,
                            'success'
                        );
                    }
                }
            })
        );
    }

    getRequestCount() {
        const role: string = this.userContext.role.name;
        return this.service.getRequestCount(role.toUpperCase());
    }

    getMakerRequestCount() {
        return this.service.getMakerRequestCount();
    }

    getPendingReqHistory(params: any) {
        return this.service.getPendingReqHistory(params);
    }
}
