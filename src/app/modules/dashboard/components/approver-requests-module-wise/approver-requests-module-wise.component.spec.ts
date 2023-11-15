import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverRequestsModuleWiseComponent } from './approver-requests-module-wise.component';

describe('ApproverRequestsModuleWiseComponent', () => {
    let component: ApproverRequestsModuleWiseComponent;
    let fixture: ComponentFixture<ApproverRequestsModuleWiseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApproverRequestsModuleWiseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ApproverRequestsModuleWiseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
