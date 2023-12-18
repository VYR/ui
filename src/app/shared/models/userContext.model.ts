import { USER_TYPE } from '../enums';

export class UserContext {
    public userName!: string;
    public userId!: string;
    public introducedBy!: string;    
    public firstName!: string;
    public lastName!: string;
    public aadhar!: string;
    public pan!: string;
    public mobilePhone!: string;
    public stpUser!: boolean;
    public mobileAccess!: boolean;
    public enabled!: boolean;
    public lastSignIn!: string;
    public currentSignIn!: Date;
    public isBankAdmin!: boolean;
    public h2hEnabled!: boolean;
    public isKYCUpdated!: boolean;
    public isSurveyRequired!: string;
    access_token!: string;
    public email!: string;
    userType!: USER_TYPE;
    role!: Role;
    public organizations!: Array<Organization>;
    public organizationSelected!: Organization;
    public entitlement!: Array<string>;
    public sysConfig!: any;
    public rmDetails!: any;
    selectedUserId!: string;
    public sysConfigAllInfo!: Array<any>;
    public forcePasswordChange!: boolean;
    public expirationTime!: number;
    public kycPopType!: number;
}

export class Organization {
    uniqueUserId!: string;
    legalId!: string;
    legalDocName!: string;
    legaldocExpDate!: string;
    firstName!: string;
    middleName!: string;
    lastName!: string;
    sectorCode!: string;
    preferredName!: string;
    mobilePhone!: string;
    industry!: string;
    businessemailid!: string;
    pobox!: string;
    city!: string;
    country!: string;
}

export class Role {
    name!: string;
}
