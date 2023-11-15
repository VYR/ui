import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcStatusViewComponent } from './lc-status-view.component';

describe('LcStatusViewComponent', () => {
    let component: LcStatusViewComponent;
    let fixture: ComponentFixture<LcStatusViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcStatusViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcStatusViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
