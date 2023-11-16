import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { BankadminDashboardSandbox } from '../../bank-admin-dashboard.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';

@Component({
    selector: 'app-my-queue',
    templateUrl: './my-queue.component.html',
    styleUrls: ['./my-queue.component.scss'],
})
export class MyQueueComponent {
    adminRequests: any = [];
    selectedStatus: any = ['Approved', 'Awaiting Approval', 'Rejected'];
    constructor(private sandBox: BankadminDashboardSandbox, private fb: FormBuilder, private dialog: CibDialogService) {
        this.searchForm = this.fb.group({
            type: [['Approved', 'Awaiting Approval', 'Rejected'], ''],
        });
    }

    query: CIBTableQuery = {
        pageIndex: 0,
        pageSize: 5,
        sortDirection: SortDirection.desc,
        sortKey: 'created',
    };

    tableConfig!: CIBTableConfig;
    searchForm!: UntypedFormGroup;
    filterPipe = new CIBDefinition();

    types = ['Approved', 'Awaiting Approval', 'Rejected'];
    selectedType = 'Rejected';

    public cols = [
        {
            key: 'created',
            displayName: 'DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'requestDescription',
            displayName: 'REQUEST TYPE',
            sortable: true,
        },
        {
            key: 'rimNumber',
            displayName: 'RIM',
        },
        {
            key: 'cibRef',
            displayName: 'REQUEST ID',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'currentState',
            displayName: 'WORKFLOW STATUS',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'requestStatus',
            displayName: 'REQUEST STATUS',
            type: ColumnType.status,
        },
    ];

    onStatusChange(event: any) {
        this.selectedStatus = event.value;
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.query = {
            pageIndex: 0,
            pageSize: 5,
            sortDirection: SortDirection.desc,
            sortKey: 'created',
        };
        this.getAdminRequests();
    }

    onClickCell(event: any) {
        if (event.key === 'cibRef') {
            this.openSidePanel(event.data);
        }
    }

