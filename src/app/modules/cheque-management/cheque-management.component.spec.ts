import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeManagementComponent } from './cheque-management.component';

describe('ChequeManagementComponent', () => {
    let component: ChequeManagementComponent;
    let fixture: ComponentFixture<ChequeManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChequeManagementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChequeManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
