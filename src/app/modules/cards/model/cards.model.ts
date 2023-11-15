import { CARD_STATUS } from 'src/app/shared/enums';

export class CardDetails {
    public availableLimit!: string;
    public minDueAmt!: string;
    public availableCreditLimit!: string;
    public outstandingBal!: string;
    public cardNumber!: string;
    public expiryDate!: string;
    public cardName!: string;
    public cardBgImagePath!: string;
    public cardHolderName!: string;
    public cardLimit!: string;
    public lastPaidAmount!: number;
    public minimumDueAmount!: string;
    public outStandingAmt!: string;
    public cardType!: string;
    public statementDate!: string;
    public cardNature!: string;
    public cardStatus!: CARD_STATUS;
    public details!: any[];
    public image!: string;
    public currency!: string;
    public cardNumberUnmasked!: string;
    public color!: string;
    public showBulkPayment!: boolean;
    public hasFullInfo: boolean = false;
    public position: number = -1;
    public allowAction!: boolean;
    public isDebit: boolean = false;
    public linkedAccountNo!: string;
}
