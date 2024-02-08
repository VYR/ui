import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from 'src/app/cache/cache.service';
import { USER_TYPE } from '../enums';
import { APP_ROUTES } from '../enums/routes';
import { SchemeType, UserContext } from '../models';
import { SgsDialogService } from './sgs-dialog.service';

@Injectable({
    providedIn: 'root',
})
export class ApplicationContextService {
    public currentUser: Observable<UserContext>;
    private currentUserSubject = new BehaviorSubject<UserContext>(new UserContext());
    constructor(private router: Router, private cache: CacheService, private dialog: SgsDialogService) {
        const userContext = JSON.parse(this.cache.get('USER_CONTEXT'));
        if (userContext) this.currentUserSubject.next(userContext);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public setUserLogin(data: any, userName: string): any {
        //data.userName = userName || '';
        const user: UserContext = this._setUserInfo(data);
        user.schemeTypes = this._processSchemeTypes([data?.user]);
        user.schemeTypeSelected = user.schemeTypes[0];
        this._setUserContext(user);
        if (user.forcePasswordChange) {
            this.router.navigate(['reset-password']);
        } else {
            this._navigateToModule(user.userType);
        }
    }

    // public setValidatedUser(data: any) {
    //     const user: UserContext = this._setUserInfo(data);
    //     user.schemeTypes = this._processSchemeTypes(data.schemeType || []);
    //     user.schemeTypeSelected = this._getSchemeTypeselected(user);
    //     this._setUserContext(user);
    //     this._navigateDashboard();
    // }

    private _setUserInfo(data: any) {
        const user: UserContext = JSON.parse(this.cache.get('USER_CONTEXT')) || new UserContext();
        user.userName = data?.user.userName || '';
        user.selectedUserId = data?.user.userId;
        user.access_token = data?.access_token;
        user.expirationTime = data?.expires_in;
        user.userId = data?.user.userId;
        user.introducedBy = data?.user.introducedBy;
        user.email = data?.user.email;
        user.firstName = data?.user.firstName;
        user.lastName = data?.user.lastName;
        user.aadhar = data?.user.aadhar;
        user.pan = data?.user.pan;
        user.id = data?.user.id;
        user.mobilePhone = data?.user.mobilePhone;
        user.enabled = (data?.user?.enabled || true) === 'true';
        user.currentSignIn = new Date();
        user.lastSignIn = data?.lastSignIn;
        user.entitlement = ( data?.user?.entitlement)?data?.user?.entitlement.split(',') || []:[];
        user.forcePasswordChange = data?.forcePasswordChange;
        user.userType = data?.user?.userType;
        user.role = data?.user?.role || null;
        return user;
    }

    private _getUserType(userType: number): USER_TYPE {
        let role: USER_TYPE;
        switch (userType) {
            case 0:
                role = USER_TYPE.SCHEME_MEMBER;
                break;
            case 1:
                role = USER_TYPE.ADMIN;
                break;
            case 2:
                role = USER_TYPE.PROMOTER;
                break;
            case 3:
                role = USER_TYPE.EMPLOYEE;
                break;
            case 4:
                role = USER_TYPE.SUPER_EMPLOYEE;
                break;
            default:
                role = USER_TYPE.SCHEME_MEMBER;
                break;
        }
        return role;
    }

    private _navigateToModule(userRole: USER_TYPE) {
        let url;
        switch (userRole) {
            case USER_TYPE.ADMIN:
                url = APP_ROUTES.ADMIN;
                break;
            case USER_TYPE.SUPER_EMPLOYEE:
                url = APP_ROUTES.SUPER_EMPLOYEE;
                break;
            case USER_TYPE.EMPLOYEE:
                url = APP_ROUTES.EMPLOYEE;
                break;
            case USER_TYPE.PROMOTER:
                url = APP_ROUTES.PROMOTER;
                break;
            case USER_TYPE.SCHEME_MEMBER:
                url = APP_ROUTES.SCHEME_MEMBER;
                break;

            default:
                url = APP_ROUTES.LOGIN;
                break;
        }
        this.router.navigate([url]);        
    }

    private _parseSystemConfig(data: any) {
        const parsed: any = {};
        data.forEach((x: any) => (parsed[x.key] = x.value));
        return parsed;
    }

    // private _getSchemeTypeselected(user: UserContext) {
    //     const index = user.schemeTypes.findIndex((x) => x.schemeType === user.schemeTypeSelected.schemeType);
    //     return user.schemeTypes[index != -1 ? index : 0];
    // }

    public updateUserSelection(schemeType: SchemeType) {
        const userContext = JSON.parse(this.cache.get('USER_CONTEXT')) || new UserContext();
        userContext.schemeTypeSelected = schemeType;
        this._setUserContext(userContext);
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //     this._navigateToModule(userContext.userType);
        // });
    }

    public getCurrentUser() {
        return this.currentUserSubject.value || JSON.parse(this.cache.get('USER_CONTEXT'));
    }

    public updateToken(access_token: string) {
        const user: UserContext = this.getCurrentUser();
        user.access_token = access_token;
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
        console.log(currentUser);
        return Boolean(currentUser && currentUser.access_token);
    }
    public setUserContext(user: UserContext){
        this._setUserContext(user);
    }
    private _setUserContext(user: UserContext) {
        this.cache.set('USER_CONTEXT', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private _processSchemeTypes(org: any) {
        const output: Array<SchemeType> = [];
            const schemeType1 = new SchemeType();
            schemeType1.firstName = org.firstName;
            schemeType1.lastName = org.lastName;
            schemeType1.mobilePhone = org.mobilePhone;
            schemeType1.uniqueUserId = org.userId;
            schemeType1.schemeType=1;
            schemeType1.schemeTypeName='Individual';            
            output.push(schemeType1);
            const schemeType2 = new SchemeType();
            schemeType2.firstName = org.firstName;
            schemeType2.lastName = org.lastName;
            schemeType2.mobilePhone = org.mobilePhone;
            schemeType2.uniqueUserId = org.userId;
            schemeType2.schemeType=2;
            schemeType2.schemeTypeName='Group';
            output.push(schemeType2);

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
}
