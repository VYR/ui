import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcPreviewComponent } from './lc-preview.component';

describe('LcPreviewComponent', () => {
    let component: LcPreviewComponent;
    let fixture: ComponentFixture<LcPreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcPreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
