import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { ConfigService } from 'src/app/configuration/config.service';
import { SCREEN_MODE, USER_TYPE } from 'src/app/shared/enums';
import { Entitlement } from '../../models/entitlement';
import { UsermanagementSandbox } from '../../user-management.sandbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DeleteUserConfirmComponent } from '../delete-user-confirm/delete-user-confirm.component';

@Component({
    selector: 'app-assign-entitlements',
    templateUrl: './assign-entitlements.component.html',
    styleUrls: ['./assign-entitlements.component.scss'],
})
export class AssignEntitlementsComponent implements OnChanges {
    @Input() screenMode: SCREEN_MODE = SCREEN_MODE.CREATE;
    @Input() form!: FormGroup;
    @Input() personalInfo!: FormGroup;
    @Input() userTypes: Array<any> = [];
    @Input() corporateGroups: Array<any> = [];
    @Input() entitlements!: Entitlement;
    @Input() userRimInfo: Array<any> = [];
    @Input() fromNewRim!: boolean;
    @Input() userData: any;
    @Input() selectedUserRim: Array<any> = [];
    @Input() userRimInfoSelected: Array<any> = [];

    @Input() userRimInfoUnSelected: Array<any> = [];

    @Input() step: any = '';
    @Output() _onUpdate = new EventEmitter<any>();

    @Output() rimLinkingEvent = new EventEmitter<object>();
    SCREEN_MODE = SCREEN_MODE;
    filteredGroups!: Observable<Array<any>>;
    USER_TYPE = USER_TYPE;
    selectedEntitlements: Array<any> = [];
    accounts: Array<any> = [];
    roleRims: any = [];
    selectedUserId: any;
    selectedEntitlement: any;
    entitlementModes = [
        {
            value: 'UPDATE',
            label: 'Update Role / Entitlements / Accounts',
            info: 'Kindly note that bulk update of Entitlements / Roles / Accounts can be performed for the below RIMs.',
        },
        {
            value: 'DELETE',
            label: 'Remove Entitlements / Accounts',
            info: 'Kindly note that bulk removal of Entitlements / Accounts can be performed for the below RIMs.',
        },
    ];
    initialAccountPrivileges: Array<any> = [];
    isEntitlement: boolean = false;
    constructor(
        private sandbox: UsermanagementSandbox,
        private _fb: FormBuilder,
        private config: ConfigService,
        private dialog: CibDialogService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        this.filteredGroups = this.form.controls['group'].valueChanges.pipe(
            startWith(''),
            map((value: any) => {
                const filterValue = (value || '').toLowerCase();
                const groups = this.corporateGroups.filter((option: any) =>
                    option['businessName'].toLowerCase().includes(filterValue)
                );
                return groups;
            })
        );

        this.processUserRIMS(this.userRimInfo || []);

        this.form.controls['updateMode'].valueChanges.subscribe((_: any) => {
            this.resetSelection();
        });
    }

    processUserRIMS(rims: Array<any>) {
        const entRimWise: any = [],
            accountsRimWise: any = [];
        const userId = this.personalInfo.value.userId;
        if (userId) {
            rims?.forEach((x: any, index: number) => {
                entRimWise.push(
                    this.sandbox.getEntitlementsbyRim({
                        userId: userId,
                        rim: this.step === 'addNewRole' ? this.userRimInfoSelected[0].uniqueUserId : x.uniqueUserId,
                    })
                );
            });
        }

        rims.forEach((x: any) => {
            accountsRimWise.push(this.sandbox.getAccounts(x.uniqueUserId));
        });

        forkJoin(accountsRimWise).subscribe((accounts: any) => {
            this.accounts = accounts;
            if (userId) {
                forkJoin(entRimWise).subscribe((res: any) => {
                    this.selectedEntitlements = res.map((x: any) => x.entitlements);
                    this.initialAccountPrivileges = res.map((x: any) => x.fullAccPrivilege);
                    this.resetSelection();
                });
            } else {
                this.selectedEntitlements = [];
                this._buildRimInfo(accounts, rims);
            }
        });
    }

    resetSelectionbyIndex(x: Array<any>) {
        (x || []).forEach(
            (rimInfo: any, index: number) => (rimInfo.fullAccountPrivilege = this.initialAccountPrivileges[index])
        );
        this._buildRimInfo(this.accounts, x);
    }

