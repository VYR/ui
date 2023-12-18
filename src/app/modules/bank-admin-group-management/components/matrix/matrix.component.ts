import { Component, OnInit } from '@angular/core';
import { BankAdminGroupManagementSandbox } from '../../bank-admin-group-management.sandbox';
import { Router } from '@angular/router';
@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss'],
})
export class MatrixComponent implements OnInit {
    entitlementsList: Array<any> = [];
    allowedEntitlements: Array<any> = [
        'ACCOUNTS',
        'BENEFICIARY',
        'PAYMENT',
        'CARDS',
        'TRANSFER',
        'TRADE_FINANCE',
        'GENERAL_SERVICES',
        'STO',
        'CHEQUE_MANAGEMENT',
        'LIQUIDITY_MANAGEMENT',
    ];
    enableButton: boolean = true;
    businessGroupList: Array<any> = [];
    corporatesList: Array<any> = [];
    selectedBusinessGroup: any;
    selectedCorpGroup: any;
    filteredGroups!: Array<any>;
    constructor(private sandbox: BankAdminGroupManagementSandbox, private router: Router) {}

    ngOnInit(): void {
        this.sandbox.setActiveRouter(this.router.url);
        this.getBusinessGroupsList();
    }
    setForAll(event: any, index: any, groupsAndConditions: Array<any>) {
        this.entitlementsList = this.entitlementsList.map((el: any, i: any) => {
            if (event.checked) {
                el.groupsAndConditions = el.groupsAndConditions.map((grp: any, j: any) => {
                    grp['group_' + j] = groupsAndConditions[j]['group_' + j] || '';
                    grp['cond_' + j] = groupsAndConditions[j]['cond_' + j] || '';
                    return grp;
                });
                if (index != i) el.applyForAll = !event.checked;
            } else el.groupsAndConditions = this.prepareConditions(el);
            return el;
        });
    }

    changeValue(target: any) {
        const filterValue = (target.value || '').toLowerCase();
        const groups = this.businessGroupList.filter((option: any) =>
            option['businessName'].toLowerCase().includes(filterValue)
        );
        this.filteredGroups = groups;
    }

    resetEntitlements() {
        this.entitlementsList.length = 0;
    }

    onSelectGroup(target: any) {
        this.corporatesList = [];
        const businessName = (target.value.trim() || '').toLowerCase();
        const index = this.businessGroupList.findIndex(
            (option: any) => option['businessName'].toLowerCase() === businessName
        );
        if (index !== -1) {
            this.sandbox
                .getBusinessCustomers({ businessId: this.businessGroupList[index].businessId })
                .subscribe((res: any) => {
                    if (res.data) this.corporatesList = res.data;
                    if (this.corporatesList.length > 0) {
                        this.selectedCorpGroup = this.corporatesList[0];
                        this.getSelectedCorporate(this.corporatesList[0]);
                    }
                });
        }
    }

    getBusinessGroupsList() {
        this.sandbox.getBusinessGroupsList().subscribe((res: any) => {
            if (res.data) {
                this.businessGroupList = res.data;
            }
        });
    }

    getSelectedCorporate(value: any) {
        this.sandbox.getGroupDefinition({ rim: value.uniqueUserId }).subscribe((res: any) => {
            if (res.data) {
                this.entitlementsList = res.data;
                if (this.entitlementsList.length > 0) {
                    this.entitlementsList = this.entitlementsList.map((el: any) => {
                        return {
                            ...el,
                            groupsAndConditions: this.prepareConditions(el),
                            showMoreGrp: false,
                            applyForAll: false,
                        };
                    });
                    const total = this.entitlementsList.reduce((total: any, el: any) => {
                        return total + el.group.length;
                    }, 0);
                    this.enableButton = total == 0;
                }
            }
        });
    }
    prepareConditions(el: any) {
        let conditions: Array<any> = [];
        const existingExpression = el?.expression || '';
        const condns: Array<any> = existingExpression.length == 0 ? [] : existingExpression.split(' ');
        let existingtGroups: Array<any> = [];
        let existingConditions: Array<any> = [];
        condns.forEach((el: any) => {
            if (isNaN(el)) existingConditions.push(el);
            else existingtGroups.push(el);
        });
        for (let i = 0; i < 10; i++) {
            let tmpObj: any = {};
            tmpObj['group_' + i] = existingtGroups.length > i ? parseInt(existingtGroups[i]) : '';
            tmpObj['cond_' + i] = existingConditions.length > i ? existingConditions[i] : '';
            conditions.push(tmpObj);
        }
        return conditions;
    }
    getExpression(groupsAndConditions: Array<any>) {
        let expression: any = '';
        groupsAndConditions.forEach((el: any, i: any) => {
            if (el['group_' + i]) {
                expression += el['group_' + i] + ' ';
            }
            if (el['cond_' + i]) {
                expression += el['cond_' + i] + ' ';
            }
        });
        return expression.trim();
    }
    sendRequest() {
        let matrix: Array<any> = [];
        this.entitlementsList.forEach((el: any) => {
            if (this.allowedEntitlements.includes(el.entitlement.uuid)) {
                matrix.push({ definitionId: el.definitionId, expression: this.getExpression(el.groupsAndConditions) });
            }
        });
        let payload: any = {
            rimNumber: this.selectedCorpGroup.uniqueUserId,
            matrix: matrix,
        };
        this.sandbox.updateGroupMatrix(payload, { rimNumber: this.selectedCorpGroup.uniqueUserId }).subscribe();
    }

    getEntitlementName(index: number) {
        return this.entitlementsList[index].entitlement.name;
    }

    refresh(index: any) {
        let conditions: Array<any> = [];
        for (let i = 0; i < 10; i++) {
            let tmpObj: any = {};
            tmpObj['group_' + i] = '';
            tmpObj['cond_' + i] = '';
            conditions.push(tmpObj);
        }
        this.entitlementsList[index].groupsAndConditions = conditions;
        this.entitlementsList[index].showMoreGrp = false;
    }
}
