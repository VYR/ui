import { Component, OnInit } from '@angular/core';
import { BankAdminGroupManagementSandbox } from '../../bank-admin-group-management.sandbox';
import { DECISION } from 'src/app/shared/enums';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { GroupAdminDialogComponent } from '../group-admin-dialog/group-admin-dialog.component';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
    selector: 'app-mappings',
    templateUrl: './mappings.component.html',
    styleUrls: ['./mappings.component.scss'],
})
export class MappingsComponent implements OnInit {
    businessGroupList: Array<any> = [];
    corporatesList: Array<any> = [];
    userGroupList: Array<any> = [];
    usersList: Array<any> = [];
    selectedCorpGroup: any;
    selectedUserGroup: any;
    showUsersSection: boolean = false;
    enableButton: boolean = true;
    selectedUsers: Array<any> = [];
    groupUsers: Array<any> = [];
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'firstNameEng',
                displayName: 'First Name',
                sortable: true,
            },
            {
                key: 'email',
                displayName: 'Email Id',
                sortable: true,
            },
            {
                key: 'email',
                displayName: 'User Name',
                sortable: true,
            },
            {
                key: 'delete',
                displayName: 'Delete',
                type: ColumnType.icon,
                icon: 'la-trash-alt',
            },
        ],
        selection: false,
        totalRecords: 0,
        clientPagination: true,
        data: [],
    };

    filteredGroups!: Array<any>;
    form!: FormGroup;
    constructor(
        private sandbox: BankAdminGroupManagementSandbox,
        private dialog: CibDialogService,
        private router: Router,
        private _fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.sandbox.setActiveRouter(this.router.url);
        this.getBusinessGroupsList();
        this.form = this._fb.group({
            group: [null, Validators.required],
            selectedCorpGroup: [null, Validators.required],
            selectedUserGroup: [null, Validators.required],
        });
    }
    changeSelection(event: any, user: any) {
        user.selected = event.checked;
        let users = this.usersList.filter((obj: any) => obj.selected == true);
        this.enableButton = !(users.length > 0);
    }
    changeValue(target: any) {
        this.showUsersSection = false;
        const filterValue = (target.value || '').toLowerCase();
        const groups = this.businessGroupList.filter((option: any) =>
            option['businessName'].toLowerCase().includes(filterValue)
        );
        this.filteredGroups = groups;
    }
    onSelectGroup(target: any) {
        this.corporatesList = [];
        this.userGroupList = [];
        const businessName = (target.value.trim() || '').toLowerCase();
        const index = this.businessGroupList.findIndex(
            (option: any) => option['businessName'].toLowerCase() === businessName
        );
        if (index === -1) {
            return;
        }
        if (this.businessGroupList[index].businessId) {
            this.sandbox
                .getBusinessCustomers({ businessId: this.businessGroupList[index].businessId })
                .subscribe((res: any) => {
                    if (res.data) this.corporatesList = res.data;
                    if (this.corporatesList.length > 0) {
                        this.selectedCorpGroup = this.corporatesList[0];
                        this.form.controls['selectedCorpGroup'].setValue(this.corporatesList[0]);
                        this.getSelectedCorporate(this.corporatesList[0]);
                    }
                });
        }
    }
    getBusinessGroupsList() {
        this.sandbox.getBusinessGroupsList().subscribe((res: any) => {
            if (res.data) {
                this.businessGroupList = res.data;
            }
        });
    }
    getSelectedCorporate(value: any) {
        this.showUsersSection = false;
        this.userGroupList = [];
        this.selectedCorpGroup = value;
        this.sandbox.getGroupByRIM({ rim: value.uniqueUserId }).subscribe((res: any) => {
            if (res.data) this.userGroupList = res.data;
        });
    }
    getSelectedUserGroup(event: any) {
        this.selectedUserGroup = event.value;
        this.showUsersSection = false;
        this.enableButton = true;
        this.getUsersList();
    }
    getUsersList() {
        let userType = this.selectedUserGroup?.group.verifierGroup ? 'verifier' : 'checker';
        this.sandbox
            .getGroupUsers({
                rim: this.selectedCorpGroup.uniqueUserId,
                groupId: this.selectedUserGroup?.group.groupId,
                userType,
            })
            .subscribe((res: any) => {
                this.showUsersSection = true;
                if (res.data?.others) this.usersList = res.data.others;
                if (res.data?.groupUsers) this.groupUsers = res.data.groupUsers;
                if (this.usersList.length > 0) {
                    this.usersList = this.usersList.map((obj: any) => {
                        return { ...obj, selected: false };
                    });
                }
                this.loadDataTable(this.groupUsers);
            });
    }
    lazyLoad(event: any) {
        if (event.sortKey) {
            this.groupUsers = this.groupUsers.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.groupUsers);
        }
    }
    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }
    onClickCell(user: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, GroupAdminDialogComponent, {
            type: 'deleteUser',
            title: 'Delete User from Group',
            messageToShow: 'Would you like to delete this user from group?',
        });
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                let params: any = {
                    rim: this.selectedCorpGroup.uniqueUserId,
                    groupId: this.selectedUserGroup?.group.groupId,
                    groupName: this.selectedUserGroup?.group.name,
                    userId: user.data.userId,
                    email: user.data.email,
                    validateUserId: user.data.userId,
                    validateGroupId: this.selectedUserGroup?.group.groupId,
                };
                this.sandbox.deleteGroupUser(params).subscribe((res: any) => {
                    this.getUsersList();
                });
            }
        });
    }
    sendRequest() {
        this.selectedUsers = this.usersList.filter((obj: any) => {
            if (obj.selected) return obj;
        });
        let formData: any = this.form.value;
        let payload: any = {
            customer: formData.selectedCorpGroup,
            group: formData.selectedUserGroup?.group,
            user: this.selectedUsers,
        };
        if (this.selectedUsers.length > 0) {
            const ref = this.dialog.openDialog(CibDialogType.small, GroupAdminDialogComponent, {
                type: 'updateUserGroup',
                title: 'Add User to Group',
                messageToShow: 'Would you like to add the user to this Group ?',
            });
            ref.afterClosed().subscribe((result: any) => {
                if (result.decision == DECISION.CONFIRM) {
                    this.sandbox
                        .updateUserGroup(payload, { validateGroupId: formData.selectedUserGroup?.group.groupId })
                        .subscribe((res: any) => {
                            this.getUsersList();
                        });
                }
            });
        }
    }
}
