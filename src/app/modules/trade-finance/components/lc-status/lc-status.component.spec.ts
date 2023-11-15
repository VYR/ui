import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcStatusComponent } from './lc-status.component';

describe('LcStatusComponent', () => {
    let component: LcStatusComponent;
    let fixture: ComponentFixture<LcStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcStatusComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
