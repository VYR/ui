import { ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';

export const BULK_UPLOAD_HEADER = [
    {
        key: 'Txn Type',
        displayName: 'Txn Type',
        mandatory: true,
        minWidth: 5,
    },
    {
        key: 'Debit Account Number',
        displayName: 'Debit Account Number',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Beneficiary Account or IBAN',
        displayName: 'Beneficiary Account or IBAN',
        mandatory: true,
        minWidth: 15,
    },
    {
        key: 'Beneficiary Name',
        displayName: 'Beneficiary Name',
        mandatory: true,
        minWidth: 15,
    },
    {
        key: 'Beneficiary Address Line 1',
        displayName: 'Beneficiary Address Line 1',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Town',
        displayName: 'Beneficiary Town',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Country',
        displayName: 'Beneficiary Country',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Bank Name',
        displayName: 'Beneficiary Bank Name',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Bank Country',
        displayName: 'Beneficiary Bank Country',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Beneficiary Bank Location',
        displayName: 'Beneficiary Bank Location',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Bank Address',
        displayName: 'Beneficiary Bank Address',
        minWidth: 10,
    },
    {
        key: 'Beneficiary Bank SWIFT CODE',
        displayName: 'Beneficiary Bank SWIFT CODE',
        mandatory: true,
        minWidth: 13,
    },
    {
        key: 'Clearing Code',
        displayName: 'Clearing Code',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Payment Date',
        displayName: 'Payment Date',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Payment Currency',
        displayName: 'Payment Currency',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Payment Amount',
        displayName: 'Payment Amount',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Charge Type',
        displayName: 'Charge Type',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Purpose of Payment',
        displayName: 'Purpose of Payment',
        mandatory: true,
        minWidth: 10,
    },
    {
        key: 'Customer Reference',
        displayName: 'Customer Reference',
        mandatory: true,
        minWidth: 15,
    },
    {
        key: 'Exchange Rate',
        displayName: 'Exchange Rate',
        minWidth: 10,
    },
    {
        key: 'Relation with Remitter',
        displayName: 'Relation with Remitter',
        minWidth: 10,
    },
    {
        key: 'Source Of Income',
        displayName: 'Source Of Income',
        minWidth: 10,
    },
    {
        key: 'fileName',
        displayName: 'File Name',
        minWidth: 10,
    },
];

export const BULK_TRANSFER_DRAFTS_HEADER = [
    {
        key: 'date',
        displayName: 'Created Date',
        type: ColumnType.date,
    },
    {
        key: 'fileName',
        displayName: 'File',
    },
    {
        key: 'currency',
        displayName: 'Currency',
    },
    {
        key: 'totalValue',
        displayName: 'Amount',
        type: ColumnType.amount,
    },
    {
        key: 'edit',
        displayName: 'Edit',
        type: ColumnType.icon,
        icon: 'la-edit',
        UUID: 'TRANSFER_UPDATE_DRAFT',
    },
    {
        key: 'delete',
        displayName: 'Delete',
        type: ColumnType.icon,
        icon: 'la-trash-alt',
        UUID: 'TRANSFER_DELETE_DRAFT',
    },
];

export const FILE_TYPES = [
    {
        val: 1,
        label: 'Custom File',
    },
    {
        val: 2,
        label: 'Swift 101 File',
    },
    {
        val: 3,
        label: 'Swift 103 File',
    },
    {
        val: 4,
        label: 'Qatch File',
    },
];

export const BULK_KYC_UPLOAD_HEADER = [
    {
        key: 'rimnumber',
        displayName: 'CUSTOMER NO',
        mandatory: true,
        minWidth: 25,
    },
    {
        key: 'kycStatus',
        displayName: 'KYC STATUS',
        mandatory: true,
        minWidth: 20,
    },
    {
        key: 'popType',
        displayName: 'POPUP TYPE',
        mandatory: true,
        minWidth: 20,
    },
];
export const SALARY_POSTING_HEADER = [
    {
        key: 'debitAccountNumber',
        displayName: SALARY_POSTING_COLUMNS.DR_AC,
        sortable: false,
    },
    {
        key: 'currency',
        displayName: SALARY_POSTING_COLUMNS.CURRENCY,
        sortable: false,
    },
    {
        key: 'amount',
        displayName: SALARY_POSTING_COLUMNS.AMOUNT,
        sortable: false,
        type: ColumnType.amount,
    },
    {
        key: 'creditAccountNo',
        displayName: SALARY_POSTING_COLUMNS.CR_AC,
        sortable: false,
    },
    {
        key: 'creditName',
        displayName: SALARY_POSTING_COLUMNS.CR_NAME,
        sortable: false,
    },
    {
        key: 'refNo',
        displayName: SALARY_POSTING_COLUMNS.REF_NO,
        sortable: false,
    },
    {
        key: 'statusDesc',
        displayName: SALARY_POSTING_COLUMNS.REMARK,
        sortable: false,
    },
];