    resetSelection() {
        (this.userRimInfo || []).forEach(
            (rimInfo: any, index: number) => (rimInfo.fullAccountPrivilege = this.initialAccountPrivileges[index])
        );
        this._buildRimInfo(this.accounts, this.userRimInfo);
    }

    _buildRimInfo(accounts: Array<any>, rims: Array<any>) {
        rims.forEach((x: any, index: number) => {
            const entitlement: Entitlement = this._parseEntitlements(index);
            entitlement.children.map((entitlement: Entitlement) => {
                entitlement.accounts = entitlement.hasLimit
                    ? this._processAccounts(accounts[index], entitlement, index)
                    : [];
            });
            x.entitlement = entitlement;
        });
        this._prepareRimInfo(rims);
    }

    private _prepareRimInfo(data: Array<any>) {
        this.rimInfo.clear();
        data.forEach((x: any, index: number) => {
            const group = this._fb.group({
                rimNumber: [x.uniqueUserId],
                role: [x.role || null],
                checked: [x.checked || false],
                fullAccountPrivilege: [x.fullAccountPrivilege || false],
                entitlement: [x.entitlement],
                userRimId: [x.userRimId],
                userRoleId: [x.userRoleId],
                isNew: [x.isNew],
                delinkAccount: [x.delinkAccount || false],
            });
            this.rimInfo.push(group);
        });

        this.rimInfo.updateValueAndValidity();
    }

    private _processAccounts(accounts: Array<any> = [], entitlement: Entitlement, index: number) {
        const categoriesToShow = this.config.get('transactionalAccountCategories');
        const accountsNotToShow = this.config.get('accountsNotToShow');
        let processed: Array<any> = [];
        switch (entitlement.data.UUID) {
            case 'ACCOUNTS':
                processed = accounts.filter(
                    (account: any) => accountsNotToShow.indexOf(account.category.transactionRef) === -1
                );
                break;
            case 'PAYMENT':
                processed = accounts.filter(
                    (account: any) =>
                        categoriesToShow.indexOf(account.category.transactionRef) !== -1 && account.currency === 'QAR'
                );
                break;
            case 'GENERAL_SERVICES':
                processed = accounts.filter(
                    (account: any) =>
                        accountsNotToShow.indexOf(account.category.transactionRef) === -1 && account.status !== 'LIQ'
                );
                break;
            default:
                processed = accounts.filter(
                    (account: any) => categoriesToShow.indexOf(account.category.transactionRef) !== -1
                );
                break;
        }
        processed = processed.map((account: any) => {
            const selectedAccount: any = this._isAccountSelected(entitlement.data.id, account.account_no, index);
            return {
                selected: selectedAccount.selected,
                data: account,
                userEntitleAccountId: selectedAccount.userEntitleAccountId,
            };
        });
        return processed;
    }

    private _isAccountSelected(entitleId: any, accountNumber: string, index: number) {
        if (!this.selectedEntitlements[index]) return false;
        const i = this.selectedEntitlements[index].findIndex((x: any) => x.entitleId === entitleId);
        if (i === -1) return false;
        const j = this.selectedEntitlements[index][i].userEntitleAccount.findIndex(
            (y: any) => y.account.account_no === accountNumber
        );
        return {
            userEntitleAccountId:
                j !== -1 ? this.selectedEntitlements[index][i].userEntitleAccount[j].userEntitleAccountId : null,
            selected: this.initialAccountPrivileges[index] ? true : j !== -1,
        };
    }

    onSelectGroup() {
        const businessName = this.form.controls['group'].value.toLowerCase();
        const index = this.corporateGroups.findIndex(
            (option: any) => option['businessName'].toLowerCase() === businessName
        );
        if (index === -1) {
            return;
        }
        if (this.corporateGroups[index].businessId) {
            this.sandbox.getBusinessRims(this.corporateGroups[index].businessId).subscribe((res: any) => {
                const rims = (res || []).map((x: any) => {
                    return {
                        rimNumber: x.uniqueUserId,
                        checked: false,
                        fullAccountPrivilege: false,
                        role: null,
                        isNew: true,
                        delinkAccount: false,
                    };
                });
                this.processUserRIMS(rims);
            });
        }
    }

