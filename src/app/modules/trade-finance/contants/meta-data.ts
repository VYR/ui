export const PRODUCT_TYPES = [
    {
        id: 28003,
        name: 'Performance bond',
        code: 'LGPB',
    },
    {
        id: 28001,
        name: 'Tender Bond',
        code: 'LGTB',
    },
    {
        id: 28005,
        name: 'Advance Payment',
        code: 'LGAP',
    },
    {
        id: 28007,
        name: 'Retention Guarantee',
        code: 'LGRT',
    },
    {
        id: 28011,
        name: 'Payment Guarantee',
        code: 'LGPM1',
    },
    {
        id: 28009,
        name: 'Other Guarantee',
        code: 'LGOT',
    },
];

export const BANK_FORMATS = [
    {
        label: 'Bank format',
        value: 'Bank standard format',
    },
    {
        label: 'Customer format',
        value: 'Customer format',
    },
];

export const BANK_MARGINS = [
    {
        name: 'Cash Margin',
        value: 'Cash Margin',
    },
    {
        name: 'Existing Limits',
        value: 'Existing Limits',
    },
];

export const AMEND_GUARANTEE_AMOUNT = [
    {
        name: 'Increase Amount',
        value: 'principalAmountIncrease',
    },
    {
        name: 'Decrease Amount',
        value: 'principalAmountDecrease',
    },
];

export enum SCREEN_MODE_BG {
    CREATE_BG = 'Create_BG',
    AMEND_BG = 'Amend_BG',
}
