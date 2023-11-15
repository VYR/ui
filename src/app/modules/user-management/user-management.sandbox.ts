import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import * as moment from 'moment';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { UtilService } from 'src/app/utility';
import { UsermanagementService } from './user-management.service';

@Injectable({
    providedIn: 'root',
})
export class UsermanagementSandbox {
    constructor(
        private service: UsermanagementService,
        private util: UtilService,
        private router: Router,
        private utilService: UtilService
    ) {}

    getOptions() {
        return this.service.getOptions();
    }

    getGroups() {
        return this.service.getGroups().pipe(map((res: any) => res.data || []));
    }

    getRims(text: string): Observable<Array<any>> {
        return this.service.getRims(text).pipe(map((res: any) => res.data || []));
    }

    getBusinessRims(businessId: string) {
        if (!businessId) {
            return new Observable((subscriber: any) => {
                subscriber.next([]);
            });
        }
        return this.service.getBusinessRims(businessId).pipe(map((res: any) => res.data || []));
    }

    getEntitlements() {
        return this.service.getEntitlements().pipe(map((res: any) => res.data || []));
    }

    getAccounts(rimNumber: string) {
        return this.service.getAccounts(rimNumber).pipe(map((res: any) => res.data));
    }

    createUser(request: any) {
        return this.service.createUser(request).pipe(
            tap((res: any) => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    this.util.displayNotification(
                        res.statusCode == 200
                            ? `User has been Created successfully!`
                            : `Request for Create User has been submitted successfully!`,
                        'success'
                    );
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }

    addNewRole(request: any) {
        return this.service.addNewRole(request).pipe(
            tap((res: any) => {
                if (res.statusCode === 201) {
                    this.util.displayNotification(
                        `Request for Add New Role has been submitted successfully!`,
                        'success'
                    );
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }

    updateUser(request: any) {
        return this.service.updateUser(request).pipe(
            tap((res: any) => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    this.util.displayNotification(
                        res.statusCode == 200
                            ? `User has been Updated successfully!`
                            : `Request for Update User has been submitted successfully!`,
                        'success'
                    );
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }

    updateUserEntitlement(request: any, mode: string) {
        return this.service.updateUserEntitlement(request, mode).pipe(
            tap((res: any) => {
                if (res.statusCode === 201) {
                    this.util.displayNotification(
                        `Request for Update User Entitlements has been submitted successfully!`,
                        'success'
                    );
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }

    getUsers(request: any, downloadType?: any) {
        if (downloadType && downloadType === 'excel') {
            return this.service.getUsers(request).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        res.data.forEach((x: any) => {
                            x.fullName = `${x.firstNameEng} ${x.lastNameEng}`;
                        }) || [];
                        this.utilService.exportAsExcelFile(this.formatUsersForExcel(res.data || []), 'USERS_REPORT');
                        this.utilService.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        }
        return this.service.getUsers(request);
    }

    formatUsersForExcel(data: any) {
        const temps: any = [];
        data.forEach((value: any) => {
            let tempObject: any = {};
            (tempObject['CREATED ON'] = moment(value.created).format('YYYY-MM-DD hh:mm A')),
                (tempObject['USERNAME'] = value.username);
            tempObject['FULL NAME'] = value.fullName;
            tempObject['EMAIL ID'] = value.email;
            tempObject['MOBILE NUMBER'] = value.mobilePhone;
            tempObject['STATUS'] = value.enabled ? 'Active' : 'Inactive';
            temps.push(tempObject);
        });
        return temps;
    }

    unlockUser(request: any) {
        return this.service.unlockUser(request).pipe(
            tap((res: any) => {
                if (res.statusCode === 200) {
                    this.util.displayNotification(`${request} has been Unlocked successfully!`, 'success');
                }
            })
        );
    }

    unlockUserOtp(request: any) {
        return this.service.unlockUserOtp(request).pipe(
            tap((res: any) => {
                if (res.statusCode === 200) {
                    this.util.displayNotification(
                        `OTP of the user ${request} has been Unlocked successfully!`,
                        'success'
                    );
                }
            })
        );
    }

    getAdditionalDetails(request: any) {
        return this.service.getAdditionalDetails(request);
    }

    checkUserName(userName: string) {
        return this.service.checkUserName(userName).pipe(
            tap((res: any) => {
                if (res.statusCode !== 200) {
                    this.util.displayNotification(
                        `Username ${userName} has already been taken. Please give some other Username`,
                        'error'
                    );
                }
            })
        );
    }

    getEntitlementsbyRim(request: any) {
        if (!request.userId)
            return new Observable((subscriber) => {
                subscriber.next([]);
            });
        return this.service
            .getEntitlementsbyRim(request)
            .pipe(map((res: any) => (res.data.userRim.length ? res.data.userRim[0] : [])));
    }

    deleteRim(rim: any, userId: any) {
        return this.service.deleteRim(rim, userId).pipe(
            tap((res: any) => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    this.util.displayNotification(`Request for Delinking RIM has been sent for approval!`, 'success');
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }

    deleteUser(userId: any) {
        return this.service.deleteUser(userId).pipe(
            tap((res: any) => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    this.util.displayNotification(`Request for delete user has been sent for approval!`, 'success');
                    this.router.navigate([APP_ROUTES.ADMIN_USER_MANAGEMENT]);
                }
            })
        );
    }
}
