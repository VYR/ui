import { Z } from '@angular/cdk/keycodes';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfigService } from 'src/app/configuration';
import { SCREEN_MODE, USER_TYPE } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { Account, Entitlement } from '../../models/entitlement';
import { UsermanagementSandbox } from '../../user-management.sandbox';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
    ],
})
export class CreateUserComponent implements OnInit {
    @Input() userData: any = {};
    @Output() _onUpdate = new EventEmitter<any>();
    SCREEN_MODE = SCREEN_MODE;
    screenMode: SCREEN_MODE = SCREEN_MODE.CREATE;
    options: any;
    currentUser!: UserContext;
    userTypes: Array<any> = [];
    userRIMs: any = {
        selected: [],
        unselected: [],
    };
    USER_TYPE = USER_TYPE;
    corporateGroups: Array<any> = [];
    personalInfo!: FormGroup;
    entitlementInfo!: FormGroup;
    newRoleInfo!: FormGroup;
    initialPersonalInfo: string = '';
    entitlements!: Entitlement;
    allSet: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private sandbox: UsermanagementSandbox,
        private appContext: ApplicationContextService,
        private config: ConfigService
    ) {
        this.appContext.currentUser.subscribe((res: any) => (this.currentUser = res));
    }

    ngOnInit(): void {
        if (this.userData.user && this.userData.user.email) {
            this.screenMode = SCREEN_MODE.EDIT;
        }

        let calls = [this.sandbox.getOptions()];
        if (this.currentUser.userType === USER_TYPE.BANK_ADMIN) {
            calls = calls.concat([this.sandbox.getGroups(), this.sandbox.getEntitlements()]);
        }

        forkJoin(calls).subscribe((res: any) => {
            this.options = res[0];
            this.corporateGroups = res[1];
            this.entitlements = res[2];
            this._buildForm((this.userData && this.userData.user) || {});
        });
    }

    private _buildForm(data: any) {
        const additionalDetails = this.userData.details || {};
        const titleIndex = this.options.titles.findIndex((x: any) => x.label === data.title);
        const title = titleIndex != -1 ? this.options.titles[titleIndex] : null;
        const genderIndex = this.options.genders.findIndex((x: any) => x.label === additionalDetails.gender);
        const gender = genderIndex != -1 ? this.options.genders[genderIndex] : null;
        const { userTypes, userRoles } = this.options;
        const typeIndex = userRoles.findIndex((x: any) => x.value === data.userType);
        this.personalInfo = this._fb.group({
            email: [
                { value: data.email, disabled: this.screenMode === SCREEN_MODE.EDIT },
                [
                    Validators.required,
                    Validators.pattern('^(?=.*)(?=.*[a-zA-Z].*)[0-9A-Za-z]{6,20}'),
                    Validators.minLength(6),
                    Validators.maxLength(20),
                ],
            ],
            userId: [data.userId],
            isUserNameValidated: [this.screenMode === SCREEN_MODE.CREATE ? null : true, Validators.required],
            title: [title, Validators.required],
            firstNameEng: [data.firstNameEng, Validators.required],
            middleNameEng: [data.middleNameEng],
            forcePasswordChange: this.screenMode === SCREEN_MODE.CREATE,
            lastNameEng: [data.lastNameEng, Validators.required],
            gender: [gender, Validators.required],
            stpUser: [data.stpUser],
            userType: [userRoles[typeIndex] || null],
            enabled: [data.hasOwnProperty('enabled') ? data.enabled : true],
            mobileAccess: [data.hasOwnProperty('mobileAccess') ? data.mobileAccess : true],
            username: [data.email, [Validators.required, Validators.pattern(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`)]],
            mobilePhone: [data.mobilePhone, Validators.required],
            fax: [additionalDetails.fax],
            comments: [data?.comments || '', Validators.required],
        });

        this.initialPersonalInfo = JSON.stringify(this.personalInfo.getRawValue());

        this.entitlementInfo = this._fb.group({
            updateMode: [null],
            group: [null],
            rimInfo: new FormArray([]),
            rimNumber: [null],
        });

        this.newRoleInfo = this._fb.group({
            group: [null],
            updateMode: [null],
            rimInfo: new FormArray([]),
            rimNumber: [null],
        });

        if (this.currentUser.userType === USER_TYPE.BANK_ADMIN) {
            this.userTypes = userTypes.filter((role: any) =>
                this.personalInfo.controls['stpUser'].value ? role.canBeStpUser : true
            );
        }
        this.personalInfo.controls['stpUser'].valueChanges.subscribe((res: any) => {
            this.userTypes = userTypes.filter((role: any) => (res ? role.canBeStpUser : true));
        });

        if (this.currentUser.userType === USER_TYPE.BANK_ADMIN) {
            const userRIMs = this.userData.userRim || [];
            const businessId = userRIMs.length ? userRIMs[0].customer.business.businessId : null;
            this.sandbox.getBusinessRims(businessId).subscribe((rims: any) => {
                if (rims.length) {
                    const selected: Array<any> = [],
                        unselected: Array<any> = [];
                    const rimNumbers = [
                        ...new Set([
                            ...(rims || []).map((x: any) => x.rimnumber),
                            ...(userRIMs || []).map((x: any) => x.customer.rimnumber),
                        ]),
                    ];
                    rimNumbers.forEach((x: any) => {
                        const presence = (userRIMs || []).findIndex((y: any) => y.customer.rimnumber === x);
                        if (presence !== -1) {
                            const rimInfo = userRIMs[presence];
                            const index = this.userTypes.findIndex((type: any) => type.value === rimInfo.role.type);
                            const role = index !== -1 ? this.userTypes[index] : {};
                            selected.push({
                                rimNumber: rimInfo.customer.rimnumber,
                                checked: rimInfo.enabled,
                                fullAccountPrivilege: rimInfo.fullAccountPrivilege || false,
                                role,
                                userRoleId: rimInfo.role.userRoleId || null,
                                userRimId: rimInfo.userRimId,
                                isNew: false,
                            });
                        } else {
                            unselected.push({
                                rimNumber: x,
                                checked: false,
                                fullAccountPrivilege: false,
                                role: null,
                                isNew: true,
                            });
                        }
                    });
                    this.userRIMs = {
                        selected,
                        unselected,
                    };
                }
                this.allSet = true;
            });
        }
    }

    checkPersonalInfoChanges() {
        return this.initialPersonalInfo !== JSON.stringify(this.personalInfo.getRawValue());
    }

    isValidEntitlements(form: FormGroup) {
        const rimInfo = form.value.rimInfo;
        if (rimInfo.every((x: any) => !x.checked)) return false;
        return rimInfo
            .filter((x: any) => x.checked)
            .every(
                (y: any) =>
                    this.entitlementCheck(y.entitlement) &&
                    (y.fullAccountPrivilege ? true : this.accountSelectionCheck(y.entitlement))
            );
    }

    validateFormSubmit() {
        return this.personalInfo.valid && this.entitlementInfo.valid && this.isValidEntitlements(this.entitlementInfo);
    }

    entitlementCheck(entitlement: Entitlement): boolean {
        if (entitlement.entitled) return true;
        if (entitlement.children.length) {
            if (entitlement.children.some((x) => x.entitled)) return true;
            else {
                let i = 0;
                let entitled = false;
                do {
                    entitled = this.entitlementCheck(entitlement.children[i]);
                    i++;
                } while (!entitled && i < entitlement.children.length);
                return entitled;
            }
        }
        return false;
    }

    private accountSelectionCheck(entitlement: Entitlement) {
        const children = entitlement.children.filter(
            (child: Entitlement) => child.someChildrenEntitled && child.hasLimit
        );
        return children.every((child: Entitlement) => child.accounts.some((account: Account) => account.selected));
    }

    submit() {
        const req = this._prepareRequest(this.entitlementInfo.value, false);
        this.sandbox.createUser(req).subscribe();
    }

    updateUser() {
        const req = this._prepareRequest(this.entitlementInfo.value, false);
        req.userRims = req.userRim.map((x: any) => x.customer.rimnumber);
        req.userRim = [];
        this.sandbox.updateUser(req).subscribe((res) => this._onUpdate.emit(true));
    }

    updateUserEntitlements(mode: any) {
        const req = this._prepareRequest(this.entitlementInfo.value, false, mode);
        this.sandbox.updateUserEntitlement(req, mode).subscribe((res) => this._onUpdate.emit(true));
    }

    addNewRole() {
        const req = this._prepareRequest(this.newRoleInfo.value, true);
        this.sandbox.addNewRole(req).subscribe((res) => this._onUpdate.emit(true));
    }

    private _prepareRequest(entInfo: any, addNewRole: boolean = false, updateMode?: string) {
        const basicInfo = this.personalInfo.getRawValue();
        const initialPersonalInfo = JSON.parse(this.initialPersonalInfo);
        basicInfo.comments = basicInfo.enabled ? initialPersonalInfo.comments : basicInfo.comments;
        const userRim = this.prepareUserRimInfo(entInfo.rimInfo, addNewRole, updateMode);
        const req: any = {
            details: {
                ...(this.userData.details || {}),
                gender: basicInfo.gender.label,
                fax: basicInfo.fax,
            },
            user: {
                ...basicInfo,
                title: basicInfo.title.label,
                mobilePhone: basicInfo.mobilePhone.toString(),
            },
            userRim: this.currentUser.userType === USER_TYPE.SUPER_ADMIN ? [] : userRim,
        };

        if (this.screenMode === SCREEN_MODE.EDIT) {
            req.additionalProperties = {
                categoriesToShow: this.config.get('transactionalAccountCategories'),
                accountsNotToShow: this.config.get('accountsNotToShow'),
            };
        }
        req.user.userType = this.currentUser.userType === USER_TYPE.SUPER_ADMIN ? basicInfo.userType.value : 0;
        if (!req.user.middleNameEng) delete req.user.middleNameEng;
        if (!req.details.fax) delete req.details.fax;
        delete req.user.gender;
        delete req.user.isUserNameValidated;
        delete req.user.fax;
        return req;
    }

    private prepareUserRimInfo(rimInfo: Array<any>, addNewRole: boolean = false, updateMode?: string) {
        const processed: Array<any> = [];
        rimInfo.forEach((x: any) => {
            const req: any = {};
            if (this.screenMode === SCREEN_MODE.CREATE || addNewRole ? x.checked : true) {
                req.customer = { rimnumber: x.rimNumber };
                req.enabled = x.checked;
                req.userRimId = x.userRimId;
                req.isAdd = this.screenMode === SCREEN_MODE.CREATE || addNewRole;
                req.role = {
                    name: this.screenMode === SCREEN_MODE.CREATE ? 'user' : x.role.value || null,
                    type: x.role.value || null,
                    userRoleId: x.userRoleId,
                };
                req.fullAccPrivilege = x.fullAccountPrivilege || false;
                req.entitlements =
                    this._getEntitlements(
                        x.entitlement.children,
                        x.fullAccountPrivilege,
                        [],
                        x.role.value,
                        updateMode
                    ) || [];
                req.entitlements = req.entitlements.filter((ele: any) => ele.isEnabled);
                processed.push(req);
            }
        });
        return processed;
    }

    private _getEntitlements(
        children: Array<Entitlement>,
        fullAccPrivilege: boolean,
        list: Array<any> = [],
        role: string,
        updateMode?: string
    ) {
        children.forEach((entitlement: Entitlement) => {
            if (this.canIncludeEntitlement(entitlement, role, updateMode)) {
                const ent: any = {};
                ent.entitleId = entitlement.data.id;
                ent.isViewable = entitlement.isViewable;
                ent.isEnabled = entitlement.isEnabled;
                ent.userEntitleAccount = fullAccPrivilege ? [] : this._prepareAccounts(entitlement);
                ent.deleteAccountsOnly = entitlement.deleteAccountsOnly;
                ent.isActive = Object(entitlement).hasOwnProperty('isActive')
                    ? entitlement.someChildrenEntitled || entitlement.entitled
                    : true;
                if (['isActive', 'userEntitleId'].every((x: string) => Object(entitlement).hasOwnProperty(x))) {
                    ent.userEntitleId = entitlement.userEntitleId;
                }
                list.push(ent);
            }
            if (entitlement.children.length) {
                this._getEntitlements(entitlement.children, fullAccPrivilege, list, role, updateMode);
            }
        });
        return role === 'role_user_viewer' ? list.filter((x) => x.isViewable) : list;
    }

    private canIncludeEntitlement(entitlement: Entitlement, role: string, updateMode?: string) {
        if (updateMode === 'UPDATE') {
            return (
                ((entitlement.someChildrenEntitled || entitlement.entitled) && !entitlement.userEntitleId) ||
                entitlement.accounts.filter((x: Account) => x.selected && !x.userEntitleAccountId).length
            );
        } else if (updateMode === 'DELETE') {
            const status =
                !(entitlement.children.length ? entitlement.someChildrenEntitled : entitlement.entitled) &&
                entitlement.userEntitleId &&
                Object(entitlement).hasOwnProperty('isActive');
            const hasUnselectedAccounts = entitlement.accounts.filter(
                (x: Account) => !x.selected && x.userEntitleAccountId
            ).length;
            if (hasUnselectedAccounts && !status) entitlement.deleteAccountsOnly = true;
            return hasUnselectedAccounts || status;
        } else {
            return entitlement.someChildrenEntitled || entitlement.entitled;
        }
    }

    private _prepareAccounts(entitlement: Entitlement) {
        if (!entitlement.accounts.length) return [];
        return entitlement.accounts
            .filter((x: Account) => x.selected || x.userEntitleAccountId)
            .map((y: any) => {
                return { account: y.data, userEntitleAccountId: y.userEntitleAccountId };
            });
    }

    linkRim(rimData: any) {
        this._onUpdate.emit(true);
    }
}
