export enum ROLE_NAME {
    USER = 'USER',
    ADMIN = 'ADMIN',
    DEALER = 'DEALER',
    ROLE_USER_CHECKER = 'ROLE_USER_CHECKER',
    ROLE_USER_VIEWER = 'ROLE_USER_VIEWER',
    ROLE_USER_MAKER_CHECKER = 'ROLE_USER_MAKER_CHECKER',
    ROLE_USER_VERIFIER = 'ROLE_USER_VERIFIER',
}

export enum REQUEST_LIST_TYPE {
    MY_QUEUE = 'MY_QUEUE',
    MAKER_COMPLETED = 'MAKER_COMPLETED',
    APPROVER_COMPLETED = 'APPROVER_COMPLETED',
    ACTION_PENDING = 'ACTION_PENDING',
    CHEQUE_BOOK = 1,
    CHEQUE_BOOK_KEY = 'CHEQUE_BOOK_REQUEST',
    E_STATEMENT = 7,
    E_STATEMENT_KEY = 'E_STATEMENT',
    BALANCE_CONFIRMATION = 6,
    BALANCE_CONFIRMATION_KEY = 'BALANCE_CONFIRMATION',
    SWIFT_COPIES = 9,
    SWIFT_COPIES_KEY = 'SWIFT_COPIES',
    USER_STATUS = 19,
    USER_STATUS_KEY = 'USER_STATUS',
    OPEN_FINANCE_REQUEST = 21,
    OPEN_FINANCE_REQUEST_KEY = 'FINANCE_REQUEST',
    CREDIT_CARDS = 18,
    CREDIT_CARDS_KEY = 'CREDIT_CARD_REQUEST',
    CHEQUE_IMAGE = 2,
    CORPORATE_DEPOSIT_CARD = 3,
    ALL_GENERAL_SERVICES = '1,6,7,9,18,19,21',
}

export enum REQUEST_STATUS {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    ALL = 'All',
}

export enum CONFIG {
    BALANCE_CNF_CHARGES_DESCRIPTION = 'Balance Confirmation - Auditor',
    BALANCE_CNF_CHARGES_CODE = 'BCACAD',
}

export enum DECISION {
    CONFIRM = 'CONFIRM',
    APPROVE = 'APPROVE',
    VERIFY = 'VERIFY',
    REJECT = 'REJECT',
    CANCEL = 'CANCEL',
    VIEW = 'VIEW',
    DELETE = 'DELETE',
    ADD = 'ADD',
    SUCCESS = 'SUCCESS',
    ACTIVATE = 'ACTIVATE',
    BLOCK = 'BLOCK',
}

export enum STO_TYPE {
    WSGS = 'WSGS',
    WQAR = 'WQAR',
    INTL = 'INTL',
}

export enum STO_RECURRING {
    ONETIME = 'ONETIME',
    RECURRING = 'RECURRING',
}

export enum CARD_STATUS {
    NEW = 'NEW',
    BLOCKED = 'Blocked',
    ACTIVE = 'Active',
    PAYMENT_OVERDUE = 'Payment Overdue',
}

export enum CARD_TYPES {
    CREDIT = 'Credit',
    DEBIT = 'Debit',
}

export enum SYSTEM_CONFIG {
    BACK_DATE = 'sgs.backdated.allowed.approval.days',
    FX_DISCLAIMER = 'sgs.showFx',
}

export enum USER_TYPE {
    SCHEME_MEMBER = 0,
    PROMOTER = 2,
    ADMIN = 1,
    EMPLOYEE = 3,
    SUPER_EMPLOYEE = 4,
}

export enum SCREEN_MODE {
    EDIT = 'Edit',
    CREATE = 'Create',
    SUCCESS = 'Success',
}

export enum OPERATIONS_INQUIRY_TYPE {
    LC = 'LC',
    BG = 'BG',
}

export enum SALARY_POSTING_COLUMNS {
    AMOUNT = 'AMOUNT',
    CR_NAME = 'CUSTOMER REFERENCE',
    CR_AC = 'CREDIT A/C NUMBER',
    DR_AC = 'DEBIT A/C NUMBER',
    TXN_STATUS = 'TRANSACTION STATUS',
    CURRENCY = 'CURRENCY',
    REF_NO = 'REFERENCE NUMBER',
    REMARK = 'REMARK',
}

export enum STATUSES {
     Pending = 'pending',
     Active = 'active',
     Inactive = 'inactive',
     Rejected = 'rejected',
}