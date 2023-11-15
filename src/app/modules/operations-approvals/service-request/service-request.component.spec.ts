import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcInquiryComponent } from './lc-inquiry.component';

describe('LcInquiryComponent', () => {
    let component: LcInquiryComponent;
    let fixture: ComponentFixture<LcInquiryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcInquiryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcInquiryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
