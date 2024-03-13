import { USER_TYPE } from '../enums';

export class UserContext {
    public userName!: string;
    public userId!: string;
    public introducedBy!: string;    
    public firstName!: string;   
    public user_email!: string;    
    public lastName!: string;
    public aadhar!: string;
    public pan!: string;
    public mobilePhone!: string;
    public mobileAccess!: boolean;
    public enabled!: boolean;
    public lastSignIn!: string;
    public currentSignIn!: Date;
    access_token!: string;
    public email!: string;
    userType!: USER_TYPE;
    role!: string;
    public schemeTypes!: Array<SchemeType>;
    public schemeTypeSelected: SchemeType=new SchemeType();
    public entitlement!: Array<string>;
    selectedUserId!: string;
    public forcePasswordChange!: boolean;
    public expirationTime!: number;
    public id!: number;
}

export class SchemeType {
    uniqueUserId!: string;
    firstName!: string;
    middleName!: string;
    lastName!: string;
    mobilePhone!: string;
    schemeTypeName: string='Individual';
    schemeType: number=1;
}

export class Role {
    name!: string;
}
