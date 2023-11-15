import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, switchMap, map, Observable } from 'rxjs';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { USER_TYPE } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UsermanagementSandbox } from '../../user-management.sandbox';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { DeleteUserConfirmComponent } from '../delete-user-confirm/delete-user-confirm.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search-user',
    templateUrl: './search-user.component.html',
    styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent {
    form!: FormGroup;
    filteredRIMs!: Observable<Array<any>>;
    @Output() _onUpdate = new EventEmitter<any>();
    users: any = [];
    USER_TYPE = USER_TYPE;
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'created',
                displayName: 'Created On',
                sortable: true,
                type: ColumnType.date,
            },
            {
                key: 'username',
                displayName: 'Username',
                sortable: true,
            },
            {
                key: 'fullName',
                displayName: 'Full Name',
                sortable: true,
            },
            {
                key: 'email',
                displayName: 'Email Id',
                sortable: true,
            },
            {
                key: 'mobilePhone',
                displayName: 'Mobile Number',
                sortable: true,
            },
            {
                key: 'status',
                displayName: 'Status',
                sortable: true,
            },
            {
                key: 'unlockOtp',
                displayName: 'Unlock OTP',
                type: ColumnType.icon,
                icon: 'la-unlock-alt',
            },
            {
                key: 'unlockUser',
                displayName: 'Unlock User',
                type: ColumnType.icon,
                icon: 'la-user-lock',
            },
            {
                key: 'edit',
                displayName: 'Edit',
                type: ColumnType.icon,
                icon: 'la-edit',
            },
            {
                key: 'delete',
                displayName: 'Delete',
                type: ColumnType.reject,
            },
        ],
        clientPagination: true,
        pageSize: 10,
        totalRecords: 0,
        selection: false,
        data: [],
    };
    currentUser!: UserContext;
    constructor(
        private _fb: FormBuilder,
        private sandbox: UsermanagementSandbox,
        private dialog: CibDialogService,
        private appContext: ApplicationContextService,
        private router: Router
    ) {
        this.appContext.currentUser.subscribe((res: any) => (this.currentUser = res));
    }

    ngOnInit() {
        this.form = this._fb.group({
            username: [null],
            rimNumber: [null],
            email: [null, [Validators.pattern(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`)]],
            mobilePhone: [null, [Validators.pattern('^.{8,8}$')]],
        });

        this.filteredRIMs = this.form.controls['rimNumber'].valueChanges.pipe(
            startWith(''),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((val: string) => {
                if (val.length < 2) return [];
                return this.sandbox.getRims(val.trim()).pipe(map((response) => response));
            })
        );
    }

    onSearch() {
        this.sandbox.getUsers(this.form.value).subscribe((res: any) => {
            let data = res.data || [];
            data.forEach((x: any) => {
                x.fullName = `${x.firstNameEng} ${x.lastNameEng}`;
                x.status = x.enabled ? 'Active' : 'In-Active';
            }) || [];
            if (this.currentUser.userType === USER_TYPE.BANK_ADMIN) {
                data = data.filter((x: any) => x.userType === 0);
            }
            if (this.currentUser.userType === USER_TYPE.SUPER_ADMIN) {
                data = data.filter((x: any) => ![0, 10].includes(x.userType));
            }
            this.users = data;
            this.loadDataTable(this.users);
        });
    }
    loadDataTable(data: any) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }
    onClickCell(cell: any) {
        if (cell.key === 'enabled') {
            cell.data;
        }
        if (cell.key === 'edit') {
            this.getAdditionalDetails(cell.data);
        }
        if (cell.key === 'unlockOtp') {
            this.sandbox.unlockUserOtp(cell.data.username).subscribe();
        }
        if (cell.key === 'unlockUser') {
            this.sandbox.unlockUser(cell.data.username).subscribe();
        }
        if (cell.key === 'delete') {
            let dialog = this.dialog.openOverlayPanel('Confirm Details', DeleteUserConfirmComponent, {
                message: 'Are you sure you want to delete this user ' + cell.data.username + '?',
            });
            dialog.afterClosed().subscribe((result: any) => {
                console.log(result, 'result');
                if (result && result?.action === 'success') {
                    this.sandbox.deleteUser(cell.data.userId).subscribe((res: any) => {
                        this._onUpdate.emit(true);
                        //this.router.navigate(['user-management/search']);
                    });
                }
            });
        }
    }

    getAdditionalDetails(data: any) {
        this.sandbox.getAdditionalDetails(data.userId).subscribe((res: any) => {
            this.dialog.openOverlayPanel('Edit User', UpdateUserComponent, res.data || {});
        });
    }

    onDestroy() {
        this.dialog.closePanel();
    }

    generateExcel() {
        this.sandbox.getUsers(this.form.value, 'excel').subscribe((res: any) => {});
    }
    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.users = this.users.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.users);
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
