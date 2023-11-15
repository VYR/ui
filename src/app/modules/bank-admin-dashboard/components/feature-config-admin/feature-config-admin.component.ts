import { Component, OnInit } from '@angular/core';
import { BankadminDashboardSandbox } from '../../bank-admin-dashboard.sandbox';
import { Router } from '@angular/router';

@Component({
    selector: 'app-feature-config-admin',
    templateUrl: './feature-config-admin.component.html',
    styleUrls: ['./feature-config-admin.component.scss'],
})
export class FeatureConfigAdminComponent implements OnInit {
    entitlementsList: Array<any> = [];
    constructor(private sandbox: BankadminDashboardSandbox, private router: Router) {}

    ngOnInit(): void {
        this.sandbox.getEntitlementsForAdmin().subscribe((res: any) => {
            if (res.data) {
                this.entitlementsList = res.data;
                this.entitlementsList = this.entitlementsList.sort((a: any, b: any) => {
                    return this.compare(a.name, b.name, true);
                });
            }
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    updateParent(event: any, parent: any) {
        parent.isEnabled = event.checked;
        parent.children.map((child: any) => {
            child.isEnabled = parent.isEnabled;
        });
    }
    updateChildren(event: any, child: any, parent: any) {
        child.isEnabled = event.checked;
        const enabledChildren: Array<any> = parent.children.filter((child: any) => child.isEnabled);
        parent.isEnabled = enabledChildren.length > 0;
    }

    sendRequest() {
        const entitlements: Array<any> = [];
        this.entitlementsList.forEach((data: any) => {
            entitlements.push({
                enabled: data.isEnabled,
                entitleId: data.id,
                name: data.name,
                uuid: data.UUID,
            });
            if (data.children.length) {
                data.children.forEach((child: any) => {
                    entitlements.push({
                        enabled: child.isEnabled,
                        entitleId: child.id,
                        name: child.name,
                        uuid: child.UUID,
                    });
                });
            }
        });
        this.sandbox.updateEntitlementsForAdmin({ entitlements }).subscribe((res: any) => {
            this.router.navigate(['home/admin/my-queue']);
        });
    }
}
