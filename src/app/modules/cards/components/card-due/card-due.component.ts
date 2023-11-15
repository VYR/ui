import { Component, OnInit } from '@angular/core';
import { CIBTableConfig } from 'src/app/cib-components/cib-table/models/config.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CardsSandbox } from '../../cards.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { CardPopupDetailsComponent } from '../card-popup-details/card-popup-details.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/utility';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-card-due',
    templateUrl: './card-due.component.html',
    styleUrls: ['./card-due.component.scss'],
})
export class CardDueComponent implements OnInit {
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'cardType',
                displayName: 'CARD TYPE',
                sortable: true,
            },
            {
                key: 'cardNumber',
                displayName: 'CARD NUMBER',
                sortable: true,
            },
            {
                key: 'currency',
                displayName: 'CURRENCY',
                sortable: true,
            },
            {
                key: 'outStandingAmt',
                displayName: 'DUE AMOUNT',
                sortable: true,
            },
        ],
        selection: true,
        totalRecords: 0,
        clientPagination: true,
        data: [],
    };
    outstandingCards = [];
    accountSelected: any;
    accounts: any = [];

    totalOutStAmt = 0;
    curncy = '';
    sortedData: any = [];
    selectedCardsToPay = [];
    cardDueForm: FormGroup = new FormGroup({});
    app_routes = APP_ROUTES;

    constructor(
        public fb: FormBuilder,
        private sandBox: CardsSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private utilService: UtilService
    ) {}
    ngOnInit(): void {
        this.cardDueForm = this.fb.group({
            fromAccount: [null, [Validators.required]],
        });

        this.sandBox.cardList.subscribe((res: any) => {
            this.outstandingCards = res.filter((x: any) => {
                if (x.outStandingAmt > 0) {
                    x.currency = 'QAR';
                    return true;
                }
                return false;
            });
            this.loadDataTable(this.outstandingCards);
        });
        this.sandBox.accounts.subscribe((res: any) => {
            this.accounts = res || [];
        });
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.outstandingCards = this.outstandingCards.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.outstandingCards);
        }
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onSelectCell(data: any) {
        let amount = 0;
        if (data.length > 0) {
            amount = 0;
            data.forEach((element: any) => {
                amount += Number.parseFloat(element.outStandingAmt);
            });
        }
        this.totalOutStAmt = amount;
        this.selectedCardsToPay = data;
    }

    selectFromAccount(acc: any) {
        this.accountSelected = acc;
    }

    public makePayment() {
        let transferData: any = [];
        this.selectedCardsToPay.forEach((element: any) => {
            let obj = {
                currency: this.accountSelected.currency,
                cardNumber: element.cardNumberUnmasked,
                cardNumberMasked: element.cardNumber,
                fromAccount: this.accountSelected.account_no,
                amount: element.outStandingAmt,
            };
            transferData.push(obj);
        });
        this.verifyPayment(transferData);
    }

    verifyPayment(transferData: any) {
        let postParams = {
            transferData: transferData,
            action: 'VERIFY',
            validateOTPRequest: {},
        };
        this.sandBox.makeBulkCardPayment(postParams).subscribe((response: any) => {
            this.openOtpPanel(transferData);
        });
    }

    openOtpPanel(transferData: any) {
        const payLoad = {
            type: 'bulkpayment',
            details: {
                cards: transferData,
                amount: this.totalOutStAmt,
                currency: this.accountSelected.currency,
            },
        };

        const ref = this.dialog.openDrawer('Bulk Payment Summary', CardPopupDetailsComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmPayment(transferData, result.otp);
            }
        });
    }
    confirmPayment(transferData: any, otp: any) {
        let postParams = {
            transferData: transferData,
            action: 'CONFIRM',
            validateOTPRequest: {
                softTokenUser: false,
                otp: otp,
            },
        };
        this.sandBox.makeBulkCardPayment(postParams).subscribe((response: any) => {
            if (response.data) {
                this.utilService.displayNotification(
                    response.data.requestId
                        ? 'Card Payment request submitted successfully!'
                        : 'Payment request has been created successfully!',
                    'success'
                );
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['home/cards/credit-cards/card-info']);
                });
            }
        });
    }
}