    openSidePanel(selectedRow: any) {
        let fieldInfo: any = [
            { fieldName: 'Request Type', fieldValue: selectedRow.requestDescription },
            { fieldName: 'RIM Number', fieldValue: selectedRow.rimNumber },
        ];
        // REASON FOR ERROR
        if (selectedRow.responseData?.errors?.length > 0)
            fieldInfo.push({ fieldName: 'Reason For Error', fieldValue: selectedRow.responseData.errors[0].message });

        //CREATE AND UPDATE USER DETAILS
        if (
            [
                'USER_CREATE',
                'USER_UPDATE',
                'USER_UPDATE_DETAIL',
                'USER_UPDATE_ENTITLEMENT',
                'USER_UPDATE_ROLE',
                'USER_UPDATE_RIM',
            ].indexOf(selectedRow.requestType) !== -1
        ) {
            if (selectedRow?.requestData?.user) {
                const userDetails = selectedRow?.requestData.user;
                fieldInfo.push({ fieldName: 'Title', fieldValue: userDetails.title });
                fieldInfo.push({ fieldName: 'First Name', fieldValue: userDetails.firstNameEng });
                fieldInfo.push({ fieldName: 'Last Name', fieldValue: userDetails.lastNameEng });
                fieldInfo.push({ fieldName: 'Username', fieldValue: userDetails.email });
                fieldInfo.push({ fieldName: 'Email Id', fieldValue: userDetails.email });
                fieldInfo.push({ fieldName: 'Mobile Phone', fieldValue: userDetails.mobilePhone });
                fieldInfo.push({ fieldName: 'STP USER', fieldValue: userDetails.stpUser ? 'YES' : 'NO' });
                fieldInfo.push({ fieldName: 'Mobile Access', fieldValue: userDetails.mobileAccess ? 'YES' : 'NO' });
            }
            if (selectedRow.requestData?.userRim) {
                selectedRow.requestData?.userRim.forEach((element: any) => {
                    let rimData: any = [];
                    if (element.hasOwnProperty('fullAccPrivilege')) {
                        rimData.push({
                            fieldName: 'Full Account Privilige',
                            fieldValue: element.fullAccPrivilege ? 'YES' : 'NO',
                        });
                    }
                    if (element.hasOwnProperty('customer')) {
                        rimData.push({ fieldName: 'RIM Number', fieldValue: element.customer.rimnumber });
                    }
                    if (element.hasOwnProperty('role')) {
                        rimData.push({
                            fieldName: 'Role',
                            fieldValue: this.filterPipe.transform(element.role.type, 'USER_TYPES'),
                        });
                    }
                    if (rimData.length > 0) fieldInfo.push({ bulkFieldValue: rimData });
                });
            }
        }

        // GROUP CREATE, UPDATE, ADD AND DELETE USERS
        if (
            ['GROUP_CREATE', 'GROUP_UPDATE', 'USER_DELETE_PROPS', 'GROUP_USER_ADD'].indexOf(selectedRow.requestType) !==
            -1
        ) {
            if (selectedRow?.requestData?.customer) {
                const customerDetails = selectedRow?.requestData?.customer;
                fieldInfo.push({ fieldName: 'Corporate Name', fieldValue: customerDetails.firstnameeng });
            }
            if (selectedRow?.requestData?.group) {
                const groupDetails = selectedRow?.requestData?.group;
                fieldInfo.push({ fieldName: 'Group Name', fieldValue: groupDetails.name });
                fieldInfo.push({ fieldName: 'Verifier Group', fieldValue: groupDetails.verifierGroup ? 'YES' : 'NO' });
            }
            if (selectedRow?.requestData?.userGroup) {
                const userGroup = selectedRow?.requestData?.userGroup;
                fieldInfo.push({ fieldName: 'Group ID', fieldValue: userGroup.groupId });
                fieldInfo.push({ fieldName: 'User ID', fieldValue: userGroup.userId });
            }
            if (selectedRow?.requestData?.user) {
                const users = selectedRow?.requestData?.user || [];
                let assignedUsers: any[] = [];
                users.forEach((user: any) => {
                    assignedUsers.push(user.email);
                });
                fieldInfo.push({ fieldName: 'Assigned Users', fieldValue: assignedUsers });
            }
        }

        //ADD USER BUSINESS
        if (selectedRow.requestType === 'USER_BUSINESS') {
            if (selectedRow?.requestData) {
                const busineesData = selectedRow.requestData;
                fieldInfo.push({ fieldName: 'Business Group Name', fieldValue: busineesData.businessName });
                fieldInfo.push({
                    fieldName: 'Business Group Description',
                    fieldValue: busineesData.businessNameArabic,
                });
            }
        }
        // ADD POSITIVE PAY ACCOUNT
        if (selectedRow.requestType === 'POSITIVE_PAY_ADD_ACCOUNT') {
            if (selectedRow?.requestData) {
                const positivePayData = selectedRow.requestData;
                fieldInfo.push({
                    fieldName: 'Positive Pay Account Number',
                    fieldValue: positivePayData.accountNumber,
                });
            }
        }

        //ADD and UPDATE CUSTOMER for H2H
        if (selectedRow.requestType === 'H2H_UPDATE_CUSTOMER' || selectedRow.requestType === 'H2H_ADD_CUSTOMER') {
            if (selectedRow?.requestData) {
                const h2hData = selectedRow.requestData;
                fieldInfo.push({
                    fieldName: 'Encryption Required',
                    fieldValue: h2hData.isEncryptionRequired ? 'YES' : 'NO',
                });
                fieldInfo.push({
                    fieldName: 'STP Required',
                    fieldValue: h2hData.isH2HDirectRequired ? 'YES' : 'NO',
                });
                fieldInfo.push({
                    fieldName: 'File Name',
                    fieldValue: h2hData.fileName,
                });
                fieldInfo.push({
                    fieldName: 'Username',
                    fieldValue: h2hData.userName,
                });
                fieldInfo.push({
                    fieldName: 'Email ID',
                    fieldValue: h2hData.emailID,
                });
            }
        }

        // ADD & UPDATE & DELETE CORPORATE BUSINNES GROUP
        if (
            [
                'USER_BUSINESS_CUSTOMER_DELETE',
                'USER_UPDATE_BUSINESS_CUSTOMER',
                'USER_BUSINESS',
                'USER_BUSINESS_DELETE',
            ].indexOf(selectedRow.requestType) !== -1
        ) {
            if (selectedRow?.requestData) {
                fieldInfo.push({
                    fieldName: 'Corporate Business Group Name',
                    fieldValue: selectedRow?.requestData.businessName,
                });
                fieldInfo.push({
                    fieldName: 'Corporate Business Group Description',
                    fieldValue: selectedRow?.requestData.businessNameArabic,
                });
            }
        }
        if (selectedRow.requestType === 'ADMIN_ENTITLEMENT_UPDATE') {
            /* if (selectedRow?.requestData) {
                const data: Array<any> = selectedRow.requestData?.entitlements || [];
                data.forEach((ele: any) => {
                    fieldInfo.push({
                        fieldName: ele.name,
                        fieldValue: ele.enabled ? 'Enabled' : 'Removed',
                    });
                });
            }  */
            fieldInfo.push({ fieldName: 'Request ID', fieldValue: selectedRow.cibRef });
        }
        if (selectedRow.requestAction?.length > 0) {
            selectedRow.requestAction.forEach((action: any) => {
                if (action.action.name === 'REJECT' && action.note?.note) {
                    fieldInfo.push({ fieldName: 'Reason To Reject', fieldValue: action.note.note });
                }
            });
        }

        let activityInfo = [
            {
                fieldName: 'Created Date',
                fieldValue: moment(selectedRow.created).format('YYYY-MM-DD hh:mm A'),
                action: '',
            },
        ];

        if (selectedRow.currentState !== 'Awaiting Approval') {
            activityInfo.push({
                fieldName: selectedRow.currentState,
                fieldValue: selectedRow.updatedBy + ' ' + selectedRow.updated,
                action: 'complete',
            });
        }

        let data = {
            fields: fieldInfo,
            activity: activityInfo,
        };
        this.dialog.openDrawer('REQUEST SUMMARY', DetailViewComponent, data);
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.getAdminRequests();
    }

