import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverRequestsComponent } from './approver-requests.component';

describe('ApproverRequestsComponent', () => {
    let component: ApproverRequestsComponent;
    let fixture: ComponentFixture<ApproverRequestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApproverRequestsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ApproverRequestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
