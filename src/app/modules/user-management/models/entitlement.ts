export class Entitlement {
    name!: string;
    current!: Entitlement;
    entitled!: boolean;
    allAccountsSelected!: boolean;
    hasLimit!: boolean;
    progress!: string;
    someChildrenEntitled!: boolean;
    accountProgress!: string;
    data!: any;
    parent!: Entitlement;
    children: Array<Entitlement> = [];
    accounts: Array<Account> = [];
    currentEntitled!: Entitlement;
    isActive!: boolean | null;
    userEntitleId!: number;
    deleteAccountsOnly!: boolean;
    isViewable!: boolean;
    isEnabled!: boolean;
}

export class Account {
    selected!: boolean;
    data!: any;
    userEntitleAccountId!: number;
}
