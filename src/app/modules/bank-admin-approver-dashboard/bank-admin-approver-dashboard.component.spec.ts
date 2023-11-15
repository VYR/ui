import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdminApproverDashboardComponent } from './bank-admin-approver-dashboard.component';

describe('BankAdminApproverDashboardComponent', () => {
    let component: BankAdminApproverDashboardComponent;
    let fixture: ComponentFixture<BankAdminApproverDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BankAdminApproverDashboardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BankAdminApproverDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
