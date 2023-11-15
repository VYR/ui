import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcDraftsComponent } from './lc-drafts.component';

describe('LcDraftsComponent', () => {
    let component: LcDraftsComponent;
    let fixture: ComponentFixture<LcDraftsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcDraftsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcDraftsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