    private _parseEntitlements(index: number) {
        const entitlement: Entitlement = this._processEntitlements(
            {
                name: 'ALL',
                children: this.entitlements,
            },
            new Entitlement(),
            new Entitlement(),
            index
        );
        return entitlement;
    }

    get rimInfo() {
        return this.form.controls['rimInfo'] as FormArray;
    }

    getRimInfoGroup(index: number) {
        return this.rimInfo.at(index) as FormGroup;
    }

    private _processEntitlements(data: any, entitlement: Entitlement, parent: Entitlement, index: number) {
        const existing = this._isEntitled(data.id, index);
        entitlement.name = data.name;
        entitlement.data = data;
        entitlement.isViewable = data.isViewable;
        entitlement.isEnabled = data.isEnabled;

        if (existing.status && this.step !== 'addNewRole') {
            entitlement.isActive = true;
            entitlement.userEntitleId = existing.data.userEntitleId;
        }
        entitlement.hasLimit = data.hasLimit;
        entitlement.parent = parent;
        entitlement.children = [];
        entitlement.someChildrenEntitled = existing.status;
        if (!data.children.length) {
            entitlement.entitled = existing.status;
            return entitlement;
        }
        const children: Array<Entitlement> = [];
        data.children.forEach((x: any) => {
            children.push(this._processEntitlements(x, new Entitlement(), entitlement, index));
        });
        entitlement.entitled = children.every((child: Entitlement) => child.entitled);
        entitlement.someChildrenEntitled = children.some((child: Entitlement) => child.someChildrenEntitled);
        entitlement.children = children;
        return entitlement;
    }

    private _isEntitled(id: any, index: number): any {
        if (!this.selectedEntitlements[index]) return false;
        const isPresent = this.selectedEntitlements[index].findIndex((ent: any) => ent.entitleId === id);
        return {
            status: isPresent !== -1,
            data: this.selectedEntitlements[index][isPresent] || {},
        };
    }

    delinkAccount(rimNo: any) {
        let selectedUserId = this.userRimInfo.find((rimsInfo: any) => {
            return rimsInfo.uniqueUserId === rimNo;
        });

        let dialog = this.dialog.openOverlayPanel('Confirm Details', DeleteUserConfirmComponent, {
            message: 'Are you sure you want to remove RIM ' + rimNo + '?',
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result && result?.action === 'success') {
                this.sandbox.deleteRim(selectedUserId.userRimId, this.userData?.user?.userId).subscribe((res: any) => {
                    this._onUpdate.emit(true);
                    this.rimLinkingEvent.emit({ rimInfo: rimNo, action: 'removeRim' });
                });
            }
        });
    }

    setEntitlements(event: MatSlideToggleChange, rimNo: any, i: number) {
        if (event.checked) {
            if (this.step === 'addNewRole' && this.userRimInfo.length > 0 && this.userRimInfoSelected.length > 0) {
                this.userRimInfo[i].checked = this.userRimInfoSelected[0].checked;
                this.userRimInfo[i].role = this.userRimInfoSelected[0].role;
                this.userRimInfo[i].fullAccountPrivilege = this.userRimInfoSelected[0].fullAccountPrivilege;

                this.getRimInfoGroup(i).value.checked = this.userRimInfoSelected[0].checked;
                this.getRimInfoGroup(i).value.role = this.userRimInfoSelected[0].role;
                this.getRimInfoGroup(i).value.fullAccountPrivilege = this.userRimInfoSelected[0].fullAccountPrivilege;

                if (this.isEntitlement) {
                    this.rimInfo.at(i).setValue(this.getRimInfoGroup(i).value);
                } else {
                    this.processUserRIMS(this.userRimInfo || []);
                    this.isEntitlement = true;
                }
            }
        } else {
            this.userRimInfo[i].checked = false;
            this.userRimInfo[i].role = {};
            this.userRimInfo[i].fullAccountPrivilege = false;
            this.getRimInfoGroup(i).value.checked = false;
            this.getRimInfoGroup(i).value.role = {};
            this.getRimInfoGroup(i).value.fullAccountPrivilege = false;
            this.getRimInfoGroup(i).value.entitlement = this.userRimInfoSelected[0].entitlement;
            this.rimInfo.at(i).setValue(this.getRimInfoGroup(i).value);
        }
    }
}
