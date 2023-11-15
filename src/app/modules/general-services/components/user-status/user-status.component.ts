import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { REQUEST_LIST_TYPE } from 'src/app/shared/enums/';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { DECISION } from 'src/app/shared/enums';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-user-status',
    templateUrl: './user-status.component.html',
    styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {
    users: any = []; //For users drop down
    isRequestSuccess: boolean = false;
    selectedUser: any; // For ngModel data
    statusData: any = { statusTitle: '', requestType: 'userStatus' }; // Notification Data
    module: any;
    constructor(private sandBox: GeneralServicesSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getUsers();
        this.module = SERVICE_REQUEST_TYPES[6];
    }

    //To populate dropdown
    getUsers() {
        this.sandBox.getUserStatusDetails().subscribe((res: any) => {
            if (res.data) {
                this.users = res.data;
            }
        });
    }

    public processUserStatusRequest() {
        this.confirmRequest(this.selectedUser, 'VERIFY');
    }
    openPopup(isOTPReceived: boolean, selectedUser: any, status: any) {
        const payLoad = {
            details: {
                data: {
                    requestType: '19',
                    info1: selectedUser.userId,
                    info2: selectedUser.username,
                    info3: status,
                    info4: selectedUser.email,
                    mobileNo: selectedUser.mobilePhone,
                    isOTPEnabled: true,
                },
            },
        };

        const ref = this.dialog.openDrawer('User Status Request Summary', GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {
            if (result.decision == DECISION.CONFIRM) {
                this.confirmRequest(selectedUser, 'CONFIRM', isOTPReceived, result.data.otp);
            }
        });
    }
    public confirmRequest(selectedUser: any, action: any, isOTPReceived = false, otp = '') {
        let status = selectedUser.enabled ? 'Deactivate' : 'Activate';
        let payload = {
            request: {
                userId: selectedUser?.userId,
                userName: selectedUser?.username,
                toggleToStatus: status,
            },
            requestDetails: {
                user: selectedUser,
            },
            action: action,
            validateOTPRequest: isOTPReceived ? { softTokenUser: false, otp: otp } : {},
        };
        this.sandBox.requestUserStatus(payload).subscribe((res: any) => {
            if (res) {
                if (action === 'VERIFY') {
                    let isOTPReceived = true;
                    this.openPopup(isOTPReceived, selectedUser, status);
                } else {
                    if (res.data) {
                        this.isRequestSuccess = true;
                        this.statusData.requestType = '19';
                        this.statusData.info1 = selectedUser.userId;
                        this.statusData.info2 = selectedUser.username;
                        this.statusData.info3 = status;
                        (this.statusData.info4 = selectedUser.email),
                            (this.statusData.mobileNo = selectedUser.mobilePhone),
                            (this.statusData.statusMessage = res.data.requestId
                                ? 'Your Request has been sent for approval. Request ID #: ' + res.data.requestId
                                : 'Your Request has been created successfully. Request ID #' + res.data);
                    }
                }
            }
        });
    }
}
