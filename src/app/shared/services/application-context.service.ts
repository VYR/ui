import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from 'src/app/cache/cache.service';
import { USER_TYPE } from '../enums';
import { APP_ROUTES } from '../enums/routes';
import { Organization, UserContext } from '../models';
import { CibDialogService } from './cib-dialog.service';

@Injectable({
    providedIn: 'root',
})
export class ApplicationContextService {
    public currentUser: Observable<UserContext>;
    private currentUserSubject = new BehaviorSubject<UserContext>(new UserContext());
    constructor(private router: Router, private cache: CacheService, private dialog: CibDialogService) {
        const userContext = JSON.parse(this.cache.get('USER_CONTEXT'));
        if (userContext) this.currentUserSubject.next(userContext);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public setUserLogin(data: any, userName: string): any {
        data.userName = userName;
        const user: UserContext = this._setUserInfo(data);
        user.organizations = this._processOrganizations(data.organization || []);
        user.organizationSelected = this._getOrganizationselected(user);
        this._setUserContext(user);
        if (user.forcePasswordChange) {
            this.router.navigate(['reset-password']);
        } else {
            this._navigateToModule(user.userType);
        }
    }

    public setValidatedUser(data: any) {
        const user: UserContext = this._setUserInfo(data);
        user.organizations = this._processOrganizations(data.organization || []);
        user.organizationSelected = this._getOrganizationselected(user);
        this._setUserContext(user);
        this._navigateDashboard();
    }

    private _setUserInfo(data: any) {
        const user: UserContext = JSON.parse(this.cache.get('USER_CONTEXT')) || new UserContext();
        user.userName = data.userName;
        user.selectedRim = data.selectedRim;
        user.token = data.Authorization;
        user.expirationTime = data.expirationTime;
        user.userId = data.userId;
        user.email = data.email;
        user.firstName = data.firstNameEng;
        user.lastName = data.lastNameEng;
        user.mobilePhone = data.mobilePhone;
        user.stpUser = data.stpUser;
        user.enabled = data.enabled === 'true';
        user.currentSignIn = new Date();
        user.lastSignIn = data.lastSignIn;
        user.isBankAdmin = data.isBankAdmin;
        user.h2hEnabled = data.h2hEnabled;
        user.isSurveyRequired = data.isSurveyRequired;
        user.entitlement = data.entitlement;
        user.forcePasswordChange = data.forcePasswordChange;
        user.rmDetails = data.rmDetails || {};
        user.userType = this._getUserType(data.userType);
        user.role = data.role && data.role.length ? data.role[0] : null;
        user.sysConfig = data.sysConfig ? this._parseSystemConfig(data.sysConfig) : null;
        user.sysConfigAllInfo = data.sysConfig;
        user.kycPopType = data.kycPopType;
        return user;
    }

    private _getUserType(userType: number): USER_TYPE {
        let role: USER_TYPE;
        switch (userType) {
            case 0:
                role = USER_TYPE.CORPORATE_USER;
                break;
            case 1:
                role = USER_TYPE.BANK_ADMIN;
                break;
            case 2:
                role = USER_TYPE.BANK_USER;
                break;
            case 10:
                role = USER_TYPE.SUPER_ADMIN;
                break;
            case 12:
                role = USER_TYPE.BANK_ADMIN_APPROVER;
                break;
            case 13:
                role = USER_TYPE.CSD_USER;
                break;
            default:
                role = USER_TYPE.CORPORATE_USER;
                break;
        }
        return role;
    }

    private _navigateToModule(userRole: USER_TYPE) {
        let url;
        switch (userRole) {
            case USER_TYPE.CORPORATE_USER:
                url = APP_ROUTES.VALIDATE_OTP;
                break;
            case USER_TYPE.BANK_USER:
                url = APP_ROUTES.OPERATION_APPROVAL;
                break;
            case USER_TYPE.BANK_ADMIN:
                url = APP_ROUTES.ADMIN_DASHBOARD;
                break;
            case USER_TYPE.BANK_ADMIN_APPROVER:
                url = APP_ROUTES.ADMIN_DASHBOARD_APPROVER;
                break;
            case USER_TYPE.CSD_USER:
                url = APP_ROUTES.CSD_HOME;
                break;
            case USER_TYPE.SUPER_ADMIN:
                url = APP_ROUTES.ADMIN_USER_MANAGEMENT;
                break;

            default:
                url = APP_ROUTES.VALIDATE_OTP;
                break;
        }
        this.router.navigate([url]);
    }

    private _parseSystemConfig(data: any) {
        const parsed: any = {};
        data.forEach((x: any) => (parsed[x.key] = x.value));
        return parsed;
    }

    private _getOrganizationselected(user: UserContext) {
        const index = user.organizations.findIndex((x) => x.rimNumber === user.selectedRim);
        return user.organizations[index != -1 ? index : 0];
    }

    public updateRimSelection(organization: Organization, data: any) {
        const userContext = JSON.parse(this.cache.get('USER_CONTEXT')) || new UserContext();
        userContext.entitlement = data.entitlement;
        userContext.isKYCUpdated = data.isKYCUpdated === '0' ? false : true;
        userContext.h2hEnabled = data.h2hEnabled;
        userContext.role = data.role[0];
        userContext.organizationSelected = organization;
        userContext.kycPopType = data.kycPopType;
        this._setUserContext(userContext);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([APP_ROUTES.DASHBOARD]);
        });
    }

    public getCurrentUser() {
        return this.currentUserSubject.value || JSON.parse(this.cache.get('USER_CONTEXT'));
    }

    public updateToken(token: string) {
        const user: UserContext = this.getCurrentUser();
        user.token = token;
        this._setUserContext(user);
    }

    public logout() {
        this._setUserContext(new UserContext());
        this.dialog.closeAllDialogs();
        this.router.navigate(['login']);
    }

    public serviceDown() {
        this._setUserContext(new UserContext());
        this.router.navigate(['service-unavailable']);
    }

    public isAuthenticated(): boolean {
        const currentUser = this.getCurrentUser();
        return Boolean(currentUser && currentUser.token);
    }

    private _setUserContext(user: UserContext) {
        this.cache.set('USER_CONTEXT', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private _navigateDashboard() {
        this.router.navigate([APP_ROUTES.DASHBOARD]);
    }

    private _processOrganizations(input: any) {
        const output: Array<Organization> = [];
        if (input && input.length > 0) {
            input.forEach((org: any) => {
                const organization = new Organization();
                organization.firstName = org.firstnameeng;
                organization.middleName = org.middlenameeng;
                organization.lastName = org.lastnameeng;
                organization.legalDocName = org.legal_doc_name;
                organization.legalId = org.legal_id;
                organization.legaldocExpDate = org.legal_exp_date;
                organization.mobilePhone = org.mobilephone;
                organization.preferredName = org.preferredname;
                organization.rimNumber = org.rimnumber;
                organization.sectorCode = org.sectorcode;
                organization.industry = org.industry;
                organization.businessemailid = org.businessemailid;
                organization.pobox = org.pobox;
                organization.city = org.city;
                organization.country = org.country;
                output.push(organization);
            });
        }
        return output;
    }

    private _validateEntitlement(uuid: string) {
        const entitlements = this.getCurrentUser().entitlement || [];
        return uuid.split(',').some((x: string) => entitlements.includes(x));
    }

    public processMenu(menu: Array<any>, needDefaultRoute: boolean = true) {
        const processed = menu.filter((menuItem: any) => {
            return this._validateEntitlement(menuItem.uuid);
        });
        if (needDefaultRoute) {
            const defaultRoute: any = {
                path: '',
                redirectTo: processed[0].path,
                pathMatch: 'full',
            };
            processed.push(defaultRoute);
        }
        return processed;
    }

    public getFXDisclaimer() {
        let rmMsg: string = 'Your daily FX limit is USD 15,000 equivalent';
        const organizationSelected = this.getCurrentUser().organizationSelected;
        if ('1000'.indexOf(organizationSelected.industry) === -1) {
            if (Object.keys(this.getCurrentUser().rmDetails).length !== 0)
                rmMsg = 'Your daily FX limit is USD 50,000 equivalent. You may contact your RM for further query';
        }
        return rmMsg;
    }
}
