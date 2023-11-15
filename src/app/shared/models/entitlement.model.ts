export class Entitlement {
    id!: number;
    isApprovalApplicable!: boolean;
    isLimitApplicable!: boolean;
    secured!: boolean;
    UUID!: string;
    parentId!: number | null;
    active!: boolean;
}
