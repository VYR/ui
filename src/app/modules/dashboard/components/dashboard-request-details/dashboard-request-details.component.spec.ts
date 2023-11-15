import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRequestDetailsComponent } from './dashboard-request-details.component';

describe('DashboardRequestDetailsComponent', () => {
    let component: DashboardRequestDetailsComponent;
    let fixture: ComponentFixture<DashboardRequestDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardRequestDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardRequestDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
