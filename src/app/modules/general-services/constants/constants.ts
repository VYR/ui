import { APP_ROUTES } from 'src/app/shared/enums/routes';

export const SERVICE_REQUEST_TYPES: Array<any> = [
    {
        uuid: '',
        name: 'All',
        type: '1,6,7,9,18,19,21',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/list',
        isMenu: true,
        popUpTitle: 'Service Request Summary',
        prefix: 'las la-list',
    },
    {
        uuid: 'GENERAL_SERVICE_CHEQUE_BOOK',
        name: 'Cheque Book',
        type: '1',
        responseKey: 'CHEQUE_BOOK_REQUEST',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/cheque-book',
        isMenu: true,
        popUpTitle: 'Chequebook Request Summary',
        isDropDown: true,
        prefix: 'las la-money-check',
    },
    {
        uuid: 'GENERAL_SERVICE_E_STATEMENT',
        name: 'e-Statement',
        type: '7',
        responseKey: 'E_STATEMENT',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/e-statement',
        isMenu: true,
        popUpTitle: 'e-Statement Request Summary',
        isDropDown: true,
        prefix: 'las la-file-alt',
    },
    {
        uuid: 'GENERAL_SERVICE_BALANCE_CONFIRMATION',
        name: 'Balance Confirmation',
        type: '6',
        responseKey: 'BALANCE_CONFIRMATION',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/balance-confirmation',
        isMenu: true,
        isDropDown: true,
        popUpTitle: 'Balance Confirmation Summary',
        prefix: 'las la-money-bill-wave',
    },
    {
        uuid: 'GENERAL_SERVICE_CHEQUE_IMAGE',
        name: 'Cheque Image',
        type: '2',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/cheque-image',
        isMenu: true,
        popUpTitle: 'CHEQUES LIST',
        prefix: 'las la-images',
    },
    {
        uuid: 'GENERAL_SERVICE_USER_STATUS',
        name: 'User Status',
        type: '19',
        responseKey: 'USER_STATUS',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/user-status',
        isMenu: true,
        popUpTitle: 'User Status Summary',
        isDropDown: true,
        prefix: 'las la-user-check',
    },
    {
        uuid: 'GENERAL_SERVICE_CREDIT_CARD',
        name: 'Credit Card',
        type: '18',
        responseKey: 'CREDIT_CARD_REQUEST',
        path: APP_ROUTES.GENERAL_SERVICES_LIST + '/credit-card',
        isDropDown: true,
        isMenu: true,
        popUpTitle: 'Credit Card Request Summary',
        prefix: 'las la-credit-card',
    },
    {
        uuid: 'GENERAL_SERVICE_DEPOSIT_CARD',
        name: 'Corporate Deposit Card',
        type: '3',
        path: APP_ROUTES.GENERAL_SERVICES + '/corporate-deposit-card',
        isMenu: true,
        prefix: 'las la-credit-card',
    },
    {
        uuid: 'LIST_DEBIT_CARD_REQUEST,DEBIT_CARD_REQUEST',
        name: 'Aamaly Debit Card',
        type: '36',
        path: APP_ROUTES.GENERAL_SERVICES + '/aamali-debit-card',
        isMenu: true,
        prefix: 'las la-credit-card',
    },
    {
        uuid: 'GENERAL_SERVICE_FINANCE_REQUEST',
        name: 'Open Finance',
        type: '21',
        responseKey: 'FINANCE_REQUEST',
        isMenu: false,
        isDropDown: true,
        popUpTitle: 'Finance Request Summary',
        prefix: 'las la-coins',
    },
];

export const SWIFT_COPY_TYPES: any = { TRANSFER: 'Transfer', LC: 'Letter of Credit', BG: 'Guarantee' };
