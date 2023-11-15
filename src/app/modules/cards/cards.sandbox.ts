import { Injectable } from '@angular/core';
import { CardsService } from './cards.service';
import { Observable, Subject, BehaviorSubject, forkJoin, map, tap } from 'rxjs';
import { UtilService } from 'src/app/utility/utility.service';
import { CARD_STATUS, DECISION, CARD_TYPES } from 'src/app/shared/enums';
import { CardDetails } from './model/cards.model';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Injectable({
    providedIn: 'root',
})
export class CardsSandbox {
    private unsubscribe$ = new Subject<void>();

    private _activeCreditCardDetails = new BehaviorSubject<CardDetails>(new CardDetails());
    public selectedCard: Observable<CardDetails>;

    private _accounts = new BehaviorSubject<any>([]);
    public accounts: Observable<any>;

    private _cardList = new BehaviorSubject<Array<CardDetails>>([]);
    public cardList: Observable<Array<CardDetails>>;

    CreditCardDetails: CardDetails = new CardDetails();

    userContext!: UserContext;
    termsFileName = 'Aamali-Debit-Card-Terms-And-Conditions';
    termsUrl = 'assets/content/cards/Terms.pdf';
    constructor(
        private service: CardsService,
        private utilService: UtilService,
        private appContext: ApplicationContextService
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
        this.selectedCard = this._activeCreditCardDetails.asObservable();
        this.cardList = this._cardList.asObservable();
        this.accounts = this._accounts.asObservable();
    }
    alloNumbersOnly(event: any) {
        let charCode = event.which ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

    restrictInputLength(event: any, length: number) {
        return event.target.value.length <= length;
    }

    getCategoryCodesAccounts() {
        return this.service.getCategoryCodesAccounts();
    }

    aamaliCardDocumentsUpload(payload: any) {
        return this.service.aamaliCardDocumentsUpload(payload);
    }
    getAccounts() {
        return this.service.getAccounts();
    }
    getCardsList(type: string) {
        return forkJoin([this.service.getCardsList(), this.service.getAccounts()]).pipe(
            map((res: any) => {
                let cards = [];
                if (res[0].status === 'SUCCESS' && res[1].data && res[0].data.products) {
                    cards = res[0].data.products.filter((obj: any) => {
                        obj.hasFullInfo = false;
                        obj.statusDesc = (obj.cardStatus || '').replaceAll(' ', '_').toLowerCase();
                        if (type === CARD_TYPES.DEBIT) {
                            return obj.cardType === CARD_TYPES.DEBIT;
                        } else {
                            return obj.cardType != CARD_TYPES.DEBIT && obj.cardType != 'NEW DEPOSIT CARD';
                        }
                    });
                }
                this._cardList.next(cards);
                this._accounts.next(res[1].data.accounts || []);
                return cards;
            })
        );
    }

    getDebitCardList() {
        return forkJoin([this.service.getDebitCardList(), this.service.getAccounts()]).pipe(
            map((res: any) => {
                let cards = [];
                if (res[0].status === 'SUCCESS' && res[1].data && res[0].data.products) {
                    cards = res[0].data.products.filter((obj: any) => {
                        obj.hasFullInfo = false;
                        obj.statusDesc = (obj.cardStatus || '').replaceAll(' ', '_').toLowerCase();
                        return obj.cardType === CARD_TYPES.DEBIT;
                    });
                }
                this._cardList.next(cards);
                this._accounts.next(res[1].data.accounts || []);
                return cards;
            })
        );
    }

    setActiveCard(card: any, index: number, type: string) {
        if (index === -1) return;
        card.position = index;
        let call;
        if (type === CARD_TYPES.CREDIT) {
            call = this.service.getCard({ cardNumber: card.cardNumberUnmasked });
        } else {
            call = this.service.getDebitCardDetails({ cardNumber: card.cardNumberUnmasked });
        }

        if (!card.hasFullInfo && index !== -1) {
            call.subscribe(
                (res: any) => {
                    card.hasFullInfo = true;
                    card.allowAction = res.data?.allowAction || false;
                    const cardRes = res.data?.cardDetails || res.data;
                    const updated = {
                        ...cardRes,
                        ...card,
                    };
                    this._updateCardList(updated, index);
                },
                (errors) => {
                    this.setActiveCard(new CardDetails(), -1, CARD_TYPES.DEBIT);
                    this.utilService.displayNotification(
                        'An Internal error has occured while processing your request.',
                        'error',
                        'Client Error'
                    );
                }
            );
        } else {
            this._activeCreditCardDetails.next(card);
        }
    }

    private _updateCardList(data: any, index: number) {
        data.statusDesc = (data.cardStatus || '').replaceAll(' ', '_').toLowerCase();
        this._activeCreditCardDetails.next(data);
        const list: Array<any> = this._cardList.value;
        list[index] = data;
        this._cardList.next(list);
    }

    modifyCardStatus(req: any, isDebit: boolean = false) {
        req.action = req.action.toLowerCase();
        let call;
        if (isDebit) {
            call = this.service.modifyDebitCardStatus(req);
        } else {
            call = this.service.modifyCardStatus(req);
        }
        return call.pipe(
            tap((res: any) => {
                if (res.status === 'SUCCESS') {
                    const card = this._activeCreditCardDetails.value;
                    let message;
                    if (req.action.toUpperCase() === DECISION.BLOCK) {
                        card.cardStatus = CARD_STATUS.BLOCKED;
                        message = 'Card is Blocked successfully!';
                    } else {
                        card.cardStatus = CARD_STATUS.ACTIVE;
                        message = 'Card is Activated successfully!';
                    }

                    this._updateCardList(card, card.position);
                    this.utilService.displayNotification(message, 'success');
                }
            })
        );
    }

    setCreditCardDetails(value: CardDetails) {
        this._activeCreditCardDetails.next(value);
    }

    getCardTransactions(queryParam: any) {
        return this.service.getCardTransactions(queryParam);
    }

    getCardMagstripe(queryParam: any) {
        return this.service.getCardMagstripe(queryParam);
    }

    getDebitCardMagneticStripe(queryParam: any) {
        return this.service.getDebitCardMagneticStripe(queryParam);
    }

    deactivateCardMagstripe(queryParam: any) {
        return this.service.deactivateCardMagstripe(queryParam);
    }

    deactivateDebitCardMagneticStripe(queryParam: any) {
        return this.service.deactivateDebitCardMagneticStripe(queryParam);
    }
    resetCardPIN(postParam: any) {
        return this.service.resetCardPIN(postParam);
    }

    getCountries() {
        return this.service.getCountries();
    }

    getTransactionsList(postParam: any) {
        return this.service.getTransactionsList(postParam);
    }

    makeSingleCardPayment(postParam: any) {
        return this.service.makeSingleCardPayment(postParam).pipe(
            tap((res: any) => {
                if (postParam.action === 'CONFIRM') {
                    this.utilService.displayNotification(
                        res.data.requestId
                            ? 'Card Payment request has been submitted successfully!'
                            : 'Payment request has been created successfully!',
                        'success'
                    );
                }
            })
        );
    }
    makeBulkCardPayment(postParam: any) {
        return this.service.makeBulkCardPayment(postParam);
    }
    downloadCardPDFStatement(postParam: any) {
        return this.service.downloadCardPDFStatement(postParam);
    }

    getAmaliHistory() {
        return this.service.getAmaliHistory();
    }

    saveAmaliCard(payload: any) {
        return this.service.saveAmaliCard(payload).pipe(tap((res: any) => {}));
    }

    debitCardApproval(payload: any) {
        return this.service.debitCardApproval(payload).pipe(tap((res: any) => {}));
    }

    uploadAmaliDocs(payload: any) {
        return this.service.uploadAmaliDocs(payload);
    }

    getApprovers() {
        return this.service.getApprovers();
    }

    getAmaliRequestCount(queryParam: any) {
        return this.service.getAmaliRequestCount(queryParam);
    }

    getCountry() {
        return this.service.getCountry();
    }

    downloadFile(queryParams: any, fileName: any, fileType: any) {
        return this.service.downloadFile(queryParams).pipe(
            tap((res: any) => {
                this.utilService.downloadFile(res, fileName, fileType);
                this.utilService.displayNotification(`File downloaded successfully.`, 'success');
            })
        );
    }
    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
