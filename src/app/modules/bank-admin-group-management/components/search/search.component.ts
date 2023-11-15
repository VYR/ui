import { Component, OnInit } from '@angular/core';
import { BankAdminGroupManagementSandbox } from '../../bank-admin-group-management.sandbox';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { DECISION } from 'src/app/shared/enums';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { GroupAdminDialogComponent } from '../group-admin-dialog/group-admin-dialog.component';
import { Router } from '@angular/router';
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    rim = null;
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'groupId',
                displayName: 'GROUP ID',
                sortable: true,
            },
            {
                key: 'name',
                displayName: 'GROUP NAME',
                sortable: true,
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
                type: ColumnType.icon,
                icon: 'la-trash-alt',
            },
        ],
        selection: false,
        totalRecords: 0,
        clientPagination: true,
        data: [],
    };
    totalGroups: Array<any> = [];
    constructor(
        private sandbox: BankAdminGroupManagementSandbox,
        private router: Router,
        private dialog: CibDialogService
    ) {}
    ngOnInit() {
        this.sandbox.setActiveGroup(null);
        this.sandbox.setActiveRouter(null);
    }
    searchGroup() {
        this.sandbox.searchGroup({ rim: this.rim }).subscribe((res: any) => {
            if (res.data) {
                this.totalGroups = res.data;
                this.totalGroups = this.totalGroups.map((item: any) => {
                    return { ...item, groupId: item.group.groupId, name: item.group.name };
                });
                this.loadDataTable(this.totalGroups);
            }
        });
    }
    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.totalGroups = this.totalGroups.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable(this.totalGroups);
        }
    }

    loadDataTable(data: any) {
        this.tableConfig = {
            ...this.tableConfig,
            data: data,
            totalRecords: data.length,
        };
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'delete') {
            const ref = this.dialog.openDialog(CibDialogType.small, GroupAdminDialogComponent, {
                type: 'deleteGroup',
                title: 'Delete Group',
                messageToShow: 'Do you want to delete this group?',
            });
            ref.afterClosed().subscribe((result: any) => {
                if (result.decision == DECISION.CONFIRM) {
                    this.sandbox.deleteGroup(event.data.groupId).subscribe();
                }
            });
        } else {
            this.sandbox.setActiveGroup(event.data);
            this.sandbox.setActiveRouter(this.router.url);
            this.router.navigate([APP_ROUTES.CREATE_ADMIN_GROUP]);
        }
    }
}
