import { Component, OnInit } from '@angular/core';
import { BankadminDashboardSandbox } from '../../bank-admin-dashboard.sandbox';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-feature-config-corporate',
    templateUrl: './feature-config-corporate.component.html',
    styleUrls: ['./feature-config-corporate.component.scss'],
})
export class FeatureConfigCorporateComponent implements OnInit {
    tableConfig!: CIBTableConfig;
    entitlementsList: Array<any> = [];
    public cols = [
        {
            key: 'name',
            displayName: 'Module Name',
            sortable: true,
        },
        {
            key: 'userEnable',
            displayName: 'Action',
            type: ColumnType.switch,
            callBackFn: this.checkForAction,
        },
    ];
    constructor(private sandbox: BankadminDashboardSandbox, private router: Router) {}

    ngOnInit(): void {
        this.sandbox.getEntitlementsForCorporate().subscribe((res: any) => {
            if (res.data) {
                this.entitlementsList = res.data;
                let config = {
                    columns: this.cols,
                    data: this.entitlementsList,
                    selection: false,
                    clientPagination: true,
                    totalRecords: this.entitlementsList.length,
                };

                this.tableConfig = config;
            }
        });
    }

    checkForAction(data: any) {
        return ['ACCOUNTS', 'BENEFICIARY'].indexOf(data.uuid) === -1;
    }

    sendRequest() {
        const entitlements: Array<any> = this.entitlementsList.map((entitlement: any) => {
            return {
                enabled: entitlement.userEnable,
                entitleId: entitlement.entitleId,
                name: entitlement.name,
                uuid: entitlement.uuid,
            };
        });
        this.sandbox.updateEntitlementsForCorporate({ entitlements }).subscribe((res: any) => {
            this.router.navigate(['home/admin/my-queue']);
        });
    }
}
