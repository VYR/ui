import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcViewComponent } from './lc-view.component';

describe('LcViewComponent', () => {
    let component: LcViewComponent;
    let fixture: ComponentFixture<LcViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
