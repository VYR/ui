import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevolvingLimitsComponent } from './revolving-limits.component';

describe('RevolvingLimitsComponent', () => {
    let component: RevolvingLimitsComponent;
    let fixture: ComponentFixture<RevolvingLimitsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RevolvingLimitsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RevolvingLimitsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
