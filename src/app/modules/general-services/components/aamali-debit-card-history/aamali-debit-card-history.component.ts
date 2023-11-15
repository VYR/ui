import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColumnType, CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CardsSandbox } from '../../../cards/cards.sandbox';
import { AamaliDebitCardHistoryPopupComponent } from '../aamali-debit-card-history-popup/aamali-debit-card-history-popup.component';
import { AamaliDebitCardRequestConfirmationComponent } from '../aamali-debit-card-request-confirmation/aamali-debit-card-request-confirmation.component';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';

@Component({
    selector: 'app-aamali-debit-card-history',
    templateUrl: './aamali-debit-card-history.component.html',
    styleUrls: ['./aamali-debit-card-history.component.scss'],
})
export class AamaliDebitCardHistoryComponent implements OnInit {
    aamaliCardRequestList: any = [];
    columns = [
        {
            key: 'created',
            displayName: 'Date',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'requestId',
            displayName: 'Request Id',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'accInfo',
            displayName: 'Account Number',
            sortable: true,
        },
        {
            key: 'info7',
            displayName: 'Company Name',
            sortable: true,
        },
        {
            key: 'info8',
            displayName: 'CR Number',
            sortable: true,
        },
        {
            key: 'companyAddress',
            displayName: 'Company Address',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'Status',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'approve',
            displayName: 'Approve',
            type: ColumnType.approve,
            callBackFn: this.checkForAction,
        },
        {
            key: 'reject',
            displayName: 'Reject',
            type: ColumnType.reject,
            callBackFn: this.checkForAction,
        },
    ];
    config: CIBTableConfig = new CIBTableConfig();
    filterPipe = new CIBDefinition();
    @Output() closeHistory = new EventEmitter<string>();
    constructor(private sandbox: CardsSandbox, private dialog: CibDialogService) {}

    checkForAction(data: any) {
        return data.status === 'Pending for Approval' && data.loggedInUser === data.user.userId;
    }

    ngOnInit(): void {
        this.getHistory();
    }
    getHistory() {
        this.sandbox.getAmaliHistory().subscribe((res: any) => {
            let serviceReqList = res.data;
            const loggedInUser = this.sandbox.userContext.userId;
            serviceReqList.forEach((sr: any) => {
                let address: String[] = [];
                if (sr.info4) address.push('Building No:' + ' ' + sr.info4);
                if (sr.info5) address.push('Street No:' + ' ' + sr.info5);
                if (sr.info6) address.push('Zone No:' + ' ' + sr.info6);
                if (sr.poBoxNumber) address.push('PO Box: ' + sr.poBoxNumber);
                (sr.status = this.filterPipe.transform(sr.status, 'CARDS')), (sr.companyAddress = address.join(', '));
                sr['loggedInUser'] = loggedInUser;
                sr['accInfo'] = sr.info1 ? sr.info1 : sr.info2;
                sr['charges'] = sr?.charges || '';
                this.aamaliCardRequestList.push(sr);
            });
            this.aamaliCardRequestList = this.aamaliCardRequestList.sort((a: any, b: any) => {
                return b.created - a.created;
            });
            this.loadDataTable();
        });
    }
    loadDataTable() {
        this.config = {
            columns: this.columns,
            data: this.aamaliCardRequestList,
            selection: false,
            totalRecords: this.aamaliCardRequestList.length || 0,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.aamaliCardRequestList = this.aamaliCardRequestList.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'approve' || event.key === 'reject') {
            this.preparePayload(DECISION.VERIFY, event.key, event.data);
        } else {
            const ref = this.dialog.openDialog(CibDialogType.medium, AamaliDebitCardHistoryPopupComponent, event.data);
            ref.afterClosed().subscribe((res: any) => {});
        }
    }
    preparePayload(decision: any, action: string, body: any) {
        action = action.toUpperCase();
        let payload: any = {};
        payload = {
            externalCardRequestsMeta: {
                companyName: body.info7,
                commRegNo: body.info8,
                crExpiryDate: body.info10,
                linkSavingAcc: body.info2,
                linkCurrentAcc: body.info1,
                addrLine1: body.info4,
                addrLine2: body.info5,
                addrLine3: body.info6,
                noOfCards: 1,
                poBox: body.poBoxNumber,
                rim: body.customerNo,
                documentId: body.info9,
                rejectReason: 'NA',
                externalCardRequestsMaster: [
                    {
                        currentAccountNo: body.info1,
                        savingAccountNo: body.info2,
                        embName: body.embossingName,
                        qid: body.info3,
                        mobile: body.mobileNo,
                        failureReason: '',
                        cardNumber: '',
                        approverUserId: body.user.userId,
                    },
                ],
            },
            userAction: action,
            serviceRequestId: body.requestId,
            comments: '',
            charges: body.charges,
            action: decision,
        };
        let data = {
            ...payload.externalCardRequestsMeta,
            ...{
                action: payload.userAction,
                termsFileName: this.sandbox.termsFileName,
                termsUrl: this.sandbox.termsUrl,
            },
        };
        if (action === DECISION.REJECT) {
            payload = {
                externalCardRequestsMeta: null,
                userAction: action,
                serviceRequestId: body.requestId,
                action: decision,
                charges: body.charges,
            };
        }
        data.charges = payload.charges;
        this.submitRequest(decision, false, payload, data, '');
    }
    submitRequest(decision: any, isOTPReceived: boolean, payload: any, data: any, otp: any) {
        payload.validateOTPRequest = isOTPReceived ? { softTokenUser: false, otp: otp } : {};
        this.sandbox.debitCardApproval(payload).subscribe((res: any) => {
            if (res) {
                if (decision === DECISION.VERIFY) {
                    payload.action = DECISION.CONFIRM;
                    this.openPopup(payload, data);
                } else {
                    this.aamaliCardRequestList.length = 0;
                    this.getHistory();
                }
            }
        });
    }

    openPopup(payload: any, data: any) {
        const ref = this.dialog.openDrawer(
            'Aamaly Debit Card Request Summary',
            AamaliDebitCardRequestConfirmationComponent,
            data
        );
        ref.afterClosed().subscribe((result: any) => {
            if (payload.action == DECISION.CONFIRM && result.data?.otp) {
                if (payload.userAction === DECISION.REJECT) payload.comments = result.data.notes;
                this.submitRequest(DECISION.CONFIRM, true, payload, data, result.data.otp);
            }
        });
    }

    goBack() {
        this.closeHistory.emit();
    }
}
