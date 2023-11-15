import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsApprovalsComponent } from './operations-approvals.component';

describe('OperationsApprovalsComponent', () => {
    let component: OperationsApprovalsComponent;
    let fixture: ComponentFixture<OperationsApprovalsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OperationsApprovalsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OperationsApprovalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
