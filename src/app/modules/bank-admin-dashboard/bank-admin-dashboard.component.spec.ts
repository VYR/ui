import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdminDashboardComponent } from './bank-admin-dashboard.component';

describe('BankAdminDashboardComponent', () => {
    let component: BankAdminDashboardComponent;
    let fixture: ComponentFixture<BankAdminDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BankAdminDashboardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BankAdminDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