    public getAdminRequests() {
        this.sandBox.getAdminRequestList(this.query, this.selectedStatus).subscribe((res: any) => {
            if (res.data) {
                this.adminRequests = res.data.content;
                res.data.content.forEach((resp: any) => {
                    if (resp.requestData?.rimNumber) resp.rimNumber = resp.requestData?.rimNumber;
                    else if (resp.requestData?.rimnumber) resp.rimNumber = resp.requestData?.rimnumber;
                    else if (resp.requestData?.customer) resp.rimNumber = resp.requestData?.customer.rimnumber;
                    else if (resp.requestData?.rim) resp.rimNumber = resp.requestData?.rim;
                    else if (resp.requestData?.userGroup?.rim) resp.rimNumber = resp.requestData?.userGroup?.rim;
                    else if (resp.requestData?.userRim) {
                        let rims: any = [];
                        if (resp.requestData?.userRims) {
                            rims = resp.requestData?.userRims;
                        } else {
                            resp.requestData?.userRim.forEach((element: any) => {
                                if (element.hasOwnProperty('customer')) {
                                    rims.push(element.customer.rimnumber);
                                }
                            });
                        }

                        resp.rimNumber = rims.join(',');
                    } else if (resp.requestData?.businessRim) {
                        let rims: any = [];
                        resp.requestData?.businessRim.forEach((element: any) => {
                            if (element.hasOwnProperty('rimnumber')) {
                                rims.push(element.rimnumber);
                            } else {
                                rims.push(element);
                            }
                        });
                        resp.rimNumber = rims.join(',');
                    }
                    if (resp.currentState?.name === 'Approved')
                        resp.requestStatus = resp.responseData && resp.responseData.errors ? 'FAILED' : 'SUCCESS';
                    else if (resp.currentState?.name === 'Awaiting Approval') resp.requestStatus = 'PENDING';
                    else if (resp.currentState?.name === 'Rejected') resp.requestStatus = 'NOT APPLICABLE';
                    resp.currentState = resp.currentState?.name;
                });

                let config = {
                    columns: this.cols,
                    data: res.data.content,
                    selection: false,
                    totalRecords: res.data.totalElements,
                };

                this.tableConfig = config;
            }
        });
    }
}
