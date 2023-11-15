import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { AuditTrailSandbox } from './audit-trail.sandbox';
import { AuditTrailService } from './audit-trail.service';
import { USER_TYPE } from 'src/app/shared/enums';
@Component({
    selector: 'app-audit-trail',
    templateUrl: './audit-trail.component.html',
    styleUrls: ['./audit-trail.component.scss'],
})
export class AuditTrailComponent {
    USER_TYPE = USER_TYPE;
    report: any = [];
    sortedData: any = [];
    isUserFound: boolean = false;
    constructor(
        private _formBuilder: FormBuilder,
        private sandBox: AuditTrailSandbox,
        private dialog: AuditTrailService
    ) {
        if (this.sandBox.userContext.userType !== USER_TYPE.BANK_ADMIN) {
            this.searchRIM();
        }
    }

    ngOnInit(): void {
        this.searchFormBuilder();
    }

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'userName',
    };

    userNames: any = [];

    serviceTypes: any = [
        'Account',
        'Last Login and Logout',
        'Service Request',
        'Credit Cards',
        'Transfers',
        'Future Dated Transfers',
        'Beneficiary Management',
        'Payment',
        'Trade Finance',
        'Cheque Management',
        'Liquidity Management',
        'Approve and Reject of Request',
    ];

    public cols = [
        {
            key: 'userName',
            displayName: this.sandBox.userContext.userType === USER_TYPE.BANK_ADMIN ? 'User Name' : 'Admin Name',
            sortable: true,
        },
        {
            key: 'activity',
            displayName: 'Activity',
            sortable: true,
        },
    ];

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 3, new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'From Date';
    toDateLabel = 'To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5 };
    tableConfig!: CIBTableConfig;
    rimInput!: number;

    searchRIM() {
        this.userNames = [];
        this.sandBox.getUsersUnderRim(this.rimInput).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.isUserFound = true;
                this.userNames = res.data;
            }
        });
    }

    generateExcel() {
        let users = this.searchForm.controls['userName'].value;
        let userIds: any[] = [];
        users.forEach((user: { userId: any }) => {
            userIds.push(user.userId.toString());
        });
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                userList: userIds,
                userActivity: this.searchForm.controls['serviceType']?.value,
            };

            this.sandBox.getAuditReport(params, 'excel').subscribe((res: any) => {});
        }
    }

    generatePdf() {
        let users = this.searchForm.controls['userName'].value;
        let userIds: any[] = [];
        users.forEach((user: { userId: any }) => {
            userIds.push(user.userId.toString());
        });
        if (this.startDate && this.endDate) {
            let params = {
                fromDate: this.startDate,
                toDate: this.endDate,
                userList: userIds,
                userActivity: this.searchForm.controls['serviceType']?.value,
                pageNumber: 0,
                pageSize: 1000,
                downloadType: 'pdf',
            };

            this.sandBox.getAuditReport(params).subscribe((res: any) => {});
        }
    }

    searchAuditTrail() {
        this.report = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.cols = [
            {
                key: 'userName',
                displayName: this.sandBox.userContext.userType === USER_TYPE.BANK_ADMIN ? 'User Name' : 'Admin Name',
                sortable: true,
            },
            {
                key: 'activity',
                displayName: 'Activity',
                sortable: true,
            },
        ];
        if (this.startDate && this.endDate) {
            let users = this.searchForm.controls['userName'].value;
            let userIds: any[] = [];
            users.forEach((user: { userId: any }) => {
                userIds.push(user.userId.toString());
            });
            let payload = {
                rimNumber: this.rimInput,
                fromDate: this.startDate,
                toDate: this.endDate,
                userList: userIds,
                userActivity: this.searchForm.controls['serviceType']?.value,
            };

            this.sandBox.getAuditReport(payload).subscribe((res: any) => {
                if (res.data) {
                    let newCol = [
                        {
                            key: 'activityKey',
                            displayName: 'Service Type',
                            sortable: true,
                        },
                        {
                            key: 'activityPerformedOnDate',
                            displayName: 'Date and Time',
                            type: ColumnType.date,
                            sortable: true,
                        },
                    ];

                    if (this.sandBox.userContext.userType === USER_TYPE.BANK_ADMIN) {
                        this.cols.push(newCol[0]);
                        this.cols.push(newCol[1]);
                    } else if (this.sandBox.userContext.userType === USER_TYPE.BANK_ADMIN_APPROVER) {
                        this.cols.push(newCol[1]);
                    }
                    this.report = res.data;
                    this.tableConfig = {
                        columns: this.cols,
                        data: res.data,
                        selection: false,
                        totalRecords: res.data.length,
                        clientPagination: true,
                    };
                }
            });
        }
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.sortedData,
            selection: false,
            totalRecords: this.sortedData.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.sortedData = this.report.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    enableSearch(): boolean {
        if (this.rimInput && this.rimInput.toString().length > 0) return false;
        return true;
    }

    searchFormBuilder() {
        if (this.sandBox.userContext.userType === USER_TYPE.BANK_ADMIN) {
            return (this.searchForm = this._formBuilder.group({
                fromDate: [null, Validators.required],
                toDate: [null, Validators.required],
                userName: [null, Validators.required],
                serviceType: [null, Validators.required],
            }));
        } else {
            return (this.searchForm = this._formBuilder.group({
                fromDate: [null, Validators.required],
                toDate: [null, Validators.required],
                userName: [null, Validators.required],
            }));
        }
    }
}
