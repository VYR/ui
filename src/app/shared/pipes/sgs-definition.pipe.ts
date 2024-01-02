import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sgsDefinition',
})
export class SGSDefinition implements PipeTransform {
    dataObj: any;
    config: any = {
        TENOR: [
            { id: '1M', label: '1 month' },
            { id: '3M', label: '3 months' },
            { id: '6M', label: '6 months' },
            { id: '12M', label: '1 year' },
            { id: '24M', label: '2 years' },
            { id: '36M', label: '3 years' },
            { id: '60M', label: '5 years' },
        ],
        PAYEE: [
            { id: 'WSGS', label: 'Within SGS' },
            { id: 'WQAR', label: 'Within Qatar' },
            { id: 'INTL', label: 'International' },
        ],
        UUID: [
            { id: 'CARDS', label: 'Cards' },
            { id: 'GENERAL_SERVICES', label: 'General Services' },
            { id: 'ACCOUNTS', label: 'Accounts' },
            { id: 'PAYMENT', label: 'Payments' },
            { id: 'TRANSFER', label: 'Transfers' },
            { id: 'STO', label: 'STO' },
            { id: 'LIQUIDITY_MANAGEMENT', label: 'Liquidity Mgmt' },
            { id: 'CHEQUE_MANAGEMENT', label: 'Cheque Mgmt' },
            { id: 'TRADE_FINANCE', label: 'Trade Finance' },
        ],
        PAYMENTS: [
            { id: 'OOREDOO', label: 'Ooredoo' },
            { id: 'KAHRAMAA', label: 'Kahramaa' },
            { id: 'DHAREEBA', label: 'Dhareeba' },
        ],
        REQUESTTYPE: [
            { id: '1,6,7,9,18,19,21', label: 'MY REQUEST' },
            { id: '1', label: 'CHEQUE BOOK REQUEST' },
            { id: '6', label: 'BALANCE CONFIRMATION REQUEST' },
            { id: '7', label: 'E-STATEMENT REQUEST' },
            { id: '9', label: 'SWIFT COPY REQUEST' },
            { id: '18', label: 'CREDIT CARD REQUEST' },
            { id: '19', label: 'SET USER STATUS' },
            { id: '20', label: 'CORPORATE DEPOSIT CARD REQUEST' },
            { id: '21', label: 'FINANCE REQUEST' },
        ],
        ACCOUNT_TYPE: [
            { id: 'C', label: 'CD' },
            { id: 'N', label: 'MTD' },
        ],
        DIVIDEND_STATUS: [
            { id: 'UNCLEARED', label: 'Uncleared' },
            { id: 'CLEARED', label: 'Cleared' },
        ],
        TRANSFER_TYPE: [
            { id: '1', label: 'Single Transfer' },
            { id: '2', label: 'Multiple Transfer' },
        ],
        TRANSFER_ENTRY: [
            { id: 'single', label: 'Single/Multiple Entries' },
            { id: 'bulk', label: 'Bulk File Upload' },
        ],
        USER_TYPES: [
            {
                label: 'Maker',
                id: 'role_user_maker',
            },
            {
                label: 'Approver',
                id: 'role_user_checker',
            },
            {
                label: 'Maker/Approver',
                id: 'role_user_maker_checker',
            },
            {
                label: 'Verifier',
                id: 'role_user_verifier',
            },
            {
                label: 'Viewer',
                id: 'role_user_viewer',
            },
        ],
        ADMIN_REQUEST_TYPES: [
            { id: 'USER_CREATE', label: 'Create User' },
            { id: 'USER_UPDATE', label: 'Update user' },
            { id: 'USER_UPDATE_DETAIL', label: 'Update User Details' },
            { id: 'USER_UPDATE_ENTITLEMENT', label: 'Update user Entitlements' },
            { id: 'USER_UPDATE_ROLE', label: 'Update User Role' },
            { id: 'USER_UPDATE_RIM', label: 'Update User RIM' },

            { id: 'GROUP_CREATE', label: 'Create Verifier/Approver Group' },
            { id: 'GROUP_UPDATE', label: 'Update Verifier/Approver Group' },
            { id: 'GROUP_DELETE', label: 'Delete Verifier/Approver Group' },
            { id: 'GROUP_USER_ADD', label: 'Add Users to Verifier/Approver Group' },
            { id: 'USER_DELETE_PROPS', label: 'Delete User from Verifier/Approver Group' },

            { id: 'USER_BUSINESS', label: 'Create Corporate Business Group' },
            { id: 'USER_UPDATE_BUSINESS_CUSTOMER', label: 'Add Customer to Corporate Business Group' },
            { id: 'USER_BUSINESS_CUSTOMER_DELETE', label: 'Delete Customer from Corporate Business Group' },
            { id: 'USER_BUSINESS_DELETE', label: 'Delete Corporate Business Group' },
            { id: 'POSITIVE_PAY_ADD_ACCOUNT', label: ' Add Positive Pay Account' },
            { id: 'H2H_ADD_CUSTOMER', label: ' Add Customer for H2H' },
            { id: 'H2H_UPDATE_CUSTOMER', label: ' Update Customer for H2H' },
            { id: 'ADMIN_DOCUMENT_UPLOAD', label: 'Register RIM and Document Upload' },
            { id: 'UPDATE_WORKFLOW_DEF', label: 'Update workflow definition with Group Matrix' },
            { id: 'USER_DEVICE_DEREGISTER', label: 'User Device Deregister' },
        ],
        LC_BG_STATUS: [
            { id: 'ALL', label: 'All' },
            { id: 'AWAITING_APPROVAL', label: 'Awaiting Approval' },
            { id: 'REVERTED', label: 'Reverted' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'MORE_INFO_REQ', label: 'More Info Required' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'UNDER_PROCESS', label: 'Under Process' },
            { id: 'ISSUED', label: 'Issued' },
            { id: 'DECLINED', label: 'Declined' },
            { id: 'CANCELED', label: 'Cancelled' },
        ],
        CARDS: [
            { id: 'CREDIT', label: 'Credit' },
            { id: 'DEBIT', label: 'Debit' },
            { id: 'PENDING_FOR_APPROVAL', label: 'Pending for Approval' },
        ],
    };
    constructor() {}
    public transform(value: any, args?: any): string {
        if (args) {
            this.dataObj = this.config[args].find((x: any) => x.id === value);
            return this.dataObj ? this.dataObj.label : value;
        } else return value;
    }
}
