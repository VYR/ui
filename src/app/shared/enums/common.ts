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


export enum SYSTEM_CONFIG {
    DROPDOWN_PAGE_SIZE = 1000,

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

export enum STATUSES {
     Pending = 'pending',
     Active = 'active',
     Inactive = 'inactive',
     Rejected = 'rejected',
}