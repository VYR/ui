import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutPopupComponent } from './timeout-popup.component';

describe('TimeoutPopupComponent', () => {
    let component: TimeoutPopupComponent;
    let fixture: ComponentFixture<TimeoutPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimeoutPopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TimeoutPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
