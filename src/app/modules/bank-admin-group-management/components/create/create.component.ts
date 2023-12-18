import { Component, OnInit } from '@angular/core';
import { BankAdminGroupManagementSandbox } from '../../bank-admin-group-management.sandbox';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { Router } from '@angular/router';
import {
    FormArray,
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    ValidationErrors,
    FormGroup,
} from '@angular/forms';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
    entitlementsList: Array<any> = [];
    selectedUserId: any;
    selectedGroup: any = null;
    selectedRouter: any = null;
    showEntitlementsSection: boolean = false;
    isUpdate: boolean = false;
    form!: UntypedFormGroup;
    rimsList: Array<any> = [];
    enableButton: boolean = true;
    constructor(
        private sandbox: BankAdminGroupManagementSandbox,
        private fb: UntypedFormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.sandbox.selectedGroup.subscribe((res: any) => {
            if (res) {
                this.selectedGroup = res;
            }
        });
        this.sandbox.selectedRouter.subscribe((res: any) => {
            if (res) {
                this.selectedRouter = res;
                this.selectedGroup = this.selectedRouter === APP_ROUTES.ADMIN_GROUP_SEARCH ? this.selectedGroup : null;
            }
        });
        this.sandbox.getEntitlements().subscribe((res: any) => {
            if (res.data) {
                this.entitlementsList = res.data;
                this.showForm();
                if (this.selectedGroup) {
                    this.selectedUserId = this.selectedGroup.customer;
                    this.showEntitlementsSection = true;
                }
            }
        });
        this.form = this.fb.group({
            rimNumber: [this.selectedGroup ? this.selectedGroup.customer.uniqueUserId : null, [Validators.required]],
            groupName: [this.selectedGroup ? this.selectedGroup.group.name : null, [Validators.required]],
            verifierGroup: [this.selectedGroup ? this.selectedGroup.group.verifierGroup : false],
            entitlements: this.fb.array([]),
        });
    }

    get f() {
        return this.form.controls;
    }

    showForm() {
        this.entitlementsList.forEach((x: any, indx: number) => {
            this.pushTransferForm(x, indx);
        });
        if (this.selectedGroup) {
            let users = this.entitlements.value.filter((obj: any) => obj.isActive == true);
            this.enableButton = !(users.length > 0);
        }
    }

    get entitlements(): FormArray {
        return this.form.get('entitlements') as FormArray;
    }

    addEntitlement(event: any, index: any) {
        this.entitlements.controls[index].value.isActive = event.checked;
        let users = this.entitlements.value.filter((obj: any) => obj.isActive == true);
        this.enableButton = !(users.length > 0);
    }

    public pushTransferForm(data: any, indx: number) {
        const entitlementsForm = this.form.controls['entitlements'] as FormArray;
        let existingEntitlements: Array<any> = this.selectedGroup?.workFlowDefinition || [];
        let matchedEntitlements: Array<any> = existingEntitlements.filter((obj: any) => {
            if (obj.entitlement.entitleId === data.entitleId) {
                obj.isActive = true;
                obj.entitlement = data;
                return true;
            }
            return false;
        });
        if (matchedEntitlements.length === 0) {
            matchedEntitlements.push({
                isActive: false,
                defintionId: null,
                minLimit: 0,
                maxLimit: 0,
                dailyLimit: 0,
                affirmationCount: 1,
                sequential: false,
                entitlement: data,
            });
        }
        const entitlementForm = this.fb.group({
            isActive: [matchedEntitlements[0].isActive],
            applyForAll: false,
            definitionId: [matchedEntitlements[0].definitionId],
            minLimit: [matchedEntitlements[0].minLimit, [Validators.required]],
            maxLimit: [matchedEntitlements[0].maxLimit, [Validators.required, this.checkLimit('minLimit', indx)]],
            dailyLimit: [matchedEntitlements[0].dailyLimit, [Validators.required, this.checkLimit('maxLimit', indx)]],
            affirmationCount: [matchedEntitlements[0].affirmationCount, [Validators.required]],
            sequential: [matchedEntitlements[0].sequential],
            entitlement: [matchedEntitlements[0].entitlement],
        });
        entitlementsForm.push(entitlementForm);
    }

    public checkLimit(type: string, indx: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value && control.value != '') {
                const misMatch = this.entitlements?.controls[indx]?.value?.[type] > control.value;
                return misMatch ? { mismatch: { value: control.value } } : null;
            }
            return null;
        };
    }

    getformGroup(index: number, controlName: string) {
        const entitlementsForm = this.form.controls['entitlements'] as FormArray;
        const group = entitlementsForm.at(index) as FormGroup;
        return group.controls[controlName];
    }

    resetFormField(controlName: string, index: number) {
        const entitlementsForm = this.form.controls['entitlements'] as FormArray;
        const group = entitlementsForm.at(index) as FormGroup;
        group.controls[controlName].reset();
    }

    goBack() {
        this.router.navigate(['home/group-management/search']);
    }

    onSelectGroup(target: any) {
        if (this.selectedGroup) return;
        this.showEntitlementsSection = false;
        this.selectedUserId = this.rimsList.filter((rim: any) => rim.uniqueUserId == target.value)[0] || null;
        this.showEntitlementsSection = this.selectedUserId ? true : false;
    }

    getEntitlementName(index: number) {
        return this.entitlementsList[index].name;
    }

    searchRIM(target: any) {
        this.sandbox.searchUserByRIM({ rim: target.value, registered: true }).subscribe((res: any) => {
            if (res.data) {
                this.rimsList = res.data;
            }
        });
    }

    sendRequest() {
        const formData = this.form.value;
        let workFlows: Array<any> = formData.entitlements.map((el: any) => {
            delete el.applyForAll;
            return el;
        });

        let payload: any = {
            customer: this.selectedUserId,
            group: {
                name: formData.groupName,
                verifierGroup: formData.verifierGroup,
            },
            workFlowDefinition: workFlows,
        };
        if (workFlows.length > 0) {
            if (this.selectedGroup) {
                payload.group.groupId = this.selectedGroup.group.groupId;
                this.sandbox
                    .updateGroup(payload, { validateGroupId: this.selectedGroup.group.groupId })
                    .subscribe((res: any) => {
                        if (res.data) {
                            this.goBack();
                        }
                    });
            } else {
                this.sandbox.createGroup(payload).subscribe((res: any) => {
                    if (res.data) {
                        this.goBack();
                    }
                });
            }
        }
    }

    changeSequence(event: any) {
        this.entitlements.value.forEach((el: any, i: any) => {
            const myForm: any = (<FormArray>this.form.get('entitlements')).at(i);
            myForm.controls['sequential'].setValue(false);
            myForm.controls['affirmationCount'].setValue(1);
        });
    }

    setForAll(event: any, index: any) {
        if (event.checked)
            this.entitlements.value.forEach((el: any, i: any) => {
                const myForm: any = (<FormArray>this.form.get('entitlements')).at(i);
                myForm.patchValue({
                    minLimit: event.checked ? this.entitlements.value[index].minLimit : 0,
                    maxLimit: event.checked ? this.entitlements.value[index].maxLimit : 0,
                    dailyLimit: event.checked ? this.entitlements.value[index].dailyLimit : 0,
                    affirmationCount: event.checked ? this.entitlements.value[index].affirmationCount : 1,
                    sequential: event.checked ? this.entitlements.value[index].sequential : false,
                    applyForAll: event.checked && i == index ? true : false,
                    isActive: event.checked ? this.entitlements.value[index].isActive : false,
                });
            });
    }
}
