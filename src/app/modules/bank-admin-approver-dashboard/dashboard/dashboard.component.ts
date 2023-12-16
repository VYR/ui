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
import { BankadminApproverDashboardSandbox } from '../bank-admin-approver-dashboard.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';
import { CIBDefinition } from 'src/app/shared/pipes/cib-definition.pipe';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    adminRequests: any = [];
    selectedType: any;
    epr: any;
    filterPipe = new CIBDefinition();
    constructor(
        private sandBox: BankadminApproverDashboardSandbox,
        private dialog: CibDialogService,
        private fb: FormBuilder
    ) {
        this.searchForm = this.fb.group({
            type: [null, ''],
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

    types = [
        'USER_CREATE',
        'USER_UPDATE',
        'USER_UPDATE_DETAIL',
        'USER_UPDATE_ROLE',
        'USER_UPDATE_ENTITLEMENT',
        'USER_UPDATE_RIM',
        'GROUP_CREATE',
        'GROUP_UPDATE',
        'GROUP_DELETE',
        'GROUP_USER_ADD',
        'USER_DELETE_PROPS',

        'USER_BUSINESS',
        'USER_BUSINESS_DELETE',
        'USER_UPDATE_BUSINESS_CUSTOMER',
        'USER_BUSINESS_CUSTOMER_DELETE',
        'POSITIVE_PAY_ADD_ACCOUNT',
        'H2H_ADD_CUSTOMER',
        'H2H_UPDATE_CUSTOMER',
        'UPDATE_WORKFLOW_DEF',
        'ADMIN_DOCUMENT_UPLOAD',
        'USER_DEVICE_DEREGISTER',
    ];

    public cols = [
        {
            key: 'created',
            displayName: 'DATE',
            type: ColumnType.date,
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
            key: 'requestDescription',
            displayName: 'TYPE',
            sortable: true,
        },
        {
            key: 'createdBy',
            displayName: 'Created By',
            sortable: true,
        },
        {
            key: 'reject',
            displayName: 'Reject',
            type: ColumnType.reject,
        },
        {
            key: 'approve',
            displayName: 'Approve',
            type: ColumnType.approve,
        },
    ];

    onClickCell(event: any) {
        if (event.key === 'cibRef') {
            this.openSidePanel(event.data, event.key);
        }
        if (event.key === 'approve' || event.key === 'reject') {
            this.onActionClick(event.data, event.key, 'VERIFY', { otp: '', notes: '' });
        }
    }

    resetTheSearchCriteria() {
        this.searchForm.controls['type'].reset();
        this.selectedType = [];
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

    onTypeChange(event: any) {
        this.selectedType = event.value;
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

    onActionClick(selectedRow: any, rowkey: any, action: any, reqData: any) {
        const data = {
            actionId: [
                rowkey === selectedRow.requestAction[1]?.action?.name.toLowerCase()
                    ? selectedRow.requestAction[1]?.id
                    : selectedRow.requestAction[0]?.id,
            ],
            notes: reqData.notes,
            action: action,
            validateOTPRequest: { softTokenUser: false, otp: reqData.otp },
        };
        //add loader
        this.sandBox.actOnAdminRequest(data, action, rowkey).subscribe((response: any) => {
            if (response.data) {
                if (action === 'VERIFY') {
                    setTimeout(() => {
                        this.openSidePanel(selectedRow, rowkey);
                    }, 850);
                }
            }
        });
    }

    openSidePanel(selectedRow: any, rowkey: any) {
        let fieldInfo: any = [
            { fieldName: 'Request Type', fieldValue: selectedRow.requestDescription },
            { fieldName: 'RIM Number', fieldValue: selectedRow.uniqueUserId },
        ];

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
                const userDetails = selectedRow?.requestData?.user;
                fieldInfo.push({ fieldName: 'Title', fieldValue: userDetails.title });
                fieldInfo.push({ fieldName: 'First Name', fieldValue: userDetails.firstNameEng });
                fieldInfo.push({ fieldName: 'Last Name', fieldValue: userDetails.lastNameEng });
                fieldInfo.push({ fieldName: 'Username', fieldValue: userDetails.email });
                fieldInfo.push({ fieldName: 'Email Id', fieldValue: userDetails.email });
                fieldInfo.push({ fieldName: 'Mobile Phone', fieldValue: userDetails.mobilePhone });
                fieldInfo.push({ fieldName: 'STP USER', fieldValue: userDetails.stpUser ? 'YES' : 'NO' });
                fieldInfo.push({ fieldName: 'Mobile Access', fieldValue: userDetails.mobileAccess ? 'YES' : 'NO' });
                fieldInfo.push({ fieldName: 'User Status', fieldValue: userDetails.enabled ? 'Active' : 'Inactive' });
                if (!userDetails.enabled)
                    fieldInfo.push({ fieldName: 'Remarks', fieldValue: userDetails?.comments || '' });
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
                        rimData.push({ fieldName: 'RIM Number', fieldValue: element.customer.uniqueUserId });
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
            ['GROUP_CREATE', 'GROUP_UPDATE', 'GROUP_DELETE', 'USER_DELETE_PROPS', 'GROUP_USER_ADD'].indexOf(
                selectedRow.requestType
            ) !== -1
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
        fieldInfo.push({
            fieldName: 'Created Date',
            fieldValue: moment(selectedRow.created).format('YYYY-MM-DD hh:mm A'),
        });
        fieldInfo.push({ fieldName: 'Created By', fieldValue: selectedRow.createdBy });

        fieldInfo.push({ fieldName: 'Device Id', fieldValue: selectedRow?.requestData?.deviceId });

        let data = {
            fields: fieldInfo,
            isOtpNeeded: false,
            action: rowkey,
        };
        if (rowkey === 'approve' || rowkey === 'reject') {
            data.isOtpNeeded = true;
        }
        const dialogRef = this.dialog.openDrawer('REQUEST SUMMARY', DetailViewComponent, data);
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.event === 'confirm') {
                this.onActionClick(selectedRow, rowkey, 'CONFIRM', result.data);
            }
        });
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.getAdminRequests();
    }

    public getAdminRequests() {
        this.sandBox.getAdminApproverRequestList(this.query, this.selectedType).subscribe((res: any) => {
            if (res.data) {
                this.adminRequests = res.data.content;
                res.data.content.forEach((resp: any) => {
                    if (resp.businessRim) resp.uniqueUserId = resp.requestData?.businessRim[0].uniqueUserId;
                    else if (resp.requestData?.uniqueUserId) resp.uniqueUserId = resp.requestData?.uniqueUserId;
                    else if (resp.requestData?.uniqueUserId) resp.uniqueUserId = resp.requestData?.uniqueUserId;
                    else if (resp.requestData?.customer) resp.uniqueUserId = resp.requestData?.customer.uniqueUserId;
                    else if (resp.requestData?.rim) resp.uniqueUserId = resp.requestData?.rim;
                    else if (resp.requestData?.userGroup?.rim) resp.uniqueUserId = resp.requestData?.userGroup?.rim;
                    else if (resp.requestData?.userRim) {
                        let rims: any = [];
                        if (resp.requestData?.userRims) {
                            rims = resp.requestData?.userRims;
                        } else {
                            resp.requestData?.userRim.forEach((element: any) => {
                                if (element.hasOwnProperty('customer')) {
                                    rims.push(element.customer.uniqueUserId);
                                }
                            });
                        }
                        resp.uniqueUserId = rims.join(',');
                    } else if (resp.requestData?.businessRim) {
                        let rims: any = [];
                        resp.requestData?.businessRim.forEach((element: any) => {
                            if (element.hasOwnProperty('rimnumber')) {
                                rims.push(element.uniqueUserId);
                            } else {
                                rims.push(element);
                            }
                        });
                        resp.uniqueUserId = rims.join(',');
                    }
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
