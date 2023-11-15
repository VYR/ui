import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdminGroupManagementComponent } from './bank-admin-group-management.component';

describe('BankAdminGroupManagementComponent', () => {
    let component: BankAdminGroupManagementComponent;
    let fixture: ComponentFixture<BankAdminGroupManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BankAdminGroupManagementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BankAdminGroupManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
