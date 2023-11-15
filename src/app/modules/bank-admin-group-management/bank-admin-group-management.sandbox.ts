import { Injectable } from '@angular/core';
import { BankAdminGroupManagementService } from './bank-admin-group-management.service';
import { UtilService } from 'src/app/utility/utility.service';
import { tap, Observable, Subject, BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class BankAdminGroupManagementSandbox {
    private unsubscribe$ = new Subject<void>();

    private _selectedGroup = new BehaviorSubject<any>(null);
    private _selectedRouter = new BehaviorSubject<any>(null);
    public selectedGroup: Observable<any>;
    public selectedRouter: Observable<any>;

    constructor(private service: BankAdminGroupManagementService, private utilService: UtilService) {
        this.selectedGroup = this._selectedGroup.asObservable();
        this.selectedRouter = this._selectedRouter.asObservable();
    }

    setActiveGroup(data: any) {
        this._selectedGroup.next(data);
    }
    setActiveRouter(data: any) {
        this._selectedRouter.next(data);
    }
    getEntitlements() {
        return this.service.getEntitlements();
    }
    getBusinessGroupsList() {
        return this.service.getBusinessGroupsList();
    }
    getBusinessCustomers(queryParams: any) {
        return this.service.getBusinessCustomers(queryParams);
    }
    getGroupDefinition(queryParams: any) {
        return this.service.getGroupDefinition(queryParams);
    }

    updateGroupMatrix(postParams: any, queryParams: any) {
        return this.service.updateGroupMatrix(postParams, queryParams).pipe(
            tap((res: any) => {
                if (res) this.utilService.displayNotification('Request has been sent for approval', 'success');
            })
        );
    }
    searchUserByRIM(queryParams: any) {
        return this.service.searchUserByRIM(queryParams);
    }

    createGroup(postParams: any) {
        return this.service.createGroup(postParams).pipe(
            tap((res: any) => {
                if (res.status === 'APPROVAL_REQUESTED')
                    this.utilService.displayNotification('Entitlement approval request has been sent', 'success');
                else this.utilService.displayNotification('Entitlement approved successfully', 'success');
            })
        );
    }

    updateGroup(postParams: any, queryParams: any) {
        return this.service.updateGroup(postParams, queryParams).pipe(
            tap((res: any) => {
                if (res) this.utilService.displayNotification('Request has been sent for approval', 'success');
            })
        );
    }

    searchGroup(queryParams: any) {
        return this.service.searchGroup(queryParams);
    }
    getGroupByRIM(queryParams: any) {
        return this.service.getGroupByRIM(queryParams);
    }
    getGroupUsers(queryParams: any) {
        return this.service.getGroupUsers(queryParams);
    }

    deleteGroup(groupId: any) {
        return this.service.deleteGroup({ validateGroupId: groupId, groupId }).pipe(
            tap((res: any) => {
                if (res.status === 'APPROVAL_REQUESTED')
                    this.utilService.displayNotification(
                        'User group delete has been submitted for approval',
                        'success'
                    );
                else this.utilService.displayNotification('User group deleted successfully', 'success');
            })
        );
    }
    deleteGroupUser(queryParams: any) {
        return this.service.deleteGroupUser(queryParams).pipe(
            tap((res: any) => {
                if (res.status === 'APPROVAL_REQUESTED')
                    this.utilService.displayNotification('User delete request has been submitted', 'success');
                else this.utilService.displayNotification('User deleted successfully', 'success');
            })
        );
    }
    updateUserGroup(postParams: any, queryParams: any) {
        return this.service.updateUserGroup(postParams, queryParams).pipe(
            tap((res: any) => {
                if (res.status === 'APPROVAL_REQUESTED')
                    this.utilService.displayNotification('Request submitted for approval', 'success');
                else this.utilService.displayNotification('Updated successfully', 'success');
            })
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
